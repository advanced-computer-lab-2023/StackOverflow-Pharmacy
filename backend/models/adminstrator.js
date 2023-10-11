const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctor = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Doctor', doctor)