const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  // Exclude _id field here
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
