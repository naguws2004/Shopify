// user.service.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { dbLoginUser, dbRegisterUser, dbGetUser, dbUpdateUser, dbUpdateUserWithPassword, dbGetUserAddress, dbGetUserQuery, dbAddUserQuery } = require('./user.repository');

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

router.get('/login', async (req, res) => {
  const { email, password } = req.query;
  try {
    let isMatch = false;
    const user = await dbLoginUser(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    isMatch = await bcrypt.compare(password, user.hashed_password);
    if (isMatch) {
        // Generate JWT token
        const token = jwt.sign({ id: user.id, name: user.Name, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.status(200).json({ ...user, token });
    }
    if (!isMatch) return res.status(404).json({ message: 'Password is incorrect' });
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
    await dbRegisterUser(name, email, hashedPassword);
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get('/:id', validateToken, async (req, res) => {
  try {
    const params = [req.params.id];
    const [rows] = await dbGetUser(params);
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
    const [result] = await dbUpdateUser(id, name);
    res.json({ message: 'User updated' });
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
    await dbUpdateUserWithPassword(id, name, hashedPassword);
    console.log('User updated');
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get address 
router.get('/address/:user_id', validateToken, async (req, res) => {
  const { user_id } = req.params;
  try {
      const [rows] = await dbGetUserAddress(user_id);
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
    const [rows] = await dbGetUserQuery(user_id);
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
    await dbAddUserQuery(user_id, company, category, major_conditions, minor_conditions);
    res.status(201).json({ message: 'query added successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;