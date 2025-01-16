const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { dbGetOrders, dbGetOrder, dbGetOrderDetails, dbAddOrder, dbAddOrderDetails, dbAddOrderAddress, dbPayOrder, dbCancelOrder, dbReturnOrder } = require('./order.repository');
const { reduceInventory, increaseInventory, updateAddress, deleteCart, confirmUpdate, startTimer } = require('./order.eventProducer');

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

// Get all orders
router.get('/', validateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const id = parseInt(req.query.id) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const filterOrderId = req.query.filterOrderId || '';
  const filterText = req.query.filterText ? `%${req.query.filterText.toLowerCase()}%` : '%';
  const filterStatus = req.query.filterStatus ? `%${req.query.filterStatus.toLowerCase()}%` : '%';
  const offset = (page - 1) * limit;
  try {
    const result = await dbGetOrders(id, page, limit, filterOrderId, filterText, filterStatus, offset);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order
router.get('/:order_id', validateToken, async (req, res) => {
    const { order_id } = req.params;
    try {
        const rows = await dbGetOrder(order_id);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get order details
router.get('/details/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;
  try {
      const rows = await dbGetOrderDetails(order_id);
      res.status(200).json(rows);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Add an order
router.post('/', validateToken, async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await dbAddOrder(user_id);
    if (result > 0) {
      const order_id = result;
      res.status(201).json({ message: 'order added successfully', order_id });
    } else {
      res.status(500).json({ message: 'Failed to add order' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an order detail
router.post('/detail', validateToken, async (req, res) => {
  const { order_id, product_ids } = req.body;
  try {
    const success = await dbAddOrderDetails(order_id, product_ids);
    if (success) {
      await confirmUpdate(order_id, 'products');
      await reduceInventory(order_id, product_ids);
      await deleteCart(order_id);
      await startTimer(30000, order_id);
      res.status(201).json({ message: 'order details added successfully' });
    } else {
      res.status(500).json({ message: 'Failed to add order details' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an address
router.post('/address', validateToken, async (req, res) => {
  const { order_id, address, city, state, pincode, contactno } = req.body;
  try {
    const result = await dbAddOrderAddress(order_id, address, city, state, pincode, contactno);
    if (result) {
      await confirmUpdate(order_id, 'address');
      await updateAddress(order_id, address, city, state, pincode, contactno);
      res.status(201).json({ message: 'address added successfully' });
    } else {
      console.log(result);
      res.status(500).json({ message: 'Failed to add address' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Update an order 
router.put('/pay/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await dbPayOrder(order_id);
    if (result) {
      await startTimer(30000, order_id);
      res.status(200).json({ message: 'order updated successfully' });
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an order 
router.put('/cancel/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await dbCancelOrder(order_id);
    if (result) {
      await increaseInventory(order_id);
      await startTimer(30000, order_id);
      res.status(200).json({ message: 'order updated successfully' });
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an order 
router.put('/return/:order_id', validateToken, async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await dbReturnOrder(order_id);
    if (result) {
      await increaseInventory(order_id);
      await startTimer(30000, order_id);
      res.status(200).json({ message: 'order updated successfully' });
    } else {
      res.status(404).json({ message: 'order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;