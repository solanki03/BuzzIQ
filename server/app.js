const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Route to fetch documents from any collection
app.get('/v1/questions/:collectionName', async (req, res) => {
  try {
    const collectionName = req.params.collectionName;
    const db = mongoose.connection.db;
    
    // Validate collection exists 
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(c => c.name === collectionName);
    
    if (!collectionExists) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const docs = await db.collection(collectionName).find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;