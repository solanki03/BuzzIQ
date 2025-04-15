const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Results database connection
const resultsDB = mongoose.createConnection(process.env.MONGODB_URI, {
  dbName: 'BuzzIQ_Assects',
 // useNewUrlParser: true,
 //cls useUnifiedTopology: true
});

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

// Helper function to create collection-safe name
const createCollectionName = (username) => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')  // Replace special chars with underscore
    .replace(/_+/g, '_')         // Remove duplicate underscores
    .replace(/^_|_$/g, '');      // Remove leading/trailing underscores
};

// Result Schema
const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  notAttempted: { type: Number, required: true },
  score: { type: Number, required: true },
  details: { type: Array, default: [] }
}, { timestamps: true });

// Dynamic model creation using username
const getResultModel = (username) => {
  const collectionName = `results_${createCollectionName(username)}`;
  return resultsDB.model(collectionName, resultSchema, collectionName);
};

// Save quiz results endpoint
app.post('/v1/results', async (req, res) => {
  try {
    const { userId, username, ...resultData } = req.body;

    // Validate required fields
    if (!userId || !username) {
      return res.status(400).json({
        success: false,
        error: 'User ID and username are required'
      });
    }

    // Create or get model for this user's results
    const Result = getResultModel(username);

    // Create new result document
    const result = new Result({
      userId,
      username,
      ...resultData,
      // Ensure all required fields are present
      notAttempted: resultData.notAttempted || 0,
      wrongAnswers: resultData.wrongAnswers || (resultData.totalQuestions - resultData.correctAnswers)
    });

    // Save to database
    await result.save();

    res.status(201).json({
      success: true,
      data: {
        collection: `results_${createCollectionName(username)}`,
        result: result
      }
    });

  } catch (err) {
    console.error('Error saving results:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to save results',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get user's results by username
app.get('/v1/results/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    const Result = getResultModel(username);
    const results = await Result.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: results
    });

  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results'
    });
  }
});

module.exports = app;