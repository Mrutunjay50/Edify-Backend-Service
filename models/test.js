const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  prompt: {
    type: String,
    default: ''
  },
  options: {
    type: [String],
    default: ['', '', '', ''] // Array of 4 empty strings
  },
  correctOption: {
    type: String,
    default: ''
  }
});

const testDataSchema = new mongoose.Schema({
  courseType: {
    type: String,
    default: ''
  },
  questionType: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: ''
  },
  classes: {
    type: String,
    default: ''
  },
  course: {
    type: String,
    default: ''
  },
  questions: {
    type: [questionSchema], // Array of questions
    default: function() {
      // Populate the questions array with default values
      return Array.from({ length: 10 }, () => ({
        prompt: '',
        options: ['', '', '', ''],
        correctOption: ''
      }));
    }
  }
});

const TestData = mongoose.model('TestData', testDataSchema);

module.exports = TestData;
