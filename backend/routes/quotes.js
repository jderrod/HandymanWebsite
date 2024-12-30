// backend/routes/quotes.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const { authMiddleware } = require('./auth');

// Get all quotes (protected route)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ lastUpdated: -1, createdAt: -1 });
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

// Update quote (protected route)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// Delete quote (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Attempting to delete quote with ID:', req.params.id); // Debug log
    const quote = await Quote.findByIdAndDelete(req.params.id);
    
    if (!quote) {
      console.log('Quote not found'); // Debug log
      return res.status(404).json({ error: 'Quote not found' });
    }

    console.log('Quote deleted successfully'); // Debug log
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

module.exports = router;