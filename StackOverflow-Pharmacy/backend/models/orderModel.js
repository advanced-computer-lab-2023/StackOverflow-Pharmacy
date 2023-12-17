const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema({
  medicine: {
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
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address', // Reference to the Address model
  },
  phone: String,
  date: {
    type: Date,
    default: Date.now,
    required: false
  },
  status: {
    type: String,
    enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Not Processed',
    required: false
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
