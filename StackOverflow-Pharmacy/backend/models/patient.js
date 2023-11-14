const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const addressSchema = new Schema({
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const patientSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: isEmail,
      message: 'Invalid email address',
    },
  },
  phone: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    relation: { type: String, required: true },
  },
  addresses: [addressSchema],
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
