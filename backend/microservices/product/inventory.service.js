// inventory.service.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Update inventories for a set of product IDs
router.put('/update', async (req, res) => {
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