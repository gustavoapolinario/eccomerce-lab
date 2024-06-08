const express = require('express');
const Cache = require('./Cache/Cache');
const Database = require('./Database/Database');
const router = express.Router();

const cache = new Cache();
const db = new Database();

/**
 * Health check to be used on Liveness Probes health check
 */
router.get('/healthcheck', async (req, res) => {
  try {
    // Check Redis connection
    await cache.client.ping();
    
    // Check MongoDB connection
    await db._connect();

    res.status(200).json({ status: 'healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

/**
 * Health check to test databases connection, don't use as Liveness Probes health check
 * The health check need to test the health of the service, not the databases.
 * But this route can help in troubleshooting
 */
router.get('/healthcheck-databases', async (req, res) => {
  try {
    // Check Redis connection
    await cache.client.ping();
    
    // Check MongoDB connection
    await db._connect();

    res.status(200).json({ status: 'healthy' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

module.exports = router;
