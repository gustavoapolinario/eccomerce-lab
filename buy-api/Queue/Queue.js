const amqp = require('amqplib');
const RabbitMQ = require('./RabbitMQ')

class Queue {
  constructor() {
    this.rabbitmq = new RabbitMQ();
  }

  async createAndBindIfNotExist(queue, exchange, routingKey) {
    await this.rabbitmq.assertExchange(exchange, 'direct', { durable: true });
    await this.rabbitmq.assertQueue(queue, { durable: true });
    await this.rabbitmq.bindQueue(queue, exchange, routingKey);
  }

  async sendMessage(queue, msg) {
    const exchange = `${queue}`
    const routingKey = `${queue}`

    try {
      await this.createAndBindIfNotExist(queue, exchange, routingKey);
      await this.rabbitmq.publish(exchange, routingKey, msg);
    } catch (error) {
      console.error('Failed to publish buy request to Queue:', error);
      throw error;
    } finally {
      await this.rabbitmq.closeChannel();
      await this.rabbitmq.closeConnection();
    }
  }
}

module.exports = Queue;