const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'BuzzIQ_Questions'
    });
    console.log(`MongoDB Sucessfully Connected: ${conn.connection.host}`);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
  } 
  catch (error) {
    console.error(`Mongodb connection failed: ${error.message}`);
    process.exit(1);
    
  }
}

module.exports = connectDB;