const mongoose = require('mongoose');

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
