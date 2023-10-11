const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { hashPassword, comparePasswords, addressObject } = require('../utils');

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,

    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      select: false // exclude from the query results by default.
    },
    addresses: [String],
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 13
    },
    role: {
      type: String,
      enum: ['doctor', 'patient', 'adminstrator'],
      default: 'customer'
    },
    birthdate:{
      type:Date,
      required:true
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1,userName:1 }, { unique: true });



const User = model('User', userSchema);

module.exports = User;