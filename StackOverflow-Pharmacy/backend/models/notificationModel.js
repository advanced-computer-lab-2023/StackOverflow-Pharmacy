const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  title: String,
  content: String,
  type: {
    type: String,
    enum: ['Message', 'Rescheduled', 'Canceled', 'Update'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
