const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];

    // If no header or not starting with 'Bearer ', deny access
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract token from 'Bearer <token>'
    const token = authHeader.split(' ')[1];

    // Verify and decode the token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to the request object for further access
    req.user = decoded; // e.g., req.user.id, req.user.role

    // Proceed to the next middleware or controller
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = verifyToken;
