// inventory.repository.js
const db = require('./db');

const dbReduceInventory = async (product_id) => {
  try {
    const query = 'UPDATE products SET inventory = inventory - 1 WHERE id = ?';
    const params = [product_id];
    await db.query(query, params);
} catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbIncreaseInventory = async (product_id) => {
  try {
    const query = 'UPDATE products SET inventory = inventory + 1 WHERE id = ?';
    const params = [product_id];
    await db.query(query, params);
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

module.exports = {
  dbReduceInventory,
  dbIncreaseInventory
};
