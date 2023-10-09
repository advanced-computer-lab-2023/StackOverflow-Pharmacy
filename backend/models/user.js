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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        return isEmail(value);
      }
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
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  let hashed = await hashPassword(this.password);
  this.password = hashed;

  next();
});

userSchema.pre('findByIdAndUpdate', async function (next) {
  if (!this._update.password) return next();

  let hashed = await hashPassword(this._update.password);
  this._update.password = hashed;

  next();
});

userSchema.methods.isPasswordMatch = function (password) {
  return comparePasswords(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;