// students.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  grade: String, // The student's grade or level
  courses: [
    {
      type: String,
    },
  ],
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },
});

module.exports = mongoose.model("Student", studentSchema);
