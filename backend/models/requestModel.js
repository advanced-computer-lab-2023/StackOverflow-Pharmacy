const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  medicID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  ID: {
    type: String,
    required: true,
  },
  degree: String,
  licenses: [String],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
