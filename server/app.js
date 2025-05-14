const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectResultsDB } = require("./config/db");

const { getResultModel, createCollectionName } = require("./utils/dynamicResultModel");
const { fetchCollectionDocuments } = require("./controllers/questionsController");
const resultSchema = require("./models/resultSchema");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'https://buzz-iq.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS not allowed for origin ${origin}`), false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.options('/v1/results', cors());

const resultsDB = connectResultsDB();

// Health check
app.get("/health", async (req, res) => {
  try {
    const mainDbCollections = await mongoose.connection.db.listCollections().toArray();
    const resultsDbCollections = await resultsDB.db.listCollections().toArray();

    res.status(200).json({
      mainDb: {
        status: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        collections: mainDbCollections.map((c) => c.name),
      },
      resultsDb: {
        status: resultsDB.readyState === 1 ? "Connected" : "Disconnected",
        collections: resultsDbCollections.map((c) => c.name),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch questions from a collection
app.get("/v1/questions/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const docs = await fetchCollectionDocuments(collectionName);
    res.json(docs);
  } catch (err) {
    console.error("❗ Route error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Save quiz results
app.post("/v1/results", async (req, res) => {
  try {
    const {
      userId, username, topic, totalQuestions,
      correctAnswers, wrongAnswers, notAttempted,
      timeTaken, attemptId
    } = req.body;

    if (!userId || !username || !topic || totalQuestions === undefined || correctAnswers === undefined || timeTaken === undefined) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const calculatedNotAttempted = notAttempted !== undefined
      ? notAttempted
      : totalQuestions - correctAnswers - (wrongAnswers || 0);

    const calculatedWrongAnswers = wrongAnswers !== undefined
      ? wrongAnswers
      : totalQuestions - correctAnswers - calculatedNotAttempted;

    const Result = getResultModel(username, resultsDB);

    const result = new Result({
      userId, username, topic, totalQuestions,
      correctAnswers,
      wrongAnswers: calculatedWrongAnswers,
      notAttempted: calculatedNotAttempted,
      timeTaken, attemptId
    });

    if (result.correctAnswers + result.wrongAnswers + result.notAttempted !== result.totalQuestions) {
      return res.status(400).json({
        success: false,
        error: "Answer counts do not sum to total questions"
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

    console.log("Result saved:", result);

  } catch (err) {
    console.error("Error saving results:", err);

    const errorResponse = { success: false, error: "Failed to save results" };

    if (err.name === "ValidationError") {
      errorResponse.error = "Validation failed";
      errorResponse.details = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json(errorResponse);
    }

    if (process.env.NODE_ENV === "development") {
      errorResponse.details = err.message;
    }

    res.status(500).json(errorResponse);
  }
});

// Get user topic stats
app.get("/v1/results/:userId/:topicname", async (req, res) => {
  try {
    const { userId, topicname } = req.params;
    const displayTopic = topicname.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const collections = await resultsDB.db.listCollections({ name: /^results_/ }).toArray();

    let totalAttempts = 0, totalCorrectAnswers = 0, totalWrongAnswers = 0, totalNotAttemptedAnswers = 0, totalQuestions = 0;

    for (const coll of collections) {
      const Model = resultsDB.model(coll.name, resultSchema);
      const results = await Model.find({ userId, topic: displayTopic });

      results.forEach((result) => {
        totalAttempts++;
        totalCorrectAnswers += result.correctAnswers || 0;
        totalWrongAnswers += result.wrongAnswers || 0;
        const notAttempted = (result.totalQuestions || 0) - (result.correctAnswers || 0) - (result.wrongAnswers || 0);
        totalNotAttemptedAnswers += notAttempted > 0 ? notAttempted : 0;
        totalQuestions += result.totalQuestions || 0;
      });
    }

    if (totalAttempts === 0) {
      return res.status(404).json({
        success: false,
        error: "No results found for this user and topic combination"
      });
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
    console.error("Error in /v1/results/:userId/:topicname:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get participation dates and topics
app.get("/v1/chart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });

    const collections = await resultsDB.db.listCollections().toArray();

    let dates = [];
    let topicsSet = new Set();

    for (const coll of collections) {
      if (coll.name.startsWith("results_")) {
        const Model = resultsDB.model(coll.name, resultSchema);
        const userResults = await Model.find({ userId }, { createdAt: 1, topic: 1 }).sort({ createdAt: 1 });

        if (userResults.length > 0) {
          userResults.forEach((doc) => {
            if (doc.createdAt) dates.push(doc.createdAt);
            if (doc.topic) topicsSet.add(doc.topic);
          });
          break;
        }
      }
    }

    res.json({
      success: true,
      data: {
        dates,
        topics: Array.from(topicsSet)
      }
    });

  } catch (err) {
    console.error("Error fetching chart data by userId:", err);
    res.status(500).json({ success: false, error: "Failed to fetch chart data" });
  }
});


// get attemptIds for a user
app.get('/v2/results/cheak/:userId', async (req, res) => {
  const { userId } = req.params; 

  try {
    // Find all result collections
    const collections = await resultsDB.db.listCollections({ name: /^results_/ }).toArray();

    if (collections.length === 0) {
      return res.json({ attemptIds: [] });
    }

    // Collect all attemptIds from each relevant collection
    const allAttempts = await Promise.all(
      collections.map(async (coll) => {
        const Model = resultsDB.model(coll.name, resultSchema);
        const results = await Model.find({ userId }, { attemptId: 1, _id: 0 });
        return results.map(r => r.attemptId);
      })
    );

    // Flatten and deduplicate
    const uniqueAttemptIds = [...new Set(allAttempts.flat())];

    res.json({ attemptIds: uniqueAttemptIds });
  } catch (err) {
    console.error("Error fetching attempt IDs:", err);
    res.status(500).json({
      error: 'Server error while fetching attempt IDs',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});




app.get("/", (req, res) => {
  res.send("Server is running");
});

module.exports = app;
