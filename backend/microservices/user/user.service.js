// user.service.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./db');
const { createUser, updateUser, updateUserPassword } = require('./common');

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

router.get('/login', async (req, res) => {
  const { email, password } = req.query;
  const query = 'SELECT * FROM users WHERE email = ?';
  const params = [email];
  try {
    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      let isMatch = false;
      for (const user of rows) {
          isMatch = await bcrypt.compare(password, user.hashed_password);
          if (isMatch) {
              // Generate JWT token
              const token = jwt.sign({ id: user.id, name: user.Name, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
              return res.status(200).json({ ...user, token });
          }
      }
      if (!isMatch) return res.status(404).json({ message: 'Password is incorrect' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  await createUser(req, res);
});

// Update a user
router.put('/:id', validateToken, async (req, res) => {
  await updateUser(req, res);
});

// Update a user password
router.put('/password/:id', validateToken, async (req, res) => {
  await updateUserPassword(req, res);
});

module.exports = router;