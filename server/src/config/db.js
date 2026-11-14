const mysql = require('mysql2/promise');
const env = require('./env');

// Create a reusable pool of 10 persistent MySQL connections
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fail-fast helper to verify MySQL is reachable on startup
async function verifyDbConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  console.log(`MySQL connected successfully to "${env.db.database}"`);
}

module.exports = { pool, verifyDbConnection };