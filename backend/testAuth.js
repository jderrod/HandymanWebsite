// backend/testAuth.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAuth() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    // Find the admin user
    const user = await User.findOne({ username: 'admin' });
    console.log('Found user:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User ID:', user._id);
      console.log('Username:', user.username);
      console.log('Stored hashed password:', user.password);
      
      // Test password comparison
      if (user.comparePassword) {
        const isValid = await user.comparePassword('admin123');
        console.log('Password comparison result:', isValid);
      } else {
        console.log('comparePassword method not found on user object');
      }
    }
  } catch (error) {
    console.error('Error testing auth:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAuth();