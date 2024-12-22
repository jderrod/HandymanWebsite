const express = require('express');
const router = express.Router();

// Dummy GET route to test API
router.get('/', (req, res) => {
  const dummyServices = [
    { name: 'Plumbing', price: 100, description: 'Fix leaks, install pipes' },
    { name: 'Electrical Work', price: 150, description: 'Fix wiring issues' },
  ];
  res.json(dummyServices);
});

module.exports = router;

