const redis = require('redis');

class Cache {
  constructor() {
    const redis_endpoint = process.env.REDIS_ENDPOINT;
    const redis_port = process.env.REDIS_PORT;
    const redis_username = process.env.REDIS_USERNAME;
    const redis_password = process.env.REDIS_PASSWORD;
    const redisUrl = `redis://${redis_username}:${redis_password}@${redis_endpoint}:${redis_port}`;

    this.client = redis.createClient({
      url: redisUrl
    });

    this.client.on('error', (err) => {
      console.error('Redis error: ', err);
    });

    this.client.connect().catch(console.error);
  }

  async cacheProductListAsync(products) {
    try {
      await this.client.setEx('products', 3600, JSON.stringify(products)); // Cache the products for 1 hour
    } catch (err) {
      console.error('Failed to cache products:', err);
    }
  }

  async deleteProductListAsync() {
    try {
      await this.client.del('products');
    } catch (err) {
      console.error('Failed to delete cache:', err);
    }
  }

  async getProductListAsync() {
    try {
      const data = await this.client.get('products');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Failed to get products from cache:', err);
      return null;
    }
  }

  async cacheProductAsync(productId, product) {
    try {
      await this.client.setEx(`product-${productId}`, 3600, JSON.stringify(product)); // Cache the products for 1 hour
    } catch (err) {
      console.error('Failed to cache products:', err);
    }
  }

  async deleteProductAsync(productId) {
    try {
      await this.client.del(`product-${productId}`);
    } catch (err) {
      console.error('Failed to delete cache:', err);
    }
  }

  async getProductAsync(productId) {
    try {
      const data = await this.client.get(`product-${productId}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Failed to get products from cache:', err);
      return null;
    }
  }
}

module.exports = Cache;
