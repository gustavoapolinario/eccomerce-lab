const amqp = require('amqplib');
const RabbitMQ = require('./RabbitMQ')

class Queue {
  constructor() {
    this.rabbitmq = new RabbitMQ();
  }

  async createAndBindIfNotExist(queue_name, exchange, routingKey) {
    await this.rabbitmq.assertExchange(exchange, 'direct', { durable: true });
    await this.rabbitmq.assertQueue(queue_name, { durable: true });
    await this.rabbitmq.bindQueue(queue_name, exchange, routingKey);
  }

  async sendMessage(queue_name, msg) {
    const exchange = `${queue_name}`
    const routingKey = `${queue_name}`

    await this.createAndBindIfNotExist(queue_name, exchange, routingKey);
    await this.rabbitmq.publish(exchange, routingKey, msg);
  }

  async createConsumer(queue_name, consumer_fn) {
    await this.rabbitmq.consume(queue_name, consumer_fn);
  }

  async ack(msg) {
    await this.rabbitmq.ack(msg);
  }

  async verifyConnection() {
    return await this.rabbitmq.verifyConnection();
  }

  async close() {
    await this.rabbitmq.close();
  }
}

module.exports = Queue;