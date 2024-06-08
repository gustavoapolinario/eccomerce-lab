const mongoose = require('mongoose');
const ProductModel = require('./ProductModel');

class Database {
  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      const mongodb_endpoint = process.env.MONGODB_ENDPOINT;
      const mongodb_port = process.env.MONGODB_PORT;
      const mongodb_username = process.env.MONGODB_USERNAME;
      const mongodb_password = process.env.MONGODB_PASSWORD;
      const mongodb_database = process.env.MONGODB_DATABASE;

      await mongoose.connect(`mongodb://${mongodb_username}:${mongodb_password}@${mongodb_endpoint}:${mongodb_port}/${mongodb_database}`);
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
