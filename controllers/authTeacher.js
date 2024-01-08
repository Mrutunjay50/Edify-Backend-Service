const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");

exports.registerTeacher = async (req, res, next) => {
    try {
      let { hasedPass, ...teacherData } = req.body;
      const {
        email,
        username
      } = teacherData;
      hasedPass = await bcrypt.hash(req.body.password, 10);
  
      const existing_email = await Teacher.findOne({ email });
      const existing_user = await Teacher.findOne({ username });
      if (existing_user) {
        console.error("Username already exists.");
        return res.status(400).json({ error: "Username already exists" });
      } else if (existing_email) {
        console.error("email already exists.");
        return res.status(400).json({ error: "Email already exists" });
      } else if (req.body.cPass !== req.body.password) {
        console.error("make sure the password matches to the entered password");
        return res.status(400).json({ error: "Passwords do not match" });
      }
  
      // create new user
      const newTeacher = await new Teacher({
        ...teacherData,
        password: hasedPass,
      });
  
      // save user or response
      const user = await newTeacher.save();
      res.status(200).json(user);
    } catch (e) {
      console.log(e);
    }
  };

  
  
  exports.login = async (req, res, next) =>{
    if(req.body.profession === "teacher/professor"){
        try {
          console.log(req.body.profession)
          const user = await Teacher.findOne({ email: req.body.email });
          if (!user) {
            return res.status(404).json("User not found");
          }
      
          const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!validPassword) {
            return res.status(400).json("Incorrect password");
          }
      
          // Token generation
          const token = await user.generateAuthToken();
          const maxAge = 60 * 60; // 1 hour in seconds
          res.cookie("jwt", token, { maxAge, secure: true, httpOnly: false });
      
          // Return the token and user data
          res.status(200).json({ token, user });
        } catch (error) {
          console.error("Login error:", error);
          res.status(500).json("Internal server error");
        }
      }
  }
  
  exports.updateTeacher = async (req, res, next) => {
    if (req.body._id === req.params.id) {
      try {
        const user = await Teacher.findOne({ email: req.body.email });
  
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
        const updatedUser = await Teacher.findByIdAndUpdate(
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