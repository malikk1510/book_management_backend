// Function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Function to validate password (minimum 6 characters)
  const isValidPassword = (password) => {
    return password.length >= 6;
  };
  
  module.exports = { isValidEmail, isValidPassword };
  