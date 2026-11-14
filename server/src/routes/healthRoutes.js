const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// Used by Docker, Kubernetes Liveness/Readiness probes, and Step 3 UI check
router.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    err.statusCode = 503;
    next(err);
  }
});

module.exports = router;