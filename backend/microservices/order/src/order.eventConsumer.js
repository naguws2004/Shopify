const { Kafka } = require('kafkajs');
const { dbInternalUpdateOrder } = require('./order.repository');

module.exports = async () => {
  const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['172.31.128.1:9092']
  });

  const consumer = kafka.consumer({ groupId: 'order-group' });

  const runConsumer = async () => {
    await consumer.connect();
    console.log('Kafka Consumer is connected and ready.');

    await consumer.subscribe({ topic: 'confirm-order', fromBeginning: true });
    await consumer.subscribe({ topic: 'cancel-order', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(`Received message on topic ${topic}:`, message.value.toString());
        const data = JSON.parse(message.value.toString());
        const { order_id, action } = data;
        try {
          await dbInternalUpdateOrder(order_id, topic, action);
        } catch (err) {
          console.error('Failed to update order:', err);
        }
      }
    });
  };
  
  runConsumer().catch(console.error);
}