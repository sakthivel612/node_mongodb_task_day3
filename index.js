const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const Mentor = require("./data/mentors");
const Student = require("./data/students");

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/mentor_student_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// API to create a Mentor
app.post("/mentors", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to create a Student
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to assign a Student to a Mentor
app.put("/assign/:mentorId/:studentId", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    const student = await Student.findById(req.params.studentId);
    if (!mentor || !student) {
      return res.status(404).send({ message: "Mentor or Student not found" });
    }
    student.mentor = mentor;
    await student.save();
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to change Mentor for a Student
app.put("/change-mentor/:studentId/:newMentorId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const newMentor = await Mentor.findById(req.params.newMentorId);
    if (!student || !newMentor) {
      return res
        .status(404)
        .send({ message: "Student or New Mentor not found" });
    }
    student.mentor = newMentor;
    await student.save();
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to show all students for a particular mentor
app.get("/students-for-mentor/:mentorId", async (req, res) => {
  try {
    const students = await Student.find({ mentor: req.params.mentorId });
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API to show the previously assigned mentor for a particular student
app.get("/previous-mentor/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    const previousMentor = await Mentor.findById(student.mentor);
    res.status(200).send(previousMentor);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
