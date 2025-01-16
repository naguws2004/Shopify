// product.service.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbGetProducts, dbGetProduct, dbAddProduct, dbUpdateProduct, dbDeleteProduct } = require('./product.repository');

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
    const result = await dbGetProducts(page, limit, company, category, majorConditions, minorConditions, filterText, includeQty, offset);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get product by id
router.get('/:id', validateToken, async (req, res) => {
  try {
    const row = await dbGetProduct(req.params.id);
    if (!row) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(row);
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
    await dbAddProduct(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', validateToken, async (req, res) => {
  try {
    const result = await dbUpdateProduct(req.params.id, req.body);
    if (result) {
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
    const result = await dbDeleteProduct(req.params.id);
    if (result) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;