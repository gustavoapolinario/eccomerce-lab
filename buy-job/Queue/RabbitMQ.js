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
    this.connected = false;

    process.on("exit", () => { this.close() });
  }

  async connect() {
    if( !this.connection || !this.connected ) {
      this.connected = true;
      this.connection = await amqp.connect(rabbitMQ_url)
      await this.createListeners()
    }
  }

  async createListeners() {

    this.connection.on('error', (err) => {
      console.log(err)
      this.connected = false;
    })

    this.connection.on('close', _ => this.connected = false)
    this.connection.on('blocked', _ => this.connected = false)
    this.connection.on('unblocked', _ => this.connected = true)
  }

  async connectChannel() {
    if (!this.channel || !this.connected) {
      await this.connect()
      this.channel = await this.connection.createChannel();
    }
  }

  async assertExchange(exchange, type, options) {
    await this.connectChannel()
    await this.channel.assertExchange(exchange, type, options);
  }

  async assertQueue(queue_name, options) {
    await this.connectChannel()
    await this.channel.assertQueue(queue_name, options);
  }

  async bindQueue(queue_name, exchange, routingKey) {
    await this.connectChannel()
    await this.channel.bindQueue(queue_name, exchange, routingKey);
  }

  async publish(exchange, routingKey, message) {
    await this.connectChannel()
    await this.channel.publish(exchange, routingKey, Buffer.from(message));
    console.log('Sent message to RabbitMQ:', message);
  }

  async consume(queue_name, consumer_fn) {
    await this.connectChannel()
    await this.channel.consume(queue_name, consumer_fn, {
        noAck: false
    });
  }

  async verifyConnection() {
    await this.connect()
    return this.connected
  }

  async ack(msg) {
    await this.channel.ack(msg);
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
    await this.closeChannel()
    await this.closeConnection()
  }
}

module.exports = RabbitMQ;
