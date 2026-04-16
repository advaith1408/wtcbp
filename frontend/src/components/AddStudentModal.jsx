import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    year: '1st Year',
    branch: 'CSE',
    section: 'A',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const defaultAcademic = { marks: 0, submitted: false };
    const newStudent = {
      ...formData,
      mid1: { ...defaultAcademic },
      mid2: { ...defaultAcademic },
      assignment1: { ...defaultAcademic },
      assignment2: { ...defaultAcademic },
      ela1: { ...defaultAcademic },
      ela2: { ...defaultAcademic },
      cbp: { ...defaultAcademic },
    };
    onAdd(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Add New Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="input-field w-full text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Roll Number</label>
            <input
              type="text"
              required
              className="input-field w-full text-white uppercase"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="e.g. 22XX1A05XX"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Year</label>
              <select
                className="input-field w-full text-white bg-surface"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Branch</label>
              <select
                className="input-field w-full text-white bg-surface"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>MECH</option>
                <option>CIVIL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">Section</label>
              <select
                className="input-field w-full text-white bg-surface"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn bg-white/5 hover:bg-white/10 flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
