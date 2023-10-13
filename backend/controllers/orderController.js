const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      userID,
      items,
      address,
      phone,
      status,
      deliveryPrice,
      paymentType,
    } = req.body;

    // Create a new order document
    const newOrder = new Order({
      userID,
      items,
      address,
      phone,
      status,
      deliveryPrice,
      paymentType,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Could not create order' });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch orders' });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch order' });
  }
};

// Update an order by ID
const updateOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Could not update order' });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndRemove(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Could not delete order' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
