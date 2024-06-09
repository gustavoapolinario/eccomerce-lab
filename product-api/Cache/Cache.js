const redis = require('redis');

const getRedisUrl = _ => {
  const redis_endpoint = process.env.REDIS_ENDPOINT;
  const redis_port = process.env.REDIS_PORT;
  const redis_username = process.env.REDIS_USERNAME;
  const redis_password = process.env.REDIS_PASSWORD;
  return `redis://${redis_username}:${redis_password}@${redis_endpoint}:${redis_port}`;
}
const redis_url = getRedisUrl();

class Cache {
  constructor() {
    this.client = redis.createClient({
      url: redis_url
    });
    this.client.connect()
    process.on("exit", function(){
      this.client.quit();
    });
  }

  async cacheProductListAsync(products) {
    await this.client.setEx('products', 3600, JSON.stringify(products)); // Cache the products for 1 hour
  }

  async deleteProductListAsync() {
    await this.client.del('products');
  }

  async getProductListAsync() {
    const data = await this.client.get('products');
    return data ? JSON.parse(data) : null;
  }

  async cacheProductAsync(productId, product) {
    await this.client.setEx(`product-${productId}`, 3600, JSON.stringify(product)); // Cache the products for 1 hour
  }

  async deleteProductAsync(productId) {
    await this.client.del(`product-${productId}`);
  }

  async getProductAsync(productId) {
    const data = await this.client.get(`product-${productId}`);
    return data ? JSON.parse(data) : null;
  }

  async close() {
    this.client.quit();
  }
}

module.exports = Cache;
