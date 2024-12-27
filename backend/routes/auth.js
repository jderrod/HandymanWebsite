// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt received:', { ...req.body, password: '****' });
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if comparePassword method exists
    console.log('comparePassword method exists:', !!user.comparePassword);
    
    // Check password
    try {
      const isValid = await user.comparePassword(password);
      console.log('Password comparison result:', isValid);
      
      if (!isValid) {
        console.log('Password comparison failed');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (passwordError) {
      console.error('Error during password comparison:', passwordError);
      return res.status(500).json({ error: 'Password comparison failed' });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Fallback for testing
    console.log('Using JWT_SECRET:', JWT_SECRET ? 'Secret exists' : 'No secret found');
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful, token generated');
    res.json({ token });
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { router, authMiddleware };