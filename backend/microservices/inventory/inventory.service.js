// inventory.service.js
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

// Update inventories for a set of product IDs
router.put('/increase', validateToken, async (req, res) => {
  const updates = req.body; // Expecting an array of objects with id field
  const updatePromises = updates.map(update => {
    db.query('UPDATE products SET inventory = inventory + 1 WHERE id = ?', [update.id])
  });

  try {
    await Promise.all(updatePromises);
    res.json({ message: 'Inventories reduced for specified products' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update inventories for a set of product IDs
router.put('/reduce', validateToken, async (req, res) => {
  const updates = req.body; // Expecting an array of objects with id field
  const updatePromises = updates.map(update => {
    db.query('UPDATE products SET inventory = inventory - 1 WHERE id = ?', [update.id])
  });

  try {
    await Promise.all(updatePromises);
    res.json({ message: 'Inventories reduced for specified products' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;