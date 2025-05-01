const mongoose = require('mongoose');

// In db.js, add connection event listeners
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'BuzzIQ_Questions',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;