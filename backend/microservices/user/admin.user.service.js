// admin.user.service.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const { createUser, updateUser, updateUserPassword } = require('./common');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
router.post('/',  async (req, res) => {
  await createUser(req, res);
});

// Update a user
router.put('/:id', async (req, res) => {
  await updateUser(req, res);
});

// Update a user password
router.put('/password/:id', async (req, res) => {
  await updateUserPassword(req, res);
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;