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

// Get all products in the cart for a user
router.get('/:user_id', validateToken, async (req, res) => {
    const { user_id } = req.params;

    try {
        const query = 'SELECT * FROM cart c INNER JOIN products p ON c.product_id = p.id WHERE user_id = ?';
        const params = [user_id];

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
  
// Add a product to the cart
router.post('/', validateToken, async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const query = 'INSERT INTO cart (user_id, product_id) VALUES (?, ?)';
    const params = [user_id, product_id];

    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Product added to cart successfully' });
    } else {
      res.status(500).json({ message: 'Failed to add product to cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a product from the cart for a user
router.delete('/:user_id', validateToken, async (req, res) => {
    const { user_id } = req.params;

  try {
    const query = 'DELETE FROM cart WHERE user_id = ?';
    const params = [user_id];

    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;