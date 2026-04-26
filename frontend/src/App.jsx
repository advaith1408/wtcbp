import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { fetchStudents, createStudent } from './api/studentApi';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import ExportButton from './components/ExportButton';
import ImportExcelButton from './components/ImportExcelButton';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ResetPassword from './components/Auth/ResetPassword';
import { Plus, Search, Filter, GraduationCap, Users, LayoutDashboard, List, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MultiSelect from './components/MultiSelect';


const MainContent = ({ 
  user, students, filteredStudents, searchTerm, setSearchTerm, 
  filters, setFilters, view, setView, isModalOpen, setIsModalOpen, 
  loading, loadData, handleAddStudent, logout, navigate 
}) => {
  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-500">
            <GraduationCap size={32} />
            <h1 className="text-3xl font-black tracking-tight text-white">
              STUDENT<span className="text-white/40">TRACKER</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-white/40 font-medium">Academic Performance Monitoring</span>
            {user && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{user.name}</span>
              </div>
            )}
          </div>
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
          <ImportExcelButton onRefresh={loadData} />
          <ExportButton students={filteredStudents} />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Student
          </button>
          <button 
            onClick={() => { logout(); navigate('/signin'); }}
            className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Controls Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 no-print"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Search student..."
              className="input-field w-full pl-10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-3 flex flex-wrap gap-4">
            <MultiSelect 
              label="Branch"
              options={['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']}
              selected={filters.branches}
              onChange={(val) => setFilters({...filters, branches: val})}
            />
            <MultiSelect 
              label="Year"
              options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
              selected={filters.years}
              onChange={(val) => setFilters({...filters, years: val})}
            />
            <MultiSelect 
              label="Section"
              options={['A', 'B', 'C', 'D']}
              selected={filters.sections}
              onChange={(val) => setFilters({...filters, sections: val})}
            />
          </div>
        </div>

        {/* Assessment Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mr-2">
            <Filter size={14} />
            Assessment Filter:
          </div>
          <select 
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
            value={filters.assessment}
            onChange={(e) => setFilters({...filters, assessment: e.target.value})}
          >
            <option value="All">All Assessments</option>
            <option value="mid1">Mid 1</option>
            <option value="mid2">Mid 2</option>
            <option value="assignment1">Assignment 1</option>
            <option value="assignment2">Assignment 2</option>
            <option value="ela1">ELA 1</option>
            <option value="ela2">ELA 2</option>
            <option value="cbp">CBP</option>
          </select>

          <select 
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
          </select>

          {(filters.assessment !== 'All' || filters.status !== 'All' || !filters.branches.includes('All') || !filters.years.includes('All') || !filters.sections.includes('All')) && (
            <button 
              onClick={() => setFilters({ years: ['All'], branches: ['All'], sections: ['All'], assessment: 'All', status: 'All' })}
              className="text-[10px] uppercase font-black text-blue-400 hover:text-blue-300 transition-colors ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
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
      <footer className="text-center py-8 text-white/20 text-xs no-print">
        &copy; 2026 Student Academic Management System • Built for Excellence
      </footer>
    </div>
  );
};

function App() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    years: ['All'], 
    branches: ['All'], 
    sections: ['All'],
    assessment: 'All', 
    status: 'All'      
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('records'); 

  const loadData = async () => {
    if (!token) return;
    try {
      const data = await fetchStudents();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading students:", err);
      setLoading(false);
    }
  };

  const handleAddStudent = async (newStudent) => {
    try {
      await createStudent(newStudent);
      loadData();
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  useEffect(() => {
    if (user && token) {
      loadData();
    }
  }, [user, token]);

  const filteredStudents = useMemo(() => {
    let result = students;

    if (searchTerm) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (!filters.years.includes('All')) {
      result = result.filter(s => filters.years.includes(s.year));
    }
    
    if (!filters.branches.includes('All')) {
      result = result.filter(s => filters.branches.includes(s.branch));
    }

    if (!filters.sections.includes('All')) {
      result = result.filter(s => 
        filters.sections.includes(s.section?.toString().trim().toUpperCase())
      );
    }

    if (filters.assessment !== 'All' && filters.status !== 'All') {
      const isSubmitted = filters.status === 'Submitted';
      result = result.filter(s => s[filters.assessment]?.submitted === isSubmitted);
    }

    return result;
  }, [students, searchTerm, filters]);

  if (authLoading) return null;

  return (
    <Routes>
      <Route path="/signin" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/" 
        element={user ? (
          <MainContent 
            user={user}
            students={students}
            filteredStudents={filteredStudents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            view={view}
            setView={setView}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            loading={loading}
            loadData={loadData}
            handleAddStudent={handleAddStudent}
            logout={logout}
            navigate={navigate}
          />
        ) : <Navigate to="/signin" />} 
      />
    </Routes>
  );
}

export default App;
