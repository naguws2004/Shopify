const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');
const { reduceInventory, increaseInventory, updateAddress, deleteCart } = require('./order.eventProducer');

// Middleware to validate JWT token
const validateToken = (req, res, next) => { 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
      return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
  });
}

// Get all orders
router.get('/', validateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const id = parseInt(req.query.id) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const filterOrderId = req.query.filterOrderId || '';
  const filterText = req.query.filterText ? `%${req.query.filterText.toLowerCase()}%` : '%';
  const filterStatus = req.query.filterStatus ? `%${req.query.filterStatus.toLowerCase()}%` : '%';
  const offset = (page - 1) * limit;

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

    res.json({
      orders: rows,
      total: totalItems,
      page: page,
      pages: totalPages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order
router.get('/:order_id', validateToken, async (req, res) => {
    const { order_id } = req.params;

    try {
        const query = 'SELECT * FROM orders WHERE id = ?';
        const params = [order_id];

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get order details
router.get('/details/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;

  try {
      const query = 'SELECT * FROM order_details o INNER JOIN products p ON o.product_id = p.id WHERE o.id = ?';
      const params = [order_id];

      const [rows] = await db.query(query, params);
      res.status(200).json(rows);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Add an order
router.post('/', validateToken, async (req, res) => {
  const { user_id } = req.body;

  try {
    const query = 'INSERT INTO orders (order_date, user_id, status) VALUES (CURDATE(), ?, \'PENDING\')';  
    const params = [user_id];

    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      const order_id = result.insertId;
      deleteCart(order_id);
      res.status(201).json({ message: 'order added successfully', order_id });
    } else {
      res.status(500).json({ message: 'Failed to add order' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an order detail
router.post('/detail', validateToken, async (req, res) => {
  const { order_id, product_id } = req.body;

  try {
    const query = 'INSERT INTO order_details (id, product_id) VALUES (?, ?)';
    const params = [order_id, product_id];

    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      await reduceInventory(product_id);
      res.status(201).json({ message: 'order added successfully' });
    } else {
      res.status(500).json({ message: 'Failed to add order' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an address
router.post('/address', validateToken, async (req, res) => {
  const { order_id, address, city, state, pincode, contactno } = req.body;

  try {
    const query = 'INSERT INTO order_shipping_address (order_id, address, city, state, pincode, contactno) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [order_id, address, city, state, pincode, contactno];

    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      await updateAddress(order_id, address, city, state, pincode, contactno);
      res.status(201).json({ message: 'address added successfully' });
    } else {
      console.log(result);
      res.status(500).json({ message: 'Failed to add address' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Update an order 
router.put('/pay/:order_id', validateToken, async (req, res) => {
    const { order_id } = req.params;

  try {
    const params = [order_id];

    const query = 'UPDATE orders SET payment_date = CURDATE(), status = \'PAID\' WHERE id = ?';
    const [result] = await db.query(query, params);

    if (result.affectedRows > 0) {
        res.status(200).json({ message: 'order updated successfully' });
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an order 
router.put('/cancel/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;

try {
  const params = [order_id];

  const query = 'UPDATE orders SET cancelled_date = CURDATE(), status = \'CANCELLED\' WHERE id = ?';
  const [result] = await db.query(query, params);

  if (result.affectedRows > 0) {
    await increaseInventory(order_id);
    res.status(200).json({ message: 'order updated successfully' });
  } else {
    res.status(404).json({ message: 'order not found' });
  }
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

// Update an order 
router.put('/return/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;

try {
  const params = [order_id];

  const query = 'UPDATE orders SET cancelled_date = CURDATE(), status = \'RETURNED\' WHERE id = ?';
  const [result] = await db.query(query, params);

  if (result.affectedRows > 0) {
    await increaseInventory(order_id);
    res.status(200).json({ message: 'order updated successfully' });
  } else {
    res.status(404).json({ message: 'order not found' });
  }
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

module.exports = router;