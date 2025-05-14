const mongoose = require("mongoose");

const fetchCollectionDocuments = async (collectionName) => {
  const db = mongoose.connection.useDb("BuzzIQ_Questions").db;
  const collections = await db.listCollections().toArray();

  const exists = collections.some((c) => c.name === collectionName);
  if (!exists) {
    throw new Error("Collection not found");
  }

  return await db.collection(collectionName).find({}).toArray();
};

module.exports = {
  fetchCollectionDocuments,
};
