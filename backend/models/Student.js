const mongoose = require('mongoose');

const academicFieldSchema = new mongoose.Schema({
  marks: { type: Number, default: 0 },
  submitted: { type: Boolean, default: false }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  mid1: academicFieldSchema,
  mid2: academicFieldSchema,
  assignment1: academicFieldSchema,
  assignment2: academicFieldSchema,
  ela1: academicFieldSchema,
  ela2: academicFieldSchema,
  cbp: academicFieldSchema
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
