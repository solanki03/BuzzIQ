const mongoose = require("mongoose");
const resultSchema = require("../models/resultSchema");

const modelCache = {};

// Helper to create a MongoDB-safe collection name
const createCollectionName = (username) => {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
};

// Get or create a dynamic Mongoose model for user's result
function getResultModel(username, resultsDB) {
  const collectionName = `results_${createCollectionName(username)}`;

  if (modelCache[collectionName]) {
    return modelCache[collectionName];
  }

  const Model = resultsDB.model(collectionName, resultSchema);
  modelCache[collectionName] = Model;

  return Model;
}

module.exports = {
  getResultModel,
  createCollectionName,
};
