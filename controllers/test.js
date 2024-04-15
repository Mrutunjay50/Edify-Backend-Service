const Test = require("../models/test");
const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

const keyFile = process.env.CREDENTIALSTEST;

exports.createTestSheets = async (req, res, next) => {
  const {
    courseType,
    classes,
    course,
    subject,
    question,
    questionType,
    options: [option1, option2, option3, option4],
    correctOption: option,
    shortAnswer,
    difficulty,
  } = req.body;


  const auth = new google.auth.GoogleAuth({
    
    credentials: JSON.parse(keyFile),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });


  const spreadsheetId = "17Doncy6h1TpywrTf17McyDbZVV1erclvWZYpnOFgqsc";


  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId,
  });

  // read rows from the sheet
  // const getRowsForTest = await googleSheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range : "TestQuestions!A:K"
  // })
  // res.send(getRowsForTest.data);
  // write rows from sheet

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "TestQuestions!A:M",
    valueInputOption: "RAW",
    resource: {
      values: [
        [
          courseType,
          classes,
          course,
          subject,
          question,
          questionType,
          option1,
          option2,
          option3,
          option4,
          option + 1,
          shortAnswer,
          difficulty,
        ],
      ],
    },
  });
  
};


// exports.createTestSheets = async (req, res, next) => {
//   const questions = req.body.questions; // Array of questions

//   const auth = new google.auth.GoogleAuth({
//     keyFile,
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });
  
//   const client = await auth.getClient();
  
//   const googleSheets = google.sheets({ version: "v4", auth: client });
//   const spreadsheetId = "17Doncy6h1TpywrTf17McyDbZVV1erclvWZYpnOFgqsc";
  
//   const metaData = await googleSheets.spreadsheets.get({
//     auth: auth,
//     spreadsheetId,
//   });

//   // Loop through the array of questions and append them to the spreadsheet
//   for (const questionData of questions) {
//     const {
//       courseType,
//       classes,
//       course,
//       subject,
//       question,
//       questionType,
//       options: [option1, option2, option3, option4],
//       correctOption,
//       shortAnswer,
//       difficulty,
//     } = questionData;

//     // Append the question to the spreadsheet
//     await googleSheets.spreadsheets.values.append({
//       auth,
//       spreadsheetId,
//       range: "TestQuestions!A:M",
//       valueInputOption: "RAW",
//       resource: {
//         values: [
//           [
//             courseType,
//             classes,
//             course,
//             subject,
//             question,
//             questionType,
//             option1,
//             option2,
//             option3,
//             option4,
//             correctOption + 1,
//             shortAnswer,
//             difficulty,
//           ],
//         ],
//       },
//     });
//   }

//   // Send a response back to the client
//   res.status(200).json({ message: "Questions added to the spreadsheet" });
// };


exports.getTestScore = async (req, res, next) => {
  const {inWhat, course, subject, spreadSheetId : spreadSheetID} = req.body; // Array of questions

  console.log({inWhat, course, subject, spreadSheetID});

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  
  const client = await auth.getClient();
  
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = spreadSheetID[0].responseSheetId;
  
  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId,
  });

// read rows from the sheet
  const getRowsForTest = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range : "Form Responses 1!B:D"
  })
  res.send(getRowsForTest.data);

  // Send a response back to the client
  res.status(200).json({ message: "Questions added to the spreadsheet" });
};


exports.createTest = async (req, res) => {
  try {
    // Extract test data from request body
    const testData = req.body;

    // Create a new instance of the TestData model with the provided data
    const newTestData = new TestData(testData);

    // Save the new test data to the database
    await newTestData.save();

    // Return a success message
    res.status(201).json({ message: 'Test data stored successfully' });
  } catch (error) {
    // Handle any errors that occur during data storage
    console.error('Error storing test data:', error);
    res.status(500).json({ message: 'An error occurred while storing test data' });
  }
};