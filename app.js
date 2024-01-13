const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const apiRouter = require("./routes/api");
const testRouter = require("./routes/test");
const pdfRouter = require("./routes/pdfRoutes");
const scoreRouter = require("./routes/scores");
const cors = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");



const corsOptions = {
  // origin: "*",
  origin: 'https://edify-tau.vercel.app',
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // Allow cookies, authentication headers, etc.
};

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    const server = app.listen(process.env.PORT || 8800);
    const io = require('./socket').init(server, {
      cors: corsOptions  // Use the same CORS options
    });
    io.on('connection', socket =>{
      console.log("client connected");
    })
  })
  .catch(err => console.log(err));

// middleware
app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("common"));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single(
    "profilePicture"
  )
);
app.use("/images", express.static(path.join(__dirname, "images")));

//lets make the teachers do the work of submitting the sheet Id 
// after that i will fetch the data according to the emails and name if needed
//and the teachers can update the marks per their needs and make it convenient for themselves and the other things to consider in exps is how recent the user is active and how much videos he or she completed
//also the no. of times the save note button is clicked will be contributed for exp gaining as well


// router
app.use(authRouter);
app.use(apiRouter);
app.use(pdfRouter);
app.use(testRouter);
app.use(scoreRouter);
