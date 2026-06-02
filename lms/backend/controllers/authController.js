const User          = require('../models/User');
const generateToken = require('../utils/generateToken');

// Predefined admin credentials
const ADMIN_EMAIL    = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'admin123';

// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    // Block admin email from registering via UI
    if (email.toLowerCase() === ADMIN_EMAIL)
      return res.status(400).json({ message: 'This email cannot be used for registration.' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered.' });

    // All new registrations are students only
    const user = await User.create({ name, email, password, role: 'student' });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    // Check predefined admin credentials first
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Find or create admin user in DB so JWT works correctly
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin',
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: 'instructor', // stored as instructor for routing compat
        });
      }
      return res.json({
        token: generateToken(adminUser._id),
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role, // 'instructor' — maps to admin dashboard
          avatar: adminUser.avatar,
          isAdmin: true,
        },
      });
    }

    // Normal student login
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// @route  GET /api/auth/me
const getMe = (req, res) => {
  const u = req.user;
  const isAdmin = u.email === ADMIN_EMAIL;
  res.json({ user: { ...u._doc, isAdmin } });
};

// @route  PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const update = { name, bio };
    if (avatar) update.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe, updateProfile };
