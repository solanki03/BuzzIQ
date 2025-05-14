const mongoose = require('mongoose');

const connectMainDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'BuzzIQ_Questions',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Connected to main DB (BuzzIQ_Questions)');
  } catch (error) {
    console.error(`Main DB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const connectResultsDB = () => {
  const resultsDB = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: 'BuzzIQ_Assects',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  resultsDB.on('connected', () => {
    console.log('Connected to 2nd DB (BuzzIQ_Assects)');
  });

  resultsDB.on('error', (err) => {
    console.error('2nd DB connection error:', err);
  });

  return resultsDB;
};

module.exports = {
  connectMainDB,
  connectResultsDB,
};
