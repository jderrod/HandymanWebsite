const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: String, required: true }
});

// Add this for debugging
serviceSchema.pre('save', function(next) {
  console.log('Attempting to save service:', this.toObject());
  next();
});

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;