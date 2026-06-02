const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin123@gmail.com';

// Verify JWT token
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized. No token.' });
  try {
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired.' });
  }
};

// Admin or instructor access (admin uses instructor role internally)
const instructorOnly = (req, res, next) => {
  if (req.user?.role === 'instructor' || req.user?.email === ADMIN_EMAIL) return next();
  res.status(403).json({ message: 'Admin access only.' });
};

// Only students
const studentOnly = (req, res, next) => {
  if (req.user?.role === 'student') return next();
  res.status(403).json({ message: 'Student access only.' });
};

module.exports = { protect, instructorOnly, studentOnly };
