const express = require('express');
const router = express.Router();

const healthCheckRoute = consumer => {
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

  /**
   * Health check to test integrations, don't use as Liveness Probes health check
   * The health check need to test the health of the service, not the databases.
   * But this route can help in troubleshooting
   */
  router.get('/healthcheck-integrations', async (req, res) => {
    try {
      console.log("/healthcheck-integrations")
      const health = await consumer.healthcheck();

      console.log("/healthcheck-integrations ok")
      if ( health )
        res.status(200).json({ status: 'healthy' });
      else {
        res.status(500).json({ status: 'unhealthy' });
      }
    } catch (err) {
      console.error('Health check failed:', err);
      res.status(500).json({ status: 'unhealthy', error: err.message });
    }
  });

  return router
}

module.exports = healthCheckRoute;
