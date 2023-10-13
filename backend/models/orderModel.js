const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine', // Reference to the Medicine model
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [orderItemSchema],
  address: String,
  phone: String,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    required: true,
  },
  deliveryPrice: {
    type: Number,
    min: 0,
  },
  paymentType: {
    type: String,
    enum: ['Cash', 'Card', 'Wallet'],
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
