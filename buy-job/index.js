const express = require('express');
const healthcheck = require('./Routes/healthCheckRoutes');
const Consumer = require('./consumer');
const consumer = new Consumer()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use routes
app.use(healthcheck(consumer));

consumer.createConsumer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
