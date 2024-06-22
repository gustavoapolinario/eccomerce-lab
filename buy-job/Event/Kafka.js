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
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
  }

  async createTopic(topic) {
    try {
      await this.admin.connect();
      await this.admin.createTopics({
        topics: [{
          topic: topic,
          numPartitions: 3,
          replicationFactor: 1
        }]
      });
      console.log('Topic created successfully');
    } catch (error) {
      console.error('Error creating topic:', error);
    } finally {
      await this.admin.disconnect();
    }
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
