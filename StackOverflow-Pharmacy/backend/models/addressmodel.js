const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
