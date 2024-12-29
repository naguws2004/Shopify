const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');

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
      res.status(201).json({ message: 'order added successfully', order_id: result.insertId });
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
router.put('/cancel/:order_id', validateToken, async (req, res) => {
    const { order_id } = req.params;

  try {
    const params = [order_id];

    const query = 'UPDATE orders SET cancelled_date = CURDATE(), status = \'CANCELLED\' WHERE id = ?';
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

module.exports = router;