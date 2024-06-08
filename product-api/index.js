const express = require('express');
const cors = require('cors');
const Cache = require('./Cache');
const Database = require('./Database');
const RouteErrorHandler = require('./RouteErrorHandler');

const app = express();
const port = process.env.PORT || 3000;
const cache = new Cache();
const db = new Database();

app.use(cors());
app.use(express.json());

// Middleware to check cache
const checkCache = async (req, res, next) => {
  try {
    const data = await cache.getProductsAsync();
    if (data) {
      return res.status(200).json(data);
    } else {
      next();
    }
  } catch (err) {
    console.error('Cache error: ', err);
    next();
  }
};

// Get all products with caching
app.get('/products', checkCache, RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  await cache.cacheProductsAsync(products);
  res.status(200).json(products);
}));

app.get('/products-without-cache', RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  res.status(200).json(products);
}));

// Buy a product by ID
app.post('/buy/:id', RouteErrorHandler(async (req, res) => {
  const product = await db.getProductById(req.params.id);
  if (product) {
    // Invalidate the cache after buying a product
    await cache.deleteProductsAsync();
    res.json({ message: `Successfully bought ${product.name}` });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
