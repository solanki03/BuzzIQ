// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'https://buzz-iq.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Results database connection using the existing connection pool
const resultsDB = mongoose.createConnection(process.env.MONGODB_URI, {
  dbName: 'BuzzIQ_Assects'
});

// Helper function to create collection-safe name
const createCollectionName = (username) => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Result schema
const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  notAttempted: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
}, { timestamps: true });

// Model cache
const modelCache = {};

const getResultModel = (username) => {
  const collectionName = `results_${createCollectionName(username)}`;
  if (modelCache[collectionName]) return modelCache[collectionName];
  
  const Model = resultsDB.model(collectionName, resultSchema);
  modelCache[collectionName] = Model;
  return Model;
};

// Routes
app.get('/v1/questions/:collectionName', async (req, res) => {
  try {
    const collectionName = req.params.collectionName;
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === collectionName)) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const docs = await db.collection(collectionName).find({}).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/v1/results', async (req, res) => {
  try {
    const { userId, username, topic, totalQuestions, correctAnswers, wrongAnswers, notAttempted, timeTaken } = req.body;

    if (!userId || !username || !topic || totalQuestions === undefined || 
        correctAnswers === undefined || timeTaken === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const calculatedNotAttempted = notAttempted !== undefined ? notAttempted : 
                                 (totalQuestions - correctAnswers - (wrongAnswers || 0));
    const calculatedWrongAnswers = wrongAnswers !== undefined ? wrongAnswers : 
                                 (totalQuestions - correctAnswers - calculatedNotAttempted);

    const Result = getResultModel(username);
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

    if (result.correctAnswers + result.wrongAnswers + result.notAttempted !== result.totalQuestions) {
      return res.status(400).json({
        success: false,
        error: 'Answer counts do not sum to total questions'
      });
    }

    await result.save();
    res.status(201).json({
      success: true,
      data: {
        collection: `results_${createCollectionName(username)}`,
        result: result.toObject()
      }
    });
  } catch (err) {
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
    const displayTopic = topicname.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const collections = await resultsDB.db.listCollections({ name: /^results_/ }).toArray();
    
    let totalAttempts = 0;
    let totalCorrectAnswers = 0;
    let totalWrongAnswers = 0;
    let totalNotAttemptedAnswers = 0;
    let totalQuestions = 0;

    for (const coll of collections) {
      const Model = resultsDB.model(coll.name, resultSchema);
      const results = await Model.find({ userId, topic: displayTopic });

      results.forEach(result => {
        totalAttempts++;
        totalCorrectAnswers += result.correctAnswers || 0;
        totalWrongAnswers += result.wrongAnswers || 0;
        const notAttempted = (result.totalQuestions || 0) - (result.correctAnswers || 0) - (result.wrongAnswers || 0);
        totalNotAttemptedAnswers += notAttempted > 0 ? notAttempted : 0;
        totalQuestions += result.totalQuestions || 0;
      });
    }

    if (totalAttempts === 0) {
      return res.status(404).json({ success: false, error: 'No results found' });
    }

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
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/v1/chart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, error: 'User ID is required' });

    const collections = await resultsDB.db.listCollections().toArray();
    let dates = [];
    let topicsSet = new Set();
    
    for (const coll of collections) {
      if (coll.name.startsWith('results_')) {
        const Model = resultsDB.model(coll.name, resultSchema);
        const userResults = await Model.find({ userId }, { createdAt: 1, topic: 1 }).sort({ createdAt: 1 });
        
        if (userResults.length > 0) {
          userResults.forEach(doc => {
            if (doc.createdAt) dates.push(doc.createdAt);
            if (doc.topic) topicsSet.add(doc.topic);
          });
          break;
        }
      }
    }
    
    res.json({ success: true, data: { dates, topics: Array.from(topicsSet) } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch chart data' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Initialize server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});