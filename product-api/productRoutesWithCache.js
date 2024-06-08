const express = require('express');
const Cache = require('./Cache/Cache');
const Database = require('./Database/Database');
const RouteErrorHandler = require('./RouteErrorHandler');

const router = express.Router();
const cache = new Cache();
const db = new Database();

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
router.get('/products', checkCache, RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  await cache.cacheProductsAsync(products);
  res.status(200).json(products);
}));

module.exports = router;
