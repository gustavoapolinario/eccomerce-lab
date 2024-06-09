const mongoose = require('mongoose');
const ProductModel = require('./ProductModel');

getMongoDBUrl = _ => {
  const mongodb_endpoint = process.env.MONGODB_ENDPOINT;
  const mongodb_port = process.env.MONGODB_PORT || 27017;
  const mongodb_username = process.env.MONGODB_USERNAME;
  const mongodb_password = process.env.MONGODB_PASSWORD;
  const mongodb_database = process.env.MONGODB_DATABASE;
  return `mongodb://${mongodb_username}:${mongodb_password}@${mongodb_endpoint}:${mongodb_port}/${mongodb_database}`;
}
const mongodb_url = getMongoDBUrl();

class Database {
  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      await mongoose.connect(mongodb_url);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1); // Exit process with failure
    }
  }

  async getProducts() {
    try {
      return await ProductModel.find();
    } catch (err) {
      console.error('Failed to get products', err);
      throw err;
    }
  }

  async getProductById(id) {
    try {
      return await ProductModel.findById(id);
    } catch (err) {
      console.error('Failed to get product by ID', err);
      throw err;
    }
  }
}

module.exports = Database;
