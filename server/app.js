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



// Save quiz results endpoint
// Add this model definition right after your resultsDB connection
const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  notAttempted: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
}, {timestamps: true});

// Cache for models to avoid recompiling
const modelCache = {};

// Function to get or create a model for a user's results
function getResultModel(username) {
  const collectionName = `results_${createCollectionName(username)}`;
  
  if (modelCache[collectionName]) {
    return modelCache[collectionName];
  }

  const Model = resultsDB.model(collectionName, resultSchema);
  modelCache[collectionName] = Model;
  
  return Model;
}

// Update your POST endpoint like this:
app.post('/v1/results', async (req, res) => {
  try {
    const { userId, username, topic, totalQuestions, correctAnswers, wrongAnswers, notAttempted, timeTaken } = req.body;

    // Validate required fields
    if (!userId || !username || !topic || totalQuestions === undefined || 
        correctAnswers === undefined || timeTaken === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Calculate derived fields if not provided
    const calculatedNotAttempted = notAttempted !== undefined ? notAttempted : 
                                 (totalQuestions - correctAnswers - (wrongAnswers || 0));
    const calculatedWrongAnswers = wrongAnswers !== undefined ? wrongAnswers : 
                                 (totalQuestions - correctAnswers - calculatedNotAttempted);

    // Create or get model for this user's results
    const Result = getResultModel(username);

    // Create new result document
    const result = new Result({
      userId,
      username,
      topic,
      totalQuestions,
      correctAnswers,
      wrongAnswers: calculatedWrongAnswers,
      notAttempted: calculatedNotAttempted,
      timeTaken
    });

    // Validate the data sums
    if (result.correctAnswers + result.wrongAnswers + result.notAttempted !== result.totalQuestions) {
      return res.status(400).json({
        success: false,
        error: 'Answer counts do not sum to total questions'
      });
    }

    // Save to database
    await result.save();

    res.status(201).json({
      success: true,
      data: {
        collection: `results_${createCollectionName(username)}`,
        result: result.toObject()
      }
    });

    console.log('Result saved:', result);

  } catch (err) {
    console.error('Error saving results:', err);
    
    const errorResponse = {
      success: false,
      error: 'Failed to save results'
    };

    if (err.name === 'ValidationError') {
      errorResponse.error = 'Validation failed';
      errorResponse.details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json(errorResponse);
    }

    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = err.message;
    }

    res.status(500).json(errorResponse);
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


// Route 1: User's participation (date + score)
// Add this endpoint to your backend
app.get('/v1/chart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    // Need to find which collection contains this userId
    const collections = await resultsDB.db.listCollections().toArray();
    
    let chartData = [];
    
    // Search through all results_* collections
    for (const coll of collections) {
      if (coll.name.startsWith('results_')) {
        const Model = resultsDB.model(coll.name, resultSchema);
        const userResults = await Model.find({ userId }, { 
          createdAt: 1, 
          correctAnswers: 1, 
          totalQuestions: 1 
        }).sort({ createdAt: 1 });
        
        if (userResults.length > 0) {
          chartData = userResults.map(doc => ({
            date: doc.createdAt,
            score: ((doc.correctAnswers / doc.totalQuestions) * 100).toFixed(2)
          }));
          break; // Found the user's collection
        }
      }
    }
    
    res.json({
      success: true,
      data: chartData
    });
    
  } catch (err) {
    console.error('Error fetching chart data by userId:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch chart data' });
  }
});


// Route 2: Scores by Topic Name
app.get('/v1/results/:username/:topicname', async (req, res) => {
  try {
    const { username, topicname } = req.params;

    if (!username || !topicname) {
      return res.status(400).json({ success: false, error: 'Username and topic name are required' });
    }

    const Result = getResultModel(username);

    // Find all attempts matching the topic
    const results = await Result.find({ topic: topicname }, { correctAnswers: 1, totalQuestions: 1, createdAt: 1 }).sort({ createdAt: 1 });

    const topicScores = results.map(doc => ({
      date: doc.createdAt,
      score: ((doc.correctAnswers / doc.totalQuestions) * 100).toFixed(2)
    }));

    res.json({
      success: true,
      data: topicScores
    });

  } catch (err) {
    console.error('Error fetching topic scores:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch topic scores' });
  }
});


module.exports = app;