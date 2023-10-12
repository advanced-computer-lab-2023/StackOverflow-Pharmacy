const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Get all orders
router.get('/all', orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Update an order by ID
router.put('/:id/update', orderController.updateOrderById);

// Delete an order by ID
router.delete('/:id/delete', orderController.deleteOrderById);

module.exports = router;
