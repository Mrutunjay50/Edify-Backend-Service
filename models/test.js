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
    default: '',
    required : true
  },
  questionType: {
    type: String,
    default: '',
    required : true
  },
  subject: {
    type: String,
    default: '',
    required : true
  },
  classes: {
    type: String,
    default: '',
    required : true
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
