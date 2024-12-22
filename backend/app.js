require('dotenv').config({ path: './.env' });
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
console.log('MongoDB URI:', process.env.MONGO_URI);
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Test the connection by pinging the database
    await client.db("admin").command({ ping: 1 });
    console.log("Ping successful!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

// Connect to MongoDB and start the server
connectToDatabase().then(() => {
  // Define your API routes here
  app.get('/api/services', async (req, res) => {
    try {
      // Fetch all documents from the 'services' collection
      const database = client.db("Services"); // Name of your database
      const collection = database.collection("services"); // Name of your collection
      const services = await collection.find().toArray();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Error fetching services", error: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

