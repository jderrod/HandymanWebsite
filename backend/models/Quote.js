// backend/models/Quote.js
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  additionalDetails: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema);