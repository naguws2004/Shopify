// cart.repository.js
const db = require('./db');

const dbGetCart = async (user_id) => {
  try {
    const query = 'SELECT * FROM cart c INNER JOIN products p ON c.product_id = p.id WHERE user_id = ?';
    const params = [user_id];
    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      return rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddCart = async (user_id, product_id) => {
  try {
    const query = 'INSERT INTO cart (user_id, product_id) VALUES (?, ?)';
    const params = [user_id, product_id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbDeleteCart = async (user_id) => {
  try {
    const query = 'DELETE FROM cart WHERE user_id = ?';
    const params = [user_id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

module.exports = {
  dbGetCart,
  dbAddCart,
  dbDeleteCart
};
