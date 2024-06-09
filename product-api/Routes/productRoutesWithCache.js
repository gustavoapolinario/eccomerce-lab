const express = require('express');
const Cache = require('../Cache/Cache');
const Database = require('../Database/Database');
const RouteErrorHandler = require('../RouteErrorHandler');

const router = express.Router();
const cache = new Cache();
const db = new Database();

// Middleware to check cache
const checkCache = async (req, res, next) => {
  try {
    const data = await cache.getProductListAsync();
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
router.get('/products', checkCache, RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  await cache.cacheProductListAsync(products);
  res.status(200).json(products);
}));

router.get('/products/:id', checkCache, RouteErrorHandler(async (req, res) => {
  const productId = req.params.id
  const product = await db.getProductById(productId);
  if (product) {
    await cache.cacheProductAsync(productId, product);
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}));

module.exports = router;
