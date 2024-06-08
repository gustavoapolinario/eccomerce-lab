const express = require('express');
const Cache = require('./Cache/Cache');
const Database = require('./Database/Database');
const RouteErrorHandler = require('./RouteErrorHandler');

const router = express.Router();
const cache = new Cache();
const db = new Database();

// Buy a product by ID
router.post('/buy/:id', RouteErrorHandler(async (req, res) => {
  const product = await db.getProductById(req.params.id);
  if (product) {
    // Invalidate the cache after buying a product
    await cache.deleteProductsAsync();
    res.json({ message: `Successfully bought ${product.name}` });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}));

module.exports = router;
