const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_tracker';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Create or Find User
    const username = 'advaith1408';
    const password = '1408';
    const email = 'advaith1408@example.com'; // Dummy email for seeding

    let user = await User.findOne({ name: username });
    if (!user) {
      console.log('Creating user...');
      user = new User({
        name: username,
        email: email,
        password: password // Model will hash it
      });
      await user.save();
      console.log('User created:', user._id);
    } else {
      console.log('User already exists:', user._id);
    }

    // 2. Sample Data
    const students = [
      {
        "name": "Student 1",
        "rollNumber": "24071A6901",
        "teacher": user._id,
        "year": "3",
        "branch": "CSE",
        "section": "C",
        "mid1": { "marks": 25, "submitted": true },
        "mid2": { "marks": 27, "submitted": true },
        "assignment1": { "marks": 4, "submitted": true },
        "assignment2": { "marks": 5, "submitted": true },
        "ela1": { "marks": 5, "submitted": true },
        "ela2": { "marks": 4, "submitted": true },
        "cbp": { "marks": 5, "submitted": true }
      },
      {
        "name": "Student 2",
        "rollNumber": "24071A6902",
        "teacher": user._id,
        "year": "3",
        "branch": "CSE",
        "section": "C",
        "mid1": { "marks": 18, "submitted": true },
        "mid2": { "marks": 20, "submitted": true },
        "assignment1": { "marks": 3, "submitted": true },
        "assignment2": { "marks": 2, "submitted": false },
        "ela1": { "marks": 4, "submitted": true },
        "ela2": { "marks": 3, "submitted": false },
        "cbp": { "marks": 4, "submitted": true }
      },
      {
        "name": "Student 3",
        "rollNumber": "24071A6903",
        "teacher": user._id,
        "year": "3",
        "branch": "CSE",
        "section": "C",
        "mid1": { "marks": 12, "submitted": true },
        "mid2": { "marks": 15, "submitted": true },
        "assignment1": { "marks": 2, "submitted": false },
        "assignment2": { "marks": 3, "submitted": true },
        "ela1": { "marks": 3, "submitted": true },
        "ela2": { "marks": 2, "submitted": false },
        "cbp": { "marks": 3, "submitted": true }
      },
      {
        "name": "Student 4",
        "rollNumber": "24071A6904",
        "teacher": user._id,
        "year": "3",
        "branch": "CSE",
        "section": "C",
        "mid1": { "marks": 28, "submitted": true },
        "mid2": { "marks": 29, "submitted": true },
        "assignment1": { "marks": 5, "submitted": true },
        "assignment2": { "marks": 5, "submitted": true },
        "ela1": { "marks": 5, "submitted": true },
        "ela2": { "marks": 5, "submitted": true },
        "cbp": { "marks": 5, "submitted": true }
      },
      {
        "name": "Student 5",
        "rollNumber": "24071A6905",
        "teacher": user._id,
        "year": "3",
        "branch": "CSE",
        "section": "C",
        "mid1": { "marks": 10, "submitted": false },
        "mid2": { "marks": 14, "submitted": true },
        "assignment1": { "marks": 1, "submitted": false },
        "assignment2": { "marks": 2, "submitted": true },
        "ela1": { "marks": 2, "submitted": false },
        "ela2": { "marks": 3, "submitted": true },
        "cbp": { "marks": 2, "submitted": false }
      }
    ];

    // 3. Clear existing students for this user to avoid roll number duplicates
    await Student.deleteMany({ teacher: user._id });
    console.log('Cleared existing students for this user');

    // 4. Insert Students
    await Student.insertMany(students);
    console.log('Sample data seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
