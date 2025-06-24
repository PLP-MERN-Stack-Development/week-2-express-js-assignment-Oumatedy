const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validateRegister, validateLogin, validatePasswordChange } = require('../utils/user.utils');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
exports.register = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { firstName, lastName, email, password } = req.body;
    const username = email;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const user = new User({ firstName, lastName, email, password, username });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { error } = validatePasswordChange(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ error: 'Old password incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password (Simplified - Just returns reset token)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email not found' });

    // In a real system, generate and email a reset token
    const resetToken = generateToken(user);
    res.json({ message: 'Reset token (demo only):', resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
