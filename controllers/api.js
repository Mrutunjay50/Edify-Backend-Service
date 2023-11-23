const {CCourses, SCourses} = require("../models/Courses");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const dialogflow = require('dialogflow');
const sessionID = uuidv4();

dotenv.config();
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
let config = {
  credentials: {
    client_email : CREDENTIALS.client_email,
    private_key : CREDENTIALS.private_key
  }
  }
const sessionClient = new dialogflow.SessionsClient(config);



exports.apiCCourse = async (req,res, next) => {
    try{
        const newCCourse = new CCourses(req.body)
        console.log(req.body);
        const insertCourse = await newCCourse.save();
        res.status(201).send(insertCourse);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.apiSCourse = async (req,res, next) => {
    try{
        const newSCourse = new SCourses(req.body)
        console.log(req.body);
        const insertCourse = await newSCourse.save();
        res.status(201).send(insertCourse);
    }catch(e){
        res.status(400).send(e);
    }
}

exports.getCollegeCourses = async (req, res, next) => {
    try {
      const collegeCourses = await CCourses.find();
      const formattedCourses = collegeCourses[0].course.map((course) => ({
        coursename: course.coursename,
        subjects: course.subjects,
      }));
      res.status(200).json(formattedCourses);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
};
  
  exports.getSchoolCourses = async (req, res, next) => {
    try {
      const schoolCourses = await SCourses.find();
      const formattedCourses = schoolCourses[0].class.map((schoolClass) => ({
        classname: schoolClass.classname,
        subjects: schoolClass.subjects,
      }));
      res.status(200).json(formattedCourses);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
};


exports.getFormUrls = (req, res) => {
  // Make the fetch request to your Google Apps Script URL
  fetch('https://script.google.com/macros/s/AKfycbwuel-2X4RDBvUX6cStJEDNutv_ueO2npyWqn62n32OZCG1kk0hTiPJL9un0COurq0-mw/exec?action=getAllForms')
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the JSON response
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .then((data) => {
      // console.log(data); // Handle the JSON data
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
}


exports.getDialogIntent = async (req, res) => {

  const sessionPath = sessionClient.sessionPath('counselor-chatbot-vydk', sessionID);
  const { text } = req.body;
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const message = response.queryResult.fulfillmentMessages.map(item => item.text.text); // Use response.queryResult.fulfillmentText
    console.log(message);
    res.json({ message });
  }catch(err){
    console.log(err);
  }
}