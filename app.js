const express = require("express");
require("dotenv").config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Array to store Codevergers
const codevergers = [
  {
    id: 1,
    name: "Alice",
    age: 20,
    favoriteColor: "blue",
    cohort: 1,
  },
  {
    id: 2,
    name: "Bob",
    age: 22,
    favoriteColor: "green",
    cohort: 2,
  },
];

// Authorization middleware
function authorize(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (apiKey && apiKey === process.env.API_KEY) {
    next(); // Continue to the route handler
  } else {
    res.status(401).send("Unauthorized: Invalid API Key");
  }
}

// Route to get all Codevergers
app.get("/codevergers", (req, res) => {
  res.json(codevergers);
});

// Route to get a Codeverger by ID
app.get("/codevergers/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = codevergers.find((s) => s.id === studentId);
  if (student) {
    res.json(student);
  } else {
    res.status(404).send("Codeverger not found");
  }
});

// Route to create a new Codeverger (secured)
app.post("/codevergers", authorize, (req, res) => {
  const newStudent = req.body;
  newStudent.id = codevergers.length + 1;
  codevergers.push(newStudent);
  res.status(201).json(newStudent);
});

// Route to update a Codeverger by ID (secured)
app.put("/codevergers/:id", authorize, (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = codevergers.findIndex((s) => s.id === studentId);
  if (studentIndex !== -1) {
    const updatedStudent = { ...codevergers[studentIndex], ...req.body };
    codevergers[studentIndex] = updatedStudent;
    res.json(updatedStudent);
  } else {
    const newStudent = { id: studentId, ...req.body };
    codevergers.push(newStudent);
    res.status(201).json(newStudent);
  }
});

// Route to delete a Codeverger by ID
app.delete("/codevergers/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = codevergers.findIndex((s) => s.id === studentId);
  if (studentIndex !== -1) {
    codevergers.splice(studentIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Codeverger not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
