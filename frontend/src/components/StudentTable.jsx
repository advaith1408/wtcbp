import React, { useState } from 'react';
import { Trash2, Save, X, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { updateStudent, deleteStudent } from '../api/studentApi';
import { clsx } from 'clsx';

const AcademicCell = ({ studentId, field, data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [marks, setMarks] = useState(data.marks);

  const handleSave = async () => {
    try {
      await onUpdate(studentId, { [field]: { ...data, marks: Number(marks) } });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubmission = async () => {
    try {
      await onUpdate(studentId, { [field]: { ...data, submitted: !data.submitted } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={clsx(
      "p-2 border-r border-white/5 min-w-[120px] transition-colors",
      !data.submitted && "bg-red-500/10"
    )}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                className="w-12 bg-white/10 border border-white/20 rounded px-1 py-0.5 text-xs outline-none"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                autoFocus
              />
              <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300">
                <Save size={14} />
              </button>
            </div>
          ) : (
            <div 
              className="text-sm font-medium cursor-pointer hover:bg-white/5 px-1 rounded flex items-center justify-between w-full"
              onClick={() => setIsEditing(true)}
            >
              <span>{data.marks}</span>
              {!data.submitted && <AlertCircle size={12} className="text-red-400" />}
            </div>
          )}
          
          <button 
            onClick={toggleSubmission}
            className={clsx(
              "transition-colors",
              data.submitted ? "text-emerald-500" : "text-white/20 hover:text-white/40"
            )}
          >
            {data.submitted ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>
        </div>
        <div className="text-[10px] uppercase text-white/40">
          {data.submitted ? "Submitted" : "Pending"}
        </div>
      </div>
    </div>
  );
};

const StudentTable = ({ students, refreshData }) => {
  const fields = [
    { key: 'mid1', label: 'Mid 1' },
    { key: 'mid2', label: 'Mid 2' },
    { key: 'assignment1', label: 'Asgn 1' },
    { key: 'assignment2', label: 'Asgn 2' },
    { key: 'ela1', label: 'ELA 1' },
    { key: 'ela2', label: 'ELA 2' },
    { key: 'cbp', label: 'CBP' },
  ];

  const handleUpdate = async (id, data) => {
    await updateStudent(id, data);
    refreshData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
      refreshData();
    }
  };

  return (
    <div className="glass-card overflow-hidden !p-0 border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-4 font-semibold text-white/60 text-sm sticky left-0 bg-surface/80 backdrop-blur-md z-10 w-48">Student Info</th>
              {fields.map(f => (
                <th key={f.key} className="p-4 font-semibold text-white/60 text-sm">{f.label}</th>
              ))}
              <th className="p-4 font-semibold text-white/60 text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 2} className="p-10 text-center text-white/40">
                  No students found. Add some to get started!
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 sticky left-0 bg-[#16161a] group-hover:bg-[#1a1a1f] transition-colors z-10 border-r border-white/5 shadow-[5px_0_15px_-5px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col">
                      <span className="font-bold text-white leading-tight">{student.name}</span>
                      <span className="text-xs text-blue-400 font-mono mt-1">{student.rollNumber}</span>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 uppercase">{student.year}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 uppercase">{student.branch} - {student.section}</span>
                      </div>
                    </div>
                  </td>
                  
                  {fields.map(f => (
                    <td key={f.key} className="p-0 align-top">
                      <AcademicCell 
                        studentId={student._id}
                        field={f.key}
                        data={student[f.key]}
                        onUpdate={handleUpdate}
                      />
                    </td>
                  ))}

                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="text-red-400/50 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
