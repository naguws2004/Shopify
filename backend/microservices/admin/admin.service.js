// admin.user.service.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');

// Get all users
router.get('/users/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by id
router.get('/users/:id', async (req, res) => {
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

// Create a new user
router.post('/users/',  async (req, res) => {
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

// Update a user
router.put('/users/:id', async (req, res) => {
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
router.put('/users/password/:id', async (req, res) => {
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
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
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

// Get all products
router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filterText = req.query.filterText || '';
  const includeQty = req.query.includeQty || false;
  const offset = (page - 1) * limit;

  try {
    let rows;
    let countResult;
    if (includeQty) {
      if (filterText) {
        [rows] = await db.query('SELECT * FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [`%${filterText.toLowerCase()}%`, limit, offset]);
        [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? ', [`%${filterText.toLowerCase()}%`]);
      } else {
        [rows] = await db.query('SELECT * FROM products WHERE inventory > 0 ORDER BY name LIMIT ? OFFSET ?', [limit, offset]);
        [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE inventory > 0');
      }
    } else {
      if (filterText) {
        [rows] = await db.query('SELECT * FROM products WHERE LOWER(name) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [`%${filterText.toLowerCase()}%`, limit, offset]);
        [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE LOWER(name) LIKE ? ', [`%${filterText.toLowerCase()}%`]);
      } else {
        [rows] = await db.query('SELECT * FROM products ORDER BY name LIMIT ? OFFSET ?', [limit, offset]);
        [countResult] = await db.query('SELECT COUNT(*) as count FROM products');
      }
    }
    const totalItems = countResult[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      products: rows,
      total: totalItems,
      page: page,
      pages: totalPages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get product by id
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  const newProduct = {
    ...req.body,
  };
  try {
    await db.query('INSERT INTO products SET ?', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const [result] = await db.query('UPDATE products SET ? WHERE id = ?', [req.body, req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product updated' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update inventories for a set of product IDs
router.put('/inventory/update', async (req, res) => {
  const updates = req.body; // Expecting an array of objects with id and inventory fields
  const updatePromises = updates.map(update => {
    db.query('UPDATE products SET inventory = ? WHERE id = ?', [update.inventory, update.id])
  });

  try {
    await Promise.all(updatePromises);
    res.json({ message: 'Inventories updated for specified products' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;