const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const products = [
    { id: 1, name: 'DVD The Haunting Shadows', price: 80, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunting+Shadows' },
    { id: 2, name: 'DVD Whispers in the Dark', price: 20, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Whispers+in+the+Dark' },
    { id: 3, name: 'DVD The Dollmaker\'s Secret', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Dollmaker\'s+Secret' },
    { id: 4, name: 'DVD Echoes of the Past', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Echoes+of+the Past' },
    { id: 5, name: 'DVD The Cursed Mirror', price: 50, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Cursed Mirror' },
    { id: 6, name: 'DVD Nightmare Symphony', price: 10, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Nightmare Symphony' },
    { id: 7, name: 'DVD The Forgotten Cemetery', price: 60, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Forgotten Cemetery' },
    { id: 8, name: 'DVD The Haunted Carnival', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunted Carnival' },
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/buy/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json({ message: `Successfully bought ${product.name}` });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
