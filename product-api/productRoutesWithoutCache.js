const express = require('express');
const Database = require('./Database/Database');
const RouteErrorHandler = require('./RouteErrorHandler');

const router = express.Router();
const db = new Database();

// Get all products without caching
router.get('/products-without-cache', RouteErrorHandler(async (req, res) => {
  const products = await db.getProducts();
  res.status(200).json(products);
}));

module.exports = router;
