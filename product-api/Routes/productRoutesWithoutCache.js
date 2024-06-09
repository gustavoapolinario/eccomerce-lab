const express = require('express');
const Database = require('../Database/Database');
const RouteErrorHandler = require('../RouteErrorHandler');

const router = express.Router();
const db = new Database();

// Get all products without caching
router.get('/products-without-cache', RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  res.status(200).json(products);
}));

router.get('/products-without-cache/:id', RouteErrorHandler(async (req, res) => {
  const productId = req.params.id
  const product = await db.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}));

module.exports = router;
