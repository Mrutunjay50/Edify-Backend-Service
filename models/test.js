const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  className: String,
  classSubject : String,
  subjectChapter : String,
  date: Date,
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswerIndex: Number,
    },
  ], 
});

module.exports = mongoose.model('Test', testSchema); 