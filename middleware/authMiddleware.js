const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const ApiError = require('../utils/AppError');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  

  // Check if token exists
  if (!token) {
    return next(new ApiError(401, 'No token, authorization denied'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.secret);

    // Set user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Token is not valid'));
  }
};
