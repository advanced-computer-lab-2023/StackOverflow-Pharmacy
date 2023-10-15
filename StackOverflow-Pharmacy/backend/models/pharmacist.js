const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const PharmacistSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
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
    birthdate: {
        type: Date,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email addresses for pharmacists
        trim: true,
        validate: {
            validator: isEmail,
            message: 'Invalid email address',
        },
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
}, { timestamps: true });


const Pharmacist = mongoose.model('Pharmacist', PharmacistSchema);

module.exports = Pharmacist;