const { Kafka: kafkajs } = require('kafkajs')

const getKafkaConfig = _ => {
  const kafka_endpoint = process.env.KAFKA_ENDPOINT
  const kafka_port = process.env.KAFKA_PORT || 9092
  return {
    clientId: "my-producer",
    brokers: [`${kafka_endpoint}:${kafka_port}`],
  }
}

const kafka_config = getKafkaConfig()

class Kafka {
  constructor() {
    console.log(kafka_config)
    this.kafka = new kafkajs(kafka_config);
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log('Producer connected');
  }

  async sendMessage(topic, messages) {
    await this.producer.send({
      topic: topic,
      messages: messages.map(message => ({ value: message })),
    });
    console.log('Message sent:', messages);
  }

  async disconnect() {
    await this.producer.disconnect();
    console.log('Producer disconnected');
  }
}

module.exports = Kafka;
