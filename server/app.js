const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET','POST'],
  credentials: true,
}));

// Results database connection
// Replace your resultsDB connection with this:
const resultsDB = mongoose.createConnection(process.env.MONGODB_URI, {
  dbName: 'BuzzIQ_Assects',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

// Add connection event listeners
resultsDB.on('connected', () => {
  console.log('Results DB connected');
});
 
resultsDB.on('error', (err) => { 
  console.error('Results DB connection error:', err);
});

// Add these routes to app.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    resultsDbStatus: resultsDB.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/health/detailed', async (req, res) => {
  try {
    const mainDbCollections = await mongoose.connection.db.listCollections().toArray();
    const resultsDbCollections = await resultsDB.db.listCollections().toArray();
    
    res.status(200).json({
      mainDb: {
        status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        collections: mainDbCollections.map(c => c.name)
      },
      resultsDb: {
        status: resultsDB.readyState === 1 ? 'Connected' : 'Disconnected',
        collections: resultsDbCollections.map(c => c.name)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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


app.get('/v1/results/:userId/:topicname', async (req, res) => {
  try {
    const { userId, topicname } = req.params;

    // Convert URL-friendly topic name to display format
    // python_programming → Python Programming
    const displayTopic = topicname
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // Find all collections that might contain this user's results
    const collections = await resultsDB.db.listCollections({ name: /^results_/ }).toArray();
    
    let totalAttempts = 0;
    let totalCorrectAnswers = 0;
    let totalWrongAnswers = 0;
    let totalNotAttemptedAnswers = 0;
    let totalQuestions = 0;

    // Search through all results collections for this user's topic data
    for (const coll of collections) {
      const Model = resultsDB.model(coll.name, resultSchema);
      const results = await Model.find({ 
        userId: userId,
        topic: displayTopic 
      });

      // Aggregate the statistics
      results.forEach(result => {
        totalAttempts++;
        totalCorrectAnswers += result.correctAnswers || 0;
        totalWrongAnswers += result.wrongAnswers || 0;
        const notAttempted = (result.totalQuestions || 0) - 
                           (result.correctAnswers || 0) - 
                           (result.wrongAnswers || 0);
        totalNotAttemptedAnswers += notAttempted > 0 ? notAttempted : 0;
        totalQuestions += result.totalQuestions || 0;
      });
    }

    // If no results found
    if (totalAttempts === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No results found for this user and topic combination'
      });
    }

    // Return the aggregated data in the requested format
    res.json({
      success: true,
      data: {
        totalAttempts,
        totalCorrectAnswers,
        totalWrongAnswers,
        totalNotAttemptedAnswers,
        totalQuestions
      }
    });

  } catch (err) {
    console.error('Error in /v1/results/:userId/:topicname:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error'
    });
  }
});


// Route 1: User's participation (date + score)
// Updated endpoint to send date and distinct topics
app.get('/v1/chart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const collections = await resultsDB.db.listCollections().toArray();
    
    let dates = [];
    let topicsSet = new Set();
    
    for (const coll of collections) {
      if (coll.name.startsWith('results_')) {
        const Model = resultsDB.model(coll.name, resultSchema);
        const userResults = await Model.find({ userId }, { 
          createdAt: 1, 
          topic: 1 
        }).sort({ createdAt: 1 });
        
        if (userResults.length > 0) {
          userResults.forEach(doc => {
            if (doc.createdAt) dates.push(doc.createdAt);
            if (doc.topic) topicsSet.add(doc.topic);
          });
          break; // Found the user's collection
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        dates: dates,
        topics: Array.from(topicsSet)
      }
    });
    
  } catch (err) {
    console.error('Error fetching chart data by userId:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch chart data' });
  }
});



app.get('/', (req, res) => {
  res.send('Server is running');
});


module.exports = app;