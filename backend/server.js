const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
