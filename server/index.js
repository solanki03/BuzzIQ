const dotenv = require('dotenv');
dotenv.config();

const { connectMainDB } = require("./config/db");
const PORT = process.env.PORT || 5000;

// Connect to DB and then load the app
connectMainDB().then(() => {
  const app = require('./app'); // Delay loading app until DB is connected

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});