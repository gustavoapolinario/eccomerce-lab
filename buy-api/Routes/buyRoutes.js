const express = require('express');
const RouteErrorHandler = require('../RouteErrorHandler');
const Queue = require('../Queue/Queue');

const router = express.Router();

const axios = require('axios');
const product_api_url = process.env.PRODUCT_API_URL;


const getProduct = async (productId) => {
  const productResponse = await axios.get(`${product_api_url}/products/${productId}`);
  return productResponse.data;
};

const publishBuyRequest = async (product) => {
  const queue = new Queue();

  const queue_name = 'buy_requests';
  const msg = JSON.stringify({ productId: product._id, productName: product.name });
  queue.sendMessage(queue_name, msg);
  queue.close();
};

// Buy a product by ID
router.post('/buy/:id', RouteErrorHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await getProduct(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await publishBuyRequest(product);
  res.json({ message: `Your purchase of ${product.name} has been accepted, we will process it shortly.` });
}));

module.exports = router;
