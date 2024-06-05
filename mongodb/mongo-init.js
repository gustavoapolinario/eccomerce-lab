// mongo-init.js
db = db.getSiblingDB('products'); // Connect to your database (e.g., 'test')
db.createUser({
  user: 'product-api',
  pwd: 'product-api-password',
  roles: [
    {
      role: 'readWrite',
      db: 'products'
    }
  ]
});

// Optional: Initialize collections and documents
db.createCollection('products');

const products = [
  { name: 'DVD The Haunting Shadows', price: 80, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunting+Shadows' },
  { name: 'DVD Whispers in the Dark', price: 20, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Whispers+in+the+Dark' },
  { name: 'DVD The Dollmaker\'s Secret', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Dollmaker\'s+Secret' },
  { name: 'DVD Echoes of the Past', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Echoes+of+the+Past' },
  { name: 'DVD The Cursed Mirror', price: 50, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Cursed+Mirror' },
  { name: 'DVD Nightmare Symphony', price: 10, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=Nightmare+Symphony' },
  { name: 'DVD The Forgotten Cemetery', price: 60, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Forgotten+Cemetery' },
  { name: 'DVD The Haunted Carnival', price: 30, image: 'https://placehold.co/150/000000/FFFFFF/?font=oswald&text=The+Haunted+Carnival' },
];

db.products.insertMany(products);
