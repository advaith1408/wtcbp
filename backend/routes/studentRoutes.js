const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');

// GET all students for the logged-in teacher
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ teacher: req.user._id }).sort({ rollNumber: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new student
router.post('/', auth, async (req, res) => {
  const student = new Student({
    ...req.body,
    teacher: req.user._id
  });
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update student
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found or unauthorized' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({ 
      _id: req.params.id, 
      teacher: req.user._id 
    });
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found or unauthorized' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bulk', auth, async (req, res) => {
  try {
    const { students } = req.body;
    
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: 'Invalid students data' });
    }

    console.log(`Processing bulk import for ${students.length} students...`);

    const operations = students.map(s => {
      // Create a clean update object
      const updateObj = {
        name: s.name,
        year: s.year,
        branch: s.branch,
        section: s.section,
        teacher: req.user._id
      };

      // Only include academic fields if they were present in the import
      const academicFields = ['mid1', 'mid2', 'assignment1', 'assignment2', 'ela1', 'ela2', 'cbp'];
      academicFields.forEach(field => {
        if (s[field] && s[field].submitted !== undefined) {
          updateObj[field] = s[field];
        }
      });

      return {
        updateOne: {
          filter: { 
            rollNumber: s.rollNumber.toUpperCase(), 
            teacher: req.user._id 
          },
          update: { $set: updateObj },
          upsert: true
        }
      };
    });

    const result = await Student.bulkWrite(operations, { ordered: false });
    
    // Log the first student's update object for debugging
    if (operations.length > 0) {
      console.log('Sample Update Object (First Student):', JSON.stringify(operations[0].updateOne.update.$set, null, 2));
    }
    console.log('Bulk Write Result Summary:', {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount
    });

    res.status(201).json({ 
      message: 'Bulk operation completed',
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (err) {
    console.error('Bulk Import Error:', err);
    // If it's a bulk write error, we can still report partial success
    if (err.name === 'BulkWriteError' || err.code === 11000) {
      return res.status(207).json({ 
        message: 'Bulk operation completed with some conflicts (likely duplicate roll numbers belonging to other teachers).',
        details: err.message
      });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
