const express = require('express');
const mongoose = require('mongoose');
const Service = require('../models/Service');
const router = express.Router();

// Debug route
router.get('/check', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const serviceSchema = mongoose.model('services').schema.obj;
    res.json({
      collections: collections,
      schema: serviceSchema,
      modelName: Service.modelName,
      collectionName: Service.collection.name
    });
  } catch (err) {
    console.error('Check route error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all services...');
    const services = await Service.find();
    console.log('Found services:', services);
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Creating new service:', req.body);
    const service = new Service({
      title: req.body.title,
      description: req.body.description,
      cost: req.body.cost
    });
    
    const savedService = await service.save();
    console.log('Saved service:', savedService);
    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add test data
router.post('/test', async (req, res) => {
  try {
    console.log('Creating test service...');
    const testService = {
      title: "Test Service",
      description: "This is a test service",
      cost: "$100"
    };
    console.log('Test data:', testService);
    
    const service = new Service(testService);
    console.log('Created service object:', service);
    
    const savedService = await service.save();
    console.log('Saved service:', savedService);
    
    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({
      message: err.message,
      details: err.errors ? Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      })) : null
    });
  }
});

module.exports = router;