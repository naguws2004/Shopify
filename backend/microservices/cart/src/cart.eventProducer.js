const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['172.31.128.1:9092']
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer is connected and ready.');
};

runProducer().catch(console.error);

const confirmOrder = async (order_id, action) => {
  try {
    const payloads = {
      topic: 'confirm-order', 
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ order_id, action }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

module.exports = {
    confirmOrder
};