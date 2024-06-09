const express = require('express');
const cors = require('cors');
const productRoutes = require('./Routes/productRoutes');
const productRoutesWithoutCache = require('./Routes/productRoutesWithoutCache');
const healthcheck = require('./Routes/healthCheckRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use routes
app.use(productRoutes);
app.use(productRoutesWithoutCache);
app.use(healthcheck);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
