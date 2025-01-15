const { Kafka } = require('kafkajs');
const db = require('./db');

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

        if (topic === 'confirm-order') {
          const { order_id, action } = data;
          try {
            if (action === 'cart') {
              const query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{cart_deleted}\', \'\')  WHERE id = ?';
              const params = [order_id];
              await db.query(query, params);
            } else if (action === 'inventory') {
              const query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{inventory-reduced}\', \'\') WHERE id = ?';
              const params = [order_id];
              await db.query(query, params);
            }
          } catch (err) {
            console.error('Failed to update order:', err);
          }
        }
        else if (topic === 'cancel-order') {
          const { order_id, action } = data;
          try {
            if (action === 'inventory') {
              const query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{inventory-increased}\', \'\')  WHERE id = ?';
              const params = [order_id];
              await db.query(query, params);
            } 
          } catch (err) {
            console.error('Failed to update order:', err);
          }
        }
      }
    });
  };
  
  runConsumer().catch(console.error);
}