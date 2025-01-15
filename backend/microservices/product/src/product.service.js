// product.service.js
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

router.get('/ping', async (req, res) => {
  return res.status(200).json({ message: 'Online' });
});

// Get all products
router.get('/', validateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const company = req.query.company ? `%${req.query.company.toLowerCase()}%` : '%';
  const category = req.query.category ? `%${req.query.category.toLowerCase()}%` : '%';
  const majorConditions = req.query.majorConditions ? `%${req.query.majorConditions.toLowerCase()}%` : '%';
  const minorConditions = req.query.minorConditions ? `%${req.query.minorConditions.toLowerCase()}%` : '%';
  const filterText = req.query.filterText ? `%${req.query.filterText.toLowerCase()}%` : '%';
  const includeQty = req.query.includeQty || false;
  const offset = (page - 1) * limit;

  try {
    let rows;
    let countResult;
    if (includeQty) {
      [rows] = await db.query('SELECT * FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [filterText, company, category, majorConditions, minorConditions, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE inventory > 0 AND LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ?', [filterText, company, category, majorConditions, minorConditions]);
    } else {
      [rows] = await db.query('SELECT * FROM products WHERE LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ? ORDER BY name LIMIT ? OFFSET ?', [filterText, company, category, majorConditions, minorConditions, limit, offset]);
      [countResult] = await db.query('SELECT COUNT(*) as count FROM products WHERE LOWER(name) LIKE ? AND LOWER(company) LIKE ? AND LOWER(category) LIKE ? AND LOWER(major_conditions) LIKE ? AND LOWER(minor_conditions) LIKE ?', [filterText, company, category, majorConditions, minorConditions]);
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
router.get('/:id', validateToken, async (req, res) => {
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
router.post('/', validateToken, async (req, res) => {
  const newProduct = {
    ...req.body,
  };
  try {
    await db.query('INSERT INTO products SET ?', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', validateToken, async (req, res) => {
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
router.delete('/:id', validateToken, async (req, res) => {
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

module.exports = router;