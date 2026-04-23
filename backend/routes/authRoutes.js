const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log(`Signup attempt: ${normalizedEmail}`);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log(`Signup failed: Email already in use (${normalizedEmail})`);
      return res.status(400).send({ error: 'Email already in use' });
    }

    const user = new User({ name, email: normalizedEmail, password });
    await user.save();
    
    console.log(`Signup successful: ${normalizedEmail}`);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret_key_123');
    res.status(201).send({ user, token });
  } catch (e) {
    console.error(`Signup error for ${req.body.email}:`, e.message);
    res.status(400).send({ error: e.message });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log(`Signin attempt: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user || !(await user.comparePassword(password))) {
      console.log(`Signin failed: Invalid credentials (${normalizedEmail})`);
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    console.log(`Signin successful: ${normalizedEmail}`);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret_key_123');
    res.send({ user, token });
  } catch (e) {
    console.error(`Signin error for ${req.body.email}:`, e.message);
    res.status(400).send({ error: e.message });
  }
});

// Reset Password (Simple version)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    
    console.log(`Password reset attempt: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log(`Reset failed: User not found (${normalizedEmail})`);
      return res.status(404).send({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    
    console.log(`Password reset successful: ${normalizedEmail}`);
    res.send({ message: 'Password reset successful' });
  } catch (e) {
    console.error(`Reset error for ${req.body.email}:`, e.message);
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
