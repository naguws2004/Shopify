const { Kafka } = require('kafkajs');
const db = require('./db');

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

const reduceInventory = async (product_id) => {
  try {
    const payloads = {
      topic: 'reduce-inventory', 
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ product_id }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

const increaseInventory = async (order_id) => {
  try {
    const query = 'SELECT product_id FROM order_details WHERE id = ?';
    const params = [order_id];

    const [rows] = await db.query(query, params);

    const productIds = rows.map(row => row.product_id);

    productIds.forEach(async product_id => {
      const payloads = {
        topic: 'increase-inventory',
        partition: 0,
        key: "new_message",
        messages: [{ value: JSON.stringify({ product_id }) }]
      };
      await producer.send(payloads);
      console.log('Kafka event sent:', payloads);
    });
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

// Update Address
const updateAddress = async (order_id, address, city, state, pincode, contactno) => {
  try {
    const query = 'SELECT user_id FROM orders WHERE id = ?';
    const params = [order_id];

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      throw new Error('Order not found');
    }

    const user_id = rows[0].user_id;

    const payloads = {
      topic: 'update-address',
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ user_id, address, city, state, pincode, contactno }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

// Delete Cart
const deleteCart = async (order_id) => {
  try {
    const query = 'SELECT user_id FROM orders WHERE id = ?';
    const params = [order_id];

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      throw new Error('Order not found');
    }

    const user_id = rows[0].user_id;

    const payloads = {
      topic: 'delete-cart',
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ user_id }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

module.exports = {
  reduceInventory,
  increaseInventory,
  updateAddress,
  deleteCart
};