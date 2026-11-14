const { pool } = require('../config/db');
const env = require('../config/env');
const { encodeBase62 } = require('../utils/base62');

function formatUrlRow(row) {
  return {
    short_code: row.short_code,
    short_url: `http://localhost:${env.port}/${row.short_code}`,
    long_url: row.long_url,
    clicks: row.clicks,
    expires_at: row.expires_at,
    created_at: row.created_at,
  };
}

async function getRecentUrls() {
  const [rows] = await pool.query(
    `SELECT short_code, long_url, clicks, expires_at, created_at
     FROM urls
     WHERE short_code IS NOT NULL
     ORDER BY created_at DESC
     LIMIT 20`
  );
  return rows.map(formatUrlRow);
}

async function createShortUrl({ long_url, custom_alias, expires_in_days }) {
  const cleanUrl = long_url.trim();
  const expiresAt = expires_in_days
    ? new Date(Date.now() + Number(expires_in_days) * 86400000)
    : null;

  // Path A: User provided a custom alias
  if (custom_alias && custom_alias.trim()) {
    const alias = custom_alias.trim();

    if (!/^[a-zA-Z0-9_-]{3,10}$/.test(alias)) {
      const err = new Error('Custom alias must be 3–10 alphanumeric characters, hyphens, or underscores');
      err.statusCode = 400;
      throw err;
    }

    try {
      const [result] = await pool.query(
        'INSERT INTO urls (short_code, long_url, expires_at) VALUES (?, ?, ?)',
        [alias, cleanUrl, expiresAt]
      );

      const [rows] = await pool.query(
        'SELECT short_code, long_url, clicks, expires_at, created_at FROM urls WHERE id = ?',
        [result.insertId]
      );
      return formatUrlRow(rows[0]);
    } catch (err) {
      // ER_DUP_ENTRY: MySQL UNIQUE index caught a duplicate alias
      if (err.code === 'ER_DUP_ENTRY') {
        const dupErr = new Error('Custom alias is already in use');
        dupErr.statusCode = 409;
        throw dupErr;
      }
      throw err;
    }
  }

  // Path B: Auto-generate collision-free Base62 code inside an ACID transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert row to claim an atomic AUTO_INCREMENT id
    const [insertResult] = await connection.query(
      'INSERT INTO urls (long_url, expires_at) VALUES (?, ?)',
      [cleanUrl, expiresAt]
    );

    // 2. Encode that unique id into Base62
    const shortCode = encodeBase62(insertResult.insertId);

    // 3. Update the row with its Base62 short_code
    await connection.query(
      'UPDATE urls SET short_code = ? WHERE id = ?',
      [shortCode, insertResult.insertId]
    );

    const [rows] = await connection.query(
      'SELECT short_code, long_url, clicks, expires_at, created_at FROM urls WHERE id = ?',
      [insertResult.insertId]
    );

    await connection.commit();
    return formatUrlRow(rows[0]);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function resolveShortCode(shortCode) {
  // Fast O(log N) lookup via idx_short_code B-Tree index
  const [rows] = await pool.query(
    'SELECT id, long_url, expires_at FROM urls WHERE short_code = ?',
    [shortCode]
  );

  if (rows.length === 0) {
    const err = new Error('Short URL not found');
    err.statusCode = 404;
    throw err;
  }

  const record = rows[0];

  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    const err = new Error('This short link has expired');
    err.statusCode = 410;
    throw err;
  }

  // Increment click counter in MySQL
  await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE id = ?', [record.id]);

  return record.long_url;
}

module.exports = { getRecentUrls, createShortUrl, resolveShortCode };