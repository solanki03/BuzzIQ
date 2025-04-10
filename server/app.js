//here I have setup the Express, middleware, and routes
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//routes will be added here
//app.use('/api/quiz', require('./routes/quizRoutes'));

app.get('/', (req, res) => {
    res.send(' BuzzIQ Backend is running...');
});

module.exports = app;
