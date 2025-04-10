//connecting database (MONGODB CONNECTION LOGIC)
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
        });
        //console.log(conn.connection.host);
        console.log("MongoDB connected succesfully!");
        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
        
    }
};

module.exports = connectDB;

