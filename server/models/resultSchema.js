const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    topic: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    notAttempted: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    attemptId: { type: String },
  },
  { timestamps: true }
);

module.exports = resultSchema;
