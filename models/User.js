const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

class CircularQueue {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.queue = [];
  }

  push(item) {
    this.queue.unshift(item); // Add the item to the front
    if (this.queue.length > this.maxSize) {
      this.queue.pop(); // Remove the oldest item if the queue size exceeds maxSize
    }
  }

  getItems() {
    return this.queue;
  }
}

const studentSchema = new Schema(
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
    age: {
      type: Number,
      default: "",
    },
    institute: {
      type: String,
      default: "",
    },
    passingyear: {
      type: String,
      default: "",
    },
    inWhat: {
      type: String,
      enum: ["school", "college"],
      required: true,
    },
    schoolstudent: {
      type: String,
      enum: ["6", "7", "8", "9", "10", "11", "12", ""],
      required: function () {
        return this.inWhat === "school";
      },
    },
    collegestudent: {
      type: String,
      enum: ["Btech", "Bsc", ""],
      required: function () {
        return this.inWhat === "college";
      },
    },
    recentItems: {
      type: [Schema.Types.Mixed], // You can store any type of data in the circular queue
      default: [],
    },
    completedItems: {
      type: [Schema.Types.Mixed],
      default: [],
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
    },
        actionScores: {
          type: Number,
          default: 0,
        },
      
        testScores: {
          type: Number,
          default: 0,
        },

        totalExp : {
          type: Number,
          default: 0,
        }
  },
  { timestamps: true }
);

function getRefModel(student) {
  if (student.inWhat === "school") {
    return "schoolcourse"; // Use the ref name for the school course model
  } else if (student.inWhat === "college") {
    return "collegecourse"; // Use the ref name for the college course model
  }
}

studentSchema.add({
  schoolCourse: {
    class: {
      type: Schema.Types.ObjectId,
      ref: "schoolcourse",
      required: function () {
        return (
          this.inWhat === "school" &&
          ["6", "7", "8", "9", "10", "11", "12"].includes(this.schoolstudent)
        );
      },
    },
  },
  collegeCourse: {
    course: {
      type: Schema.Types.ObjectId,
      ref: function (student) {
        return getRefModel(student); // Use the appropriate ref model
      },
      required: function () {
        return (
          this.inWhat === "college" &&
          ["Btech", "Bsc"].includes(this.collegestudent)
        );
      },
    },
  },
});

studentSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { userId: this._id.toString() },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return token;
  } catch (err) {
    console.log("Error while generating token:", err);
  }
};

studentSchema.methods.setTotalScores = function () {
  try {
      this.totalExp = this.actionScores + (150*this.completedItems.length)
      console.log(this.totalExp);
      return this; // Return the modified object without saving
    } catch (err) {
    console.log("Error while updating Total Scores:", err);
    throw new Error("Internal server error");
  }
};

// const classSchema = new Schema({
//     schoolclasses: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Student",
//         validate: {
//           validator: function (value) {
//             return value.every((student) => student.inWhat === "school");
//           },
//           message: (props) => "All referenced students must be school students.",
//         },
//       },
//     ],
//     collegeclasses: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Student",
//         validate: {
//           validator: function (value) {
//             return value.every((student) => student.inWhat === "college");
//           },
//           message: (props) => "All referenced students must be college students.",
//         },
//       },
//     ],
//   });

// Add a method to push items into the circular queue
studentSchema.methods.pushToRecentItems = function (item) {
  // Get the current recentItems array
  const recentItems = this.recentItems || [];

  let itemNTime = item.split(" ");
  const finalPopped = itemNTime.pop();

  // Check if the item already exists in the recentItems array
  const itemIndex = recentItems.findIndex((existingItem) => {
    const Item = existingItem.split(" ");
    Item.pop();
    return Item.join(" ") === itemNTime.join(" ");
  });

  if (itemIndex !== -1) {
    // Remove the existing item if found
    recentItems.splice(itemIndex, 1);
  }

  // Create a CircularQueue with a maximum size of 4
  const maxSize = 4;
  const circularQueue = new CircularQueue(maxSize);

  // Initialize the circular queue with the existing recentItems
  circularQueue.queue = recentItems;

  // Push the new item into the circular queue
  circularQueue.push(item);

  // Update the recentItems field in the schema with the updated circular queue
  this.recentItems = circularQueue.getItems();

  // Set the schoolstudent and collegestudent fields based on 'inWhat'
  if (this.inWhat === "school") {
    this.schoolstudent = item.split(" ")[1]; // Update with the appropriate value for school
    this.collegestudent = undefined; // Reset collegestudent
  } else if (this.inWhat === "college") {
    this.schoolstudent = undefined; // Reset schoolstudent
    this.collegestudent = item.split(" ")[1]; // Update with the appropriate value for college
  }

  // Save the document to persist the changes
  return this.save();
};

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
