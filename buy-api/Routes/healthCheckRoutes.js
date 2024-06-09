const express = require('express');
const router = express.Router();

/**
 * Health check to be used on Liveness Probes health check
 */
router.get('/healthcheck', async (req, res) => {
  try {
    res.status(200).json({ status: 'healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

module.exports = router;
