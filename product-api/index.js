const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./ProductModel');
const connectDB = require('./connectDB');

const app = express();
const port = process.env.PORT || 3000;

connectDB().then(async () => {
  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    const products = [
      { name: 'DVD The Haunting Shadows', price: 80, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunting+Shadows' },
      { name: 'DVD Whispers in the Dark', price: 20, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Whispers+in+the+Dark' },
      { name: 'DVD The Dollmaker\'s Secret', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Dollmaker\'s+Secret' },
      { name: 'DVD Echoes of the Past', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Echoes+of+the Past' },
      { name: 'DVD The Cursed Mirror', price: 50, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Cursed Mirror' },
      { name: 'DVD Nightmare Symphony', price: 10, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Nightmare Symphony' },
      { name: 'DVD The Forgotten Cemetery', price: 60, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Forgotten Cemetery' },
      { name: 'DVD The Haunted Carnival', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunted Carnival' },
    ];

    await Product.insertMany(products);
    console.log('Initial products have been saved.');
  }
});

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
