const Queue = require('./Queue/Queue');

const queue_name = 'buy_requests';

class Consumer {
  constructor() {
    this.queue = new Queue();
  }
  
  async createConsumer() {
    const consumer = async (msg) => {
      if (msg !== null) {
        console.log(`[x] Received: ${msg.content.toString()}`);
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
