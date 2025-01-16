// order.repository.js
const db = require('./db');

const dbGetOrders = async (id, page, limit, filterOrderId, filterText, filterStatus, offset) => {
  try {
    let rows;
    let countResult;
    if (filterOrderId) {
      [rows] = await db.query('SELECT o.id, order_date, name, email, payment_date, dispatch_date, cancelled_date, status FROM orders o INNER JOIN users u ON o.user_id = u.id WHERE u.id = ? AND o.id = ? AND LOWER(name) LIKE ? AND UPPER(status) LIKE ? ORDER BY order_date DESC, o.id LIMIT ? OFFSET ?', [id, filterOrderId, filterText, filterStatus, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM orders o INNER JOIN users u ON o.user_id = u.id WHERE u.id = ? AND o.id = ? AND LOWER(name) LIKE ? AND UPPER(status) LIKE ?', [id, filterOrderId, filterText, filterStatus]);
    } else {
      [rows] = await db.query('SELECT o.id, order_date, name, email, payment_date, dispatch_date, cancelled_date, status FROM orders o INNER JOIN users u ON o.user_id = u.id WHERE u.id = ? AND LOWER(name) LIKE ? AND UPPER(status) LIKE ? ORDER BY order_date DESC, o.id LIMIT ? OFFSET ?', [id, filterText, filterStatus, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM orders o INNER JOIN users u ON o.user_id = u.id WHERE u.id = ? AND LOWER(name) LIKE ? AND UPPER(status) LIKE ?', [id, filterText, filterStatus]);
    }
    const totalItems = countResult[0].count;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      orders: rows,
      total: totalItems,
      page: page,
      pages: totalPages
    };
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbGetOrder = async (order_id) => {
  try {
    const query = 'SELECT * FROM orders WHERE id = ?';
    const params = [order_id];
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbGetOrderDetails = async (order_id) => {
  try {
    const query = 'SELECT * FROM order_details o INNER JOIN products p ON o.product_id = p.id WHERE o.id = ?';
    const params = [order_id];
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddOrder = async (user_id) => {
  try {
    const query = 'INSERT INTO orders (order_date, user_id, status, internal_update) VALUES (CURDATE(), ?, \'PENDING CONFIRMATION\', \'{cart_deleted}{products_added}{inventory-reduced}{address_added}\')';  
    const params = [user_id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      const order_id = result.insertId;
      return order_id;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddOrderDetails = async (order_id, product_ids) => {
  try {
    const query = 'INSERT INTO order_details (id, product_id) VALUES (?, ?)';
    let success = true;
    for (const product_id of product_ids) {
      const params = [order_id, product_id];
      const [result] = await db.query(query, params);
      if (result.affectedRows <= 0) {
        success = false;
        break;
      }
    }
    return success;
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

const dbAddOrderAddress = async (order_id, address, city, state, pincode, contactno) => {
  try {
    const query = 'INSERT INTO order_shipping_address (order_id, address, city, state, pincode, contactno) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [order_id, address, city, state, pincode, contactno];
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

const dbPayOrder = async (order_id) => {
  try {
    const params = [order_id];
    const query = 'UPDATE orders SET payment_date = CURDATE(), status = \'PENDING PAID\' WHERE id = ?';
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

const dbCancelOrder = async (order_id) => {
  try {
    const params = [order_id];
    const query = 'UPDATE orders SET cancelled_date = CURDATE(), status = \'PENDING CANCELLATION\', internal_update = CONCAT(internal_update, \'{inventory-increased}\') WHERE id = ?';
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

const dbReturnOrder = async (order_id) => {
  try {
    const params = [order_id];
    const query = 'UPDATE orders SET cancelled_date = CURDATE(), status = \'PENDING RETURN\', internal_update = \'{inventory-increased}\' WHERE id = ?';
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

const dbInternalUpdateOrder = async (order_id, topic, action) => {
  try {
    let query = '';
    if (topic === 'confirm-order') {
      if (action === 'cart') {
        query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{cart_deleted}\', \'\')  WHERE id = ?';
      } else if (action === 'inventory') {
        query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{inventory-reduced}\', \'\') WHERE id = ?';
      }
    }
    else if (topic === 'cancel-order') {
      if (action === 'inventory') {
        query = 'UPDATE orders SET internal_update = REPLACE(internal_update, \'{inventory-increased}\', \'\')  WHERE id = ?';
      } 
    }
    if (query.length > 0) {
      const params = [order_id];
      await db.query(query, params);
    }
  } catch (error) {
    console.error('Error in database call:', error);
    throw error;
  }
}

module.exports = {
  dbGetOrders,
  dbGetOrder,
  dbGetOrderDetails,
  dbAddOrder,
  dbAddOrderDetails,
  dbAddOrderAddress,
  dbPayOrder,
  dbCancelOrder,
  dbReturnOrder,
  dbInternalUpdateOrder
};
