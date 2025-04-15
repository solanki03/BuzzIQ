const mongoose = require('mongoose');

// Basic result schema
const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  correctAnswers: Number,
  wrongAnswers: Number,
  notAttempted: Number,
  totalQuestions: Number,
  score: Number,
  timeTaken: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Utility to sanitize collection names
const createCollectionName = (username) => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Dynamically return model tied to specific collection
const getResultModel = (username) => {
  const collectionName = `results_${createCollectionName(username)}`;
  return mongoose.connection.useDb('BuzzIQ_Assects').model(collectionName, resultSchema, collectionName);
};

module.exports = {
  createCollectionName,
  getResultModel
};
// This function is used to get the results of a specific topic for a user