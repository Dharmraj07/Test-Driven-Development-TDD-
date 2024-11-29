const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  // Extract token from Bearer scheme
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = decoded; // Attach decoded payload to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
};
