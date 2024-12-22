const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  service: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Booking', BookingSchema);
