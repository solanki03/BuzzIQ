// index.js
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');  // <-- We’ll define routes in app.js

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Define your routes here
app.get('/', (req, res) => {
    res.send('Hello from Vercel Serverless!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
