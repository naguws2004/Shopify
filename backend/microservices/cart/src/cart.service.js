const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbGetCart, dbAddCart, dbDeleteCart } = require('./cart.repository');

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

router.get('/ping', async (req, res) => {
  return res.status(200).json({ message: 'Online' });
});

// Get all products in the cart for a user
router.get('/:user_id', validateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
    const rows = await dbGetCart(user_id);
    res.status(200).json(rows);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
  
// Add a product to the cart
router.post('/', validateToken, async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const result = await dbAddCart(user_id, product_id);
    if (result) {
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
    const result = await dbDeleteCart(user_id);
    if (result) {
      res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;