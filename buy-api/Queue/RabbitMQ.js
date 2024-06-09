const amqp = require('amqplib');

const getRabbitMQUrl = _ => {
  const rabbitmq_endpoint = process.env.RABBITMQ_ENDPOINT;
  const rabbitmq_port = process.env.RABBITMQ_PORT || 5672;
  const rabbitmq_username = process.env.RABBITMQ_USERNAME;
  const rabbitmq_password = process.env.RABBITMQ_PASSWORD;
  return `amqp://${rabbitmq_username}:${rabbitmq_password}@${rabbitmq_endpoint}:${rabbitmq_port}`;
}
const rabbitMQ_url = getRabbitMQUrl();

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if( !this.connection )
      this.connection = await amqp.connect(rabbitMQ_url)
  }

  async connectChannel() {
    if (!this.channel) {
      await this.connect()
      this.channel = await this.connection.createChannel();
    }
  }

  async assertExchange(exchange, type, options) {
    await this.connectChannel()
    await this.channel.assertExchange(exchange, type, options);
  }

  async assertQueue(queue, options) {
    await this.connectChannel()
    await this.channel.assertQueue(queue, options);
  }

  async bindQueue(queue, exchange, routingKey) {
    await this.connectChannel()
    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async publish(exchange, routingKey, message) {
    await this.connectChannel()
    await this.channel.publish(exchange, routingKey, Buffer.from(message));
    console.log('Sent message to RabbitMQ:', message);
  }

  async closeConnection() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  async closeChannel() {
    if (this.channel) {
      await this.channel.close();
    }
  }

  async close() {
    this.closeChannel()
    this.closeConnection()
  }
}

module.exports = RabbitMQ;
