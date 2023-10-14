const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique usernames
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['Pharmacist', 'Patient', 'Administrator'], // Fixed typo
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
