const mongoose = require('mongoose');
const ProductModel = require('./ProductModel');

const getMongoDBUrl = _ => {
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
    await mongoose.connect(mongodb_url);
  }

  async getProducts() {
    return await ProductModel.find();
  }

  async getProductById(id) {
    return await ProductModel.findById(id);
  }
}

module.exports = Database;
