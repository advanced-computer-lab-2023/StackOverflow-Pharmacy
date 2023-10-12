// utils.js
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePasswords(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePasswords,
};
