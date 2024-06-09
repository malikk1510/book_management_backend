const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token does not exist
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user from token payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
