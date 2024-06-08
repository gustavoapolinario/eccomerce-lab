const redis = require('redis');

class Cache {
  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://default:your_redis_password@localhost:6379';
    this.client = redis.createClient({
      url: redisUrl
    });

    this.client.on('error', (err) => {
      console.error('Redis error: ', err);
    });

    this.client.connect().catch(console.error);
  }

  async cacheProductsAsync(products) {
    try {
      await this.client.setEx('products', 3600, JSON.stringify(products)); // Cache the products for 1 hour
    } catch (err) {
      console.error('Failed to cache products:', err);
    }
  }

  async deleteProductsAsync() {
    try {
      await this.client.del('products');
    } catch (err) {
      console.error('Failed to delete cache:', err);
    }
  }

  async getProductsAsync() {
    try {
      const data = await this.client.get('products');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Failed to get products from cache:', err);
      return null;
    }
  }
}

module.exports = Cache;
