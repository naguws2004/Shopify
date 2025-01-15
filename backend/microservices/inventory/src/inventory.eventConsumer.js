const { Kafka } = require('kafkajs');
const db = require('./db');
const { confirmOrder, cancelOrder } = require('./inventory.eventProducer');

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
          const { order_id, product_ids } = data;
          try {
            for (const product_id of product_ids) {
              const query = 'UPDATE products SET inventory = inventory - 1 WHERE id = ?';
              const params = [product_id];
              await db.query(query, params);
              console.log(`Inventory reduced for product_id: ${product_id}`);
            }
            await confirmOrder(order_id, 'inventory');
          } catch (err) {
            console.error('Failed to reduce inventory:', err);
          }
        } else if (topic === 'increase-inventory') {
          const { order_id, product_ids } = data;
          try {
            for (const product_id of product_ids) {
              const query = 'UPDATE products SET inventory = inventory + 1 WHERE id = ?';
              const params = [product_id];
              await db.query(query, params);
              console.log(`Inventory increased for product_id: ${product_id}`);
            }
            await cancelOrder(order_id, 'inventory');
          } catch (err) {
            console.error('Failed to increase inventory:', err);
          }
        }
      }
    });
  };

  runConsumer().catch(console.error);
}