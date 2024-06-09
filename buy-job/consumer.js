const Queue = require('./Queue/Queue');
const Event = require('./Event/Event');

const queue_name = 'buy_requests';

class Consumer {
  constructor() {
    this.queue = new Queue();
    this.event = new Event();
  }
  
  async createConsumer() {
    const consumer = async (msg) => {
      if (msg !== null) {
        const msg_str = msg.content.toString()
        console.log(`[x] Received: ${msg_str}`);

        await this.event.connect();

        const result = await this.event.sendMessage('test-topic', [msg_str]);

        // await this.event.disconnect();

        // Acknowledge the message
        this.queue.ack(msg);
      }
    };

    console.log(`[*] Waiting for messages in queue ${queue_name}`);
    await this.queue.createConsumer(queue_name, consumer)
  }

  async healthcheck() {
    let result = await this.queue.verifyConnection()
    if( !result ) {
      await this.createConsumer()
      result = await this.queue.verifyConnection()
    }
    return result
  }

}

module.exports = Consumer
