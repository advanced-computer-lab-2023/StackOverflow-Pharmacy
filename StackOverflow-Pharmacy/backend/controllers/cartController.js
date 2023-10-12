const Cart = require('../models/cartModel');

// Create a new cart
const createCart = async (req, res) => {
  try {
    const { userID } = req.body;

    // Create a new cart document
    const newCart = new Cart({
      userID,
      items: [],
    });

    await newCart.save();

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Could not create cart' });
  }
};

// Get all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch carts' });
  }
};

// Get a specific cart by ID
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch cart' });
  }
};

// Add an item to a cart
const addItemToCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { id, count } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((item) => item.id.equals(id));

    if (existingItem) {
      // Update the count if the item already exists
      existingItem.count += count;
    } else {
      // Add a new item to the cart
      cart.items.push({ id, count });
    }

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Could not add item to cart' });
  }
};

// Remove an item from a cart
const removeItemFromCart = async (req, res) => {
    try {
      const cartId = req.params.id;
      const { itemId } = req.params;
  
      const cart = await Cart.findById(cartId);
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the index of the item to remove
      const itemIndex = cart.items.findIndex((item) => item.id.equals(itemId));
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      // Remove the item from the cart's items array
      cart.items.splice(itemIndex, 1);
  
      await cart.save();
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Could not remove item from cart' });
    }
  };
  
  module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    addItemToCart,
    removeItemFromCart, 
  };
  
