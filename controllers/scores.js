const Student = require("../models/User");


// exports.setTestScore = (req, res) => {
    
// }


exports.setActionScore = async (req, res) => {
    try {
      const {userId, incrementVal} = req.body;
      const student = await Student.findById(userId);
  
      if (student) {
        if (!student.actionScores) {
            if(!student.totalExp) {
              student.actionScores = incrementVal;
              student.totalExp = student.actionScores+ (150*student.completedItems.length);
            }else{
              student.actionScores = incrementVal;
              student.totalExp = student.actionScores + (150*student.completedItems.length)
            }
        } else {
          if(!student.totalExp){
            student.actionScores += incrementVal; // Increment by 100 // Increment actionScores by 100
            student.totalExp = student.actionScores + (150*student.completedItems.length);
          }else {
            student.actionScores += incrementVal;
            student.totalExp = student.actionScores + (150*student.completedItems.length)
          }
        }
  
        // Save the updated student data after modifications
        await student.save();
        res.status(200).json({ message: "Action scores updated successfully." , user : student});
      } else {
        res.status(404).json({ message: "Student not found." });
      }
    } catch (error) {
      console.error("Error updating action scores:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };