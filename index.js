const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://ashrafu:ashrafu98@cluster0.wshnwjm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
  id: Number,
  name: String
});
//this is the student model
const student = mongoose.model('student', studentSchema);


const professorSchema = new mongoose.Schema({
  id: Number,
  name: String
});
//this is the professor model
const professor = mongoose.model('professor', professorSchema);

const courseSchema = new mongoose.Schema({
  name: String,
  dept: String
})
//this is the model for the course 
const course = mongoose.model('course', courseSchema);

const enrollmentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'student'},
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course'}
})
//this is the model for the enrollment 
const enrollment = mongoose.model('enrollment', enrollmentSchema);

const assignedProf = new mongoose.Schema({
  professor_id: {type: mongoose.Schema.Types.ObjectId, ref: 'professor'},
  course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'}
})
//this is the assigned prof model
const assignedProfessor = mongoose.model('assignedProfessor', assignedProf);


app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.get("/home", (req, res) => {
  function HomePage(){
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  }

  HomePage();
});

app.post('/student', async (req, res) => {
  const { id, name } = req.body.data;

  console.log(id, name);

  const newStudent = new student({ id, name });
  const savedStudent = await newStudent.save();

  res.json({
    message: "Student received successfully"
  });
});

app.post('/professor', async (req, res) => {
  const { id, name } = req.body.data;

  console.log(id, name);

  const newProf = new professor({ id, name });
  const savedProf = await newProf.save();

  res.json({
    message: "Professor received successfully"
  });
});

app.post('/course', async (req, res) => {
  const {name, dept} = req.body.data;

  console.log(name, dept);

  const newCourse = new course({name, dept});
  const savedCourse = await newCourse.save();

  res.json({
    message: "Course received successfully"
  });
});


// 1. List of students enrolled in a specific course
app.get('/students/:courseId', async (req, res) => {
  try {
    const students = await enrollment.find({ course_id: req.params.courseId }).populate('student_id');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Courses taught by a particular professor
app.get('/courses/:professorId', async (req, res) => {
  try {
    const courses = await assignedProfessor.find({ prof_id: req.params.professorId }).populate('course_id');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`The server is running on PORT: ${PORT}`);
});