// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;;

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const servicesRouter = require('./routes/services');
const quotesRoutes = require('./routes/quotes');
const { router: authRouter } = require('./routes/auth');

// Use routes
app.use('/api/services', servicesRouter);
app.use('/api/quotes', quotesRoutes);
app.use('/api/auth', authRouter);

// Root route
app.get('/', (req, res) => {
  res.send('API is running!');
});

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});