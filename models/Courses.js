const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const collegeSubjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
    videos: [videoSchema]
});

const schoolSubjectSchema = new Schema({
  subjectname: {
    type: String,
    required: true
  },
  chapter:[{
    chapternumber: {
      type: Number
    },
    chaptername: {
      type: String,
      required: true
    },
    videos: [videoSchema],
  }]  
});

const collegeCourseSchema = new Schema({
  course: [{
        coursename: {
            type: String,
            enum: ["Btech", "Bsc"]
        },
        subjects: [collegeSubjectSchema],
    }]
});

const schoolCourseSchema = new Schema({
  class: [{
        classname: {
            type: String,
            enum: ["6", "7", "8", "9", "10", "11", "12"]
        },
        subjects: [schoolSubjectSchema],
    }]
});


const CCourses = Mongoose.model("collegecourse", collegeCourseSchema);
const SCourses = Mongoose.model("schoolcourse", schoolCourseSchema);

module.exports = { CCourses, SCourses };
