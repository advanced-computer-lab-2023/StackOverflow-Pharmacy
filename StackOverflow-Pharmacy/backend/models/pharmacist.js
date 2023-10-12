const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pharmacistSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
},
  hourRate: {
    type: Number,
    required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  educationBackground: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
   requestID: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Request',
   },
}, { timestamps: true });

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);

module.exports = Pharmacist;
