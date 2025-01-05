// user.service.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
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
  const { name, email, password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)';
    const params = [name, email, hashedPassword];
    await db.query(query, params);
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get('/:id', validateToken, async (req, res) => {
  try {
    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    const params = [req.params.id];
    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
router.put('/:id', validateToken, async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const query = 'UPDATE users SET name = ? WHERE id = ?';
    const params = [name, id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user password
router.put('/password/:id', validateToken, async (req, res) => {
  const { name, password } = req.body;
  const { id } = req.params;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'UPDATE users SET name = ?, hashed_password = ? WHERE id = ?';
    const params = [name, hashedPassword, id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get address 
router.get('/address/:user_id', validateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
      const query = 'SELECT * FROM shipping_address WHERE user_id = ?';
      const params = [user_id];
      const [rows] = await db.query(query, params);
      if (rows.length === 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(rows);
      }
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get query 
router.get('/query/:user_id', validateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
      const query = 'SELECT * FROM user_query WHERE user_id = ?';
      const params = [user_id];
      const [rows] = await db.query(query, params);
      if (rows.length === 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(rows);
      }
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Add a query
router.post('/query', validateToken, async (req, res) => {
  const { user_id, company, category, major_conditions, minor_conditions } = req.body;

  try {
    let query = 'DELETE FROM user_query WHERE user_id = ?';
    let params = [user_id];
    let [result] = await db.query(query, params);
    query = 'INSERT INTO user_query (user_id, company, category, major_conditions, minor_conditions) VALUES (?, ?, ?, ?, ?)';
    params = [user_id, company, category, major_conditions, minor_conditions];
    [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'query added successfully' });
    } else {
      console.log(result);
      res.status(500).json({ message: 'Failed to add address' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;