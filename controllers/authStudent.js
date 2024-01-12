const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const axios = require("axios")
const { CCourses, SCourses } = require("../models/Courses");
const io = require("../socket");

exports.registerStudent = async (req, res, next) => {
  try {
    let {googleAuth} = req.query;
    let { hasedPass, ...studentData } = req.body;
    const {
      email,
      username,
      inWhat: studentIn,
      schoolstudent,
      collegestudent,
    } = studentData;
    
    

    const existing_email = await Student.findOne({ email });
    const existing_user = await Student.findOne({ username });
    
    if (googleAuth) {
      // If it's a Google registration, check only for email existence
      if (existing_email) {
        console.error("Email already exists.");
        return res.status(400).json({ error: "Email already exists" });
      }
    } else {
      hasedPass = await bcrypt.hash(req.body.password, 10);
      // If it's a normal registration, check for both email and username existence
      if (existing_user) {
        console.error("Username already exists.");
        return res.status(400).json({ error: "Username already exists" });
      } else if (existing_email) {
        console.error("Email already exists.");
        return res.status(400).json({ error: "Email already exists" });
      } else if (req.body.cPass !== req.body.password) {
        console.error("Make sure the password matches the entered password.");
        return res.status(400).json({ error: "Passwords do not match" });
      }
    }

    // create new user
    const newStudent = await new Student({
      ...studentData,
      password: hasedPass,
    });

    let courseData;
    if (studentIn === "school") {
      courseData = await SCourses.findOne({});
    } else if (studentIn === "college") {
      courseData = await CCourses.findOne({});
    }

    if (courseData) {
      if (studentIn === "school") {
        const selectedClass = courseData.class.find(
          (schoolClass) => schoolClass.classname === schoolstudent
        );
        if (selectedClass) {
          newStudent.schoolCourse.class = selectedClass._id;
        }
      } else if (studentIn === "college") {
        const selectedCourse = courseData.course.find(
          (collegeCourse) => collegeCourse.coursename === collegestudent
        );
        if (selectedCourse) {
          newStudent.collegeCourse.course = selectedCourse._id;
        }
      }
    }

    // save user or response
    const user = await newStudent.save();
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
  }
};




exports.login = async (req, res, next) => {
  try {
    let user;

    if (req.body.googleAccessToken) {
      // Google sign-in
      const { googleAccessToken } = req.body;

      try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            "Authorization": `Bearer ${googleAccessToken}`
          }
        });
        console.log(response.data)

        const {email} = response.data;

        user = await Student.findOne({ email });

        if (!user) {
          return res.status(404).json({ message: "User doesn't exist!" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid access token!", err : error });
      }
    } else {
      // Normal login for students
      const { email, password } = req.body;

      user = await Student.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
    }

    // Token generation
    const token = await user.generateAuthToken();

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getUser = async (req, res, next) => {
  try {
    const user = await Student.findById(req.query.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  if (req.body._id === req.params.id) {
    try {
      const user = await Student.findOne({ email: req.body.email });

      // Check if a new profile picture was uploaded
      let profilePicture = user.profilePicture;
      if (req.file) {
        profilePicture = req.file.path;
      }

      let newPassword = req.body.password; // Store the new password

      if (!newPassword) {
        // If no new password is provided, keep the old password
        newPassword = user.password;
      } else {
        // Check if the new password is different from the old password
        if (newPassword !== req.body.password) {
          // Hash the new password
          newPassword = await bcrypt.hash(newPassword, 10);
        }
      }

      // Update user data, including the profile picture and password
      const updatedUser = await Student.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body,
            profilePicture: profilePicture, // Update profile picture path
            password: newPassword, // Set the new or old password
          },
        },
        { new: true }
      );
      const token = await updatedUser.generateAuthToken();

      res.status(200).json({ token, user: updatedUser });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};


exports.updateRecentSeen = async (req, res) => {
  try {
    const { studentId, clicked: item } = req.body;

    console.log(item);

    // Fetch the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Call the pushToRecentItems method
    await student.pushToRecentItems(item);

    return res.json({ message: "Recent items updated successfully", student });
  } catch (error) {
    console.error("Error updating recent items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




exports.updateCompletedVideos = async (req, res) => {
  const { videoId, userId, title } = req.body;

  try {
    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the video ID already exists in completedItems
    const existingCompletion = student.completedItems.find(
      (completion) => completion.videoId === videoId
    );

    if (existingCompletion) {
      // If the video ID already exists, return a message indicating it's a duplicate
      return res
        .status(400)
        .json({ message: "Video already marked as completed" });
    }

    // Add the new completion data to completedItems
    student.completedItems.push({
      videoId: videoId,
      completionDate: new Date(),
      title: title,
    });
    student.setTotalScores();
    // Save the updated student document
    await student.save();
    //   io.getIO().on('connection', (socket) => {
    //       socket.emit('completionScore' , {data : "sent"})
    // })
    // Send a success response to the client
    res
      .status(200)
      .json({ message: "Completion data stored successfully", student });
  } catch (error) {
    console.error("Error storing completion data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getAllUsersTotalScores = async (req, res, next) => {
  const { course, inwhat } = req.query;
  try {
    // Construct a query object to filter based on course and inwhat
    let queries;
    if (inwhat === "college") {
      queries = {
        // Assuming `course` and `inwhat` are fields in your Student schema
        collegestudent: course,
        inWhat: inwhat,
      };
    } else {
      queries = {
        // Assuming `course` and `inwhat` are fields in your Student schema
        schoolstudent: course,
        inWhat: inwhat,
      };
    }
    const users = await Student.find(queries)
      .sort({ totalExp: -1 })
      .select("_id fullname username totalExp"); // Fetch users sorted by totalExp
    io.getIO().on("connection", (socket) => {
      socket.on("actionScore", async ({ data }) => {
        const users = await Student.find(queries)
          .sort({ totalExp: -1 })
          .select("_id fullname username totalExp");
        socket.broadcast.emit("ScoreDATA", { users: users });
      });
    });
    io.getIO().on("connection", (socket) => {
      socket.on("completionScore", async ({ data }) => {
        const users = await Student.find(queries)
          .sort({ totalExp: -1 })
          .select("_id fullname username totalExp");
        socket.broadcast.emit("ScoreDATA", { users: users });
      });
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
