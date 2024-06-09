const express = require('express');
const RouteErrorHandler = require('../RouteErrorHandler');
const Queue = require('../Queue/Queue');

const router = express.Router();

const axios = require('axios');
const amqp = require('amqplib/callback_api');
const product_api_url = process.env.PRODUCT_API_URL;


const getProduct = async (productId) => {
  const productResponse = await axios.get(`${product_api_url}/products/${productId}`);
  return productResponse.data;
};

const publishBuyRequest = async (product) => {
  const queue = new Queue();

  const exchange = 'buy_requests';
  const msg = JSON.stringify({ productId: product._id, productName: product.name });
  queue.sendMessage(exchange, msg)

  // try {
  //   await rabbitmqClient.connect();
  //   const exchange = 'buy_requests';
  //   const msg = JSON.stringify({ productId: product._id, productName: product.name });

  //   await rabbitmqClient.assertExchange(exchange, 'fanout', { durable: false });
  //   await rabbitmqClient.publish(exchange, '', msg);
  // } catch (error) {
  //   console.error('Failed to publish buy request:', error);
  //   throw error;
  // } finally {
  //   await rabbitmqClient.close();
  // }
};

// module.exports = publishBuyRequest;



// const publishBuyRequest = (product) => {
//   return new Promise((resolve, reject) => {
//     const rabbitmq_endpoint = process.env.RABBITMQ_ENDPOINT;
//     const rabbitmq_port = process.env.RABBITMQ_PORT || 5672;
//     const rabbitmq_username = process.env.RABBITMQ_USERNAME;
//     const rabbitmq_password = process.env.RABBITMQ_PASSWORD;
//     const rabbitmq_url = `amqp://${rabbitmq_username}:${rabbitmq_password}@${rabbitmq_endpoint}:${rabbitmq_port}`;
//     amqp.connect(rabbitmq_url, (error0, connection) => {
//       if (error0) {
//         reject(new Error(`Failed to connect to RabbitMQ: ${rabbitmq_url}`));
//         return
//       }
//       connection.createChannel((error1, channel) => {
//         if (error1) {
//           reject(new Error('Failed to create RabbitMQ channel'));
//           return
//         }

//         const exchange = 'buy_requests';
//         const msg = JSON.stringify({ productId: product._id, productName: product.name });

//         channel.assertExchange(exchange, 'fanout', { durable: false });
//         channel.publish(exchange, '', Buffer.from(msg));
//         console.log("Sent buy request to RabbitMQ:", msg);

//         setTimeout(() => {
//           connection.close();
//           resolve();
//         }, 500);

//       });
//     });
//   })
// };



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
