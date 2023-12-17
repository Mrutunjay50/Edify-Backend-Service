const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const teacherSchema = new Schema(
    {
      profilePicture: {
        type: String,
        default: "",
      },
      fullname: {
        required: true,
        type: String,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      bio: {
        default: "",
        type: String,
        max: 180,
      },
      experience :{
        default: "",
        type: String,
      },
      classes: {
        default: "",
        type: String,
      },
      subjects: {
        default: "",
        type: String,
      },
      email: {
        required: true,
        type: String,
        unique: true,
      },
      password: {
        required: true,
        type: String,
      },
      contact: {
        type: String,
        default: "",
      },
      pronoun: {
        type: String,
        default: "",
      },
      profession : {
        type: String,
        default: "teacher/professor",
      },
      age: {
        type: Number,
        default: "",
      },
      
      socialacc: {
        type: Object,
        instagram: {
          type: String,
          default: "",
        },
        twitter: {
          type: String,
          default: "",
        },
        linkedin: {
          type: String,
          default: "",
        },
      }
    },
    { timestamps: true }
  );


  teacherSchema.methods.generateAuthToken = async function () {
    try {
      const token = jwt.sign(
        { userId: this._id.toString() ,profession : this.profession},
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return token;
    } catch (err) {
      console.log("Error while generating token:", err);
    }
  };
  

const Teacher = mongoose.model("teacher", teacherSchema);

module.exports = Teacher;