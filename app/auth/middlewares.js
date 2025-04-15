const Role = require('../store/models/Role')
const User = require('../store/models/User')


const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';



function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error in authMiddleware:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
  
  function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }

module.exports = { authMiddleware, adminMiddleware };

