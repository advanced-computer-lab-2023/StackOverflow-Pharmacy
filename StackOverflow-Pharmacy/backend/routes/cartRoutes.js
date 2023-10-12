const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Create a new cart
router.post('/create', cartController.createCart);

// Get all carts
router.get('/all', cartController.getAllCarts);

// Get a specific cart by ID
router.get('/:id', cartController.getCartById);

// Add an item to a cart
router.post('/:id/addItem', cartController.addItemToCart);

// Remove an item from a cart
router.delete('/:id/removeItem/:itemId', cartController.removeItemFromCart);

module.exports = router;
