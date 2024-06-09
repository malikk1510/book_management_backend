const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with a hashed password
const comparePasswords = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

module.exports = { hashPassword, comparePasswords };
