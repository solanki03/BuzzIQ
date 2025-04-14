// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'BuzzIQ_Questions'
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Using database: ${conn.connection.db.databaseName}`);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
