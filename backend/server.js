const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();
const db = require('./db');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin:"https://vote-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());

// Routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const electionRoutes = require("./routes/electionRoutes");

app.use('/user', userRoutes);
app.use('/candidates', candidateRoutes);
app.use("/elections", electionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


