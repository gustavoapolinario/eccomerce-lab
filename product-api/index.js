const express = require('express');
const cors = require('cors');
const productRoutesWithCache = require('./productRoutesWithCache');
const productRoutesWithoutCache = require('./productRoutesWithoutCache');
const buyRoutes = require('./buyRoutes');
const healthcheck = require('./healthCheckRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use routes
app.use(productRoutesWithCache);
app.use(productRoutesWithoutCache);
app.use(buyRoutes);
app.use(healthcheck);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
