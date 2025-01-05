const { Kafka } = require('kafkajs');
const db = require('./db');

module.exports = async () => {
  const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['172.31.128.1:9092']
  });

  const consumer = kafka.consumer({ groupId: 'inventory-group' });

  const runConsumer = async () => {
    await consumer.connect();
    console.log('Kafka Consumer is connected and ready.');

    await consumer.subscribe({ topic: 'reduce-inventory', fromBeginning: true });
    await consumer.subscribe({ topic: 'increase-inventory', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(`Received message on topic ${topic}:`, message.value.toString());

        const data = JSON.parse(message.value.toString());

        if (topic === 'reduce-inventory') {
          const { product_id } = data;
          try {
            const query = 'UPDATE products SET inventory = inventory - 1 WHERE id = ?';
            const params = [product_id];
            await db.query(query, params);
            console.log(`Inventory reduced for product_id: ${product_id}`);
          } catch (err) {
            console.error('Failed to reduce inventory:', err);
          }
        } else if (topic === 'increase-inventory') {
          const { product_id } = data;
          try {
            const query = 'UPDATE products SET inventory = inventory + 1 WHERE id = ?';
            const params = [product_id];
            await db.query(query, params);
            console.log(`Inventory increased for product_id: ${product_id}`);
          } catch (err) {
            console.error('Failed to increase inventory:', err);
          }
        }
      }
    });
  };

  runConsumer().catch(console.error);
}