const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String, // Make sure the password field is defined
    required: true,
    trim: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['Pharmacist', 'Patient', 'Administrator'],
  },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
