const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./ProductModel');
const connectDB = require('./connectDB');

const app = express();
const port = process.env.PORT || 3000;

connectDB()
app.use(cors());
app.use(express.json());


app.get('/products', async (req, res, next) => {
  Product.find()
    .then(collection => res.status(200).json(collection))
    .catch(err => next(err));
});

app.post('/buy/:id', async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json({ message: `Successfully bought ${product.name}` });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
