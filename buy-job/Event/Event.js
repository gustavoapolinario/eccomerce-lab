const Kafka = require('./Kafka');


class Event {
  constructor() {
    this.kafka = new Kafka();
  }

  async connect() {
    await this.kafka.connect()
  }

  async sendMessage(topic, messages) {
    await this.kafka.sendMessage(topic, messages)
  }

  async disconnect() {
    await this.kafka.disconnect()
  }
}

module.exports = Event;
