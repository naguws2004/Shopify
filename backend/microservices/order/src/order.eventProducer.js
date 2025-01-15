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

const reduceInventory = async (order_id, product_ids) => {
  try {
    const payloads = {
      topic: 'reduce-inventory', 
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ order_id, product_ids }) }]
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
    const product_ids = rows.map(row => row.product_id);
    const payloads = {
      topic: 'increase-inventory',
      partition: 0,
      key: "new_message",
      messages: [{ value: JSON.stringify({ order_id, product_ids }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
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
      messages: [{ value: JSON.stringify({ order_id, user_id }) }]
    };
    await producer.send(payloads);
    console.log('Kafka event sent:', payloads);
  } catch (err) {
    console.error('Failed to send Kafka event:', err);
    throw err;
  }
};

// Confirm Update
const confirmUpdate = async (order_id, action) => {
  try {
    if (action === 'address') {
      const query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{address_added}\', \'\')  WHERE id = ?';
      const params = [order_id];
      await db.query(query, params);
    } else if (action === 'products') {
      const query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{products_added}\', \'\') WHERE id = ?';
      const params = [order_id];
      await db.query(query, params);
    }
  } catch (err) {
    console.error('Failed to update order:', err);
    throw err;
  }
};

// Timer-based execution
const startTimer = async (interval, order_id) => {
  console.log('Timer started.');
  const timerId = setInterval(async () => {
    try {
      console.log('Timer running.');
      // Fetch orders that need to be updated
      const [rows] = await db.query('SELECT status, internal_update FROM orders WHERE id = ?', [order_id]);
      const status = rows[0]?.status || '';
      const internal_update = rows[0]?.internal_update || '';
      if (internal_update.length === 0) {
        if (status === 'PENDING CONFIRMATION') {
          await db.query('UPDATE orders SET status = \'CONFIRMED\' WHERE id = ?', [order_id]);
        }
        else if (status === 'PENDING PAID') {
          await db.query('UPDATE orders SET status = \'PAID\' WHERE id = ?', [order_id]);
        }
        else if (status === 'PENDING CANCELLATION') {
          await db.query('UPDATE orders SET status = \'CANCELLED\' WHERE id = ?', [order_id]);
        }
        else if (status === 'PENDING RETURN') {
          await db.query('UPDATE orders SET status = \'RETURNED\' WHERE id = ?', [order_id]);
        }
        clearInterval(timerId);
        console.log('Order updated and Timer stopped.');
      }
    } catch (err) {
      console.error('Failed to fetch or update order:', err);
      clearInterval(timerId);
      console.log('Timer stopped.');
    }
  }, interval);
};

module.exports = {
  reduceInventory,
  increaseInventory,
  updateAddress,
  deleteCart,
  confirmUpdate,
  startTimer
};