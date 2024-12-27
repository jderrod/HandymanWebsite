// backend/routes/quotes.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const { authMiddleware } = require('./auth');

// Get all quotes (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Create new quote (public route)
router.post('/', async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;