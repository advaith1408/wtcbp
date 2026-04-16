import React, { useState, useEffect } from 'react';
import { fetchStudents, createStudent } from './api/studentApi';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import ExportButton from './components/ExportButton';
import Dashboard from './components/Dashboard';
import { Plus, Search, Filter, GraduationCap, Users, LayoutDashboard, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ year: 'All', branch: 'All', section: 'All' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('records'); // 'records' or 'dashboard'

  const loadData = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading students:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = students;

    if (searchTerm) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.year !== 'All') result = result.filter(s => s.year === filters.year);
    if (filters.branch !== 'All') result = result.filter(s => s.branch === filters.branch);
    if (filters.section !== 'All') result = result.filter(s => s.section === filters.section);

    setFilteredStudents(result);
  }, [searchTerm, filters, students]);

  const handleAddStudent = async (newStudent) => {
    try {
      await createStudent(newStudent);
      loadData();
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-500">
            <GraduationCap size={32} />
            <h1 className="text-3xl font-black tracking-tight text-white">
              STUDENT<span className="text-white/40">TRACKER</span>
            </h1>
          </div>
          <p className="text-white/40 font-medium">Academic Performance & Submission Monitoring</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button 
              onClick={() => setView('records')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'records' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <List size={16} />
              Records
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
          </div>
          <div className="h-8 w-px bg-white/10 mx-1 hidden md:block"></div>
          <ExportButton students={filteredStudents} />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </header>

      {/* Controls Section - Persistent across views */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4"
      >
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            className="input-field w-full pl-10 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 lg:col-span-2">
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <select 
              className="input-field w-full pl-10 text-white bg-surface"
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div className="flex-1">
            <select 
              className="input-field w-full text-white bg-surface"
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white/40 animate-pulse">Initializing records...</p>
            </motion.div>
          ) : view === 'records' ? (
            <motion.div
              key="records-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4 text-white/60">
                <Users size={16} />
                <span className="text-sm font-medium">{filteredStudents.length} Students Found</span>
              </div>
              <StudentTable students={filteredStudents} refreshData={loadData} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard students={filteredStudents} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddStudent} 
      />

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-xs">
        &copy; 2026 Student Academic Management System • Built for Excellence
      </footer>
    </div>
  );
}

export default App;
