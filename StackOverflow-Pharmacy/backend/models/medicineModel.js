const mongoose = require('mongoose');
const Notification = require('./notificationModel');
const Pharmacist = require('./pharmacist'); 

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  numStock: {
    type: Number,
    required: true,
    validate: {
      validator: async function (value) {
        // Trigger notification if stock is low or out of stock
        if (value <= 0) {
          // Fetch all pharmacist IDs
          const pharmacistIds = await Pharmacist.find().distinct('_id');

          // Create and save notifications for each pharmacist
          const notifications = pharmacistIds.map((pharmacistId) => {
            return new Notification({
              pharmacistId: pharmacistId,
              message: `Medicine ${this.name} is out of stock.`,
            });
          });

          // Save all notifications
          await Notification.insertMany(notifications);
        }

        return true;
      },
      message: 'Invalid stock value',
    },
  },
  numSold: {
    type: Number,
    default: 0,
  },
  medicalUse: String,
  activeIngredients: [String],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isOverTheCounter: {
    type: Boolean,
    default: true,
  },
  image: String,
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
