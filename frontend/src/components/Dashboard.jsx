import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  Users, CheckCircle, AlertTriangle, TrendingUp, Award, 
  BookOpen, FileText, Cpu, CheckCircle2, Circle, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-card flex items-center justify-between">
    <div>
      <p className="text-white/40 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
      <Icon size={24} />
    </div>
  </div>
);

const DetailCard = ({ label, avg, subRate, icon: Icon }) => {
  const isHealthy = subRate >= 80;
  const isWarning = subRate < 80 && subRate >= 50;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card border-t-2 border-t-blue-500/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/5 text-blue-400">
          <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 
          isWarning ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {subRate}% SUBMITTED
        </div>
      </div>
      
      <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white">{avg}</span>
        <span className="text-white/20 text-xs font-medium">Avg Marks</span>
      </div>

      <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${subRate}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isHealthy ? 'bg-emerald-500' : 
            isWarning ? 'bg-yellow-500' : 'bg-red-500'
          }`}
        />
      </div>
    </motion.div>
  );
};

const Dashboard = ({ students }) => {
  const analytics = useMemo(() => {
    console.log('Dashboard Data Update - Students Count:', students.length);
    if (!students.length) return null;

    const fields = ['mid1', 'mid2', 'assignment1', 'assignment2', 'ela1', 'ela2', 'cbp'];
    const fieldLabels = {
      mid1: 'Mid 1', mid2: 'Mid 2', 
      assignment1: 'Assignment 1', assignment2: 'Assignment 2',
      ela1: 'ELA 1', ela2: 'ELA 2', cbp: 'CBP'
    };
    const fieldIcons = {
      mid1: FileText, mid2: FileText,
      assignment1: BookOpen, assignment2: BookOpen,
      ela1: Cpu, ela2: Cpu, cbp: CheckCircle2
    };

    // Calculate Detailed Metrics per Field
    const detailedMetrics = fields.map(field => {
      const sum = students.reduce((acc, s) => acc + (s[field]?.marks || 0), 0);
      const subCount = students.filter(s => s[field]?.submitted).length;
      return {
        key: field,
        label: fieldLabels[field],
        icon: fieldIcons[field],
        avg: Number((sum / students.length).toFixed(1)),
        subRate: Number(((subCount / students.length) * 100).toFixed(0))
      };
    });

    // Global Stats
    const performanceData = detailedMetrics.map(m => ({ name: m.label, avg: m.avg }));
    const totalPossibleSub = students.length * fields.length;
    const totalActualSub = detailedMetrics.reduce((acc, m) => acc + (m.subRate * students.length / 100), 0);
    const overallSubRate = ((totalActualSub / totalPossibleSub) * 100).toFixed(1);

    // At Risk
    const atRisk = students.filter(s => {
      const missingCount = fields.filter(f => !s[f]?.submitted).length;
      return missingCount > 3;
    });

    const COLORS = ['#10b981', '#ef4444'];
    const pieData = [
      { name: 'Submitted', value: totalActualSub },
      { name: 'Pending', value: totalPossibleSub - totalActualSub }
    ];

    return { detailedMetrics, performanceData, overallSubRate, pieData, COLORS, atRisk };
  }, [students]);

  const downloadPDF = async () => {
    const reportElement = document.getElementById('report-container');
    if (!reportElement) return;

    try {
      // Show loading toast or state if needed
      console.log('Generating PDF report...');
      
      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#09090b',
        scale: 2, // Balanced quality and performance
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Force styles for the PDF capture
          const element = clonedDoc.getElementById('report-container');
          if (element) {
            element.style.padding = '30px';
            element.style.background = '#09090b';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const dateStr = new Date().toLocaleDateString().replace(/\//g, '-');
      pdf.save(`Student_Analytics_Report_${dateStr}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please ensure charts are fully loaded.');
    }
  };

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40 glass-card">
        <Users size={48} className="mb-4 opacity-20" />
        <p>Not enough data to generate analytics. Please add students first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Top Header with Action - OUTSIDE the capture area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-500" size={24} />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Performance Analytics</h2>
        </div>
        <button 
          onClick={downloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
        >
          <Download size={16} />
          Download PDF Report
        </button>
      </div>

      <div id="report-container" className="space-y-8 p-4 bg-[#09090b] rounded-2xl">
        <div className="p-2 border-b border-white/5 mb-4">
          <h1 className="text-sm font-black text-white/20 uppercase tracking-widest">Academic Status Report • {new Date().toLocaleDateString()}</h1>
        </div>

      {/* Top Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} color="blue" />
        <StatCard title="Overall Submissions" value={`${analytics.overallSubRate}%`} icon={CheckCircle} color="emerald" />
        <StatCard title="Total At-Risk" value={analytics.atRisk.length} icon={AlertTriangle} color="red" />
        <StatCard title="Top Assessment" value={analytics.performanceData.sort((a,b)=>b.avg-a.avg)[0].name} icon={TrendingUp} color="purple" />
      </div>

      {/* COMMAND CENTER: Granular Assessment Metrics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="text-blue-500" size={20} />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Assessment Command Center</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.detailedMetrics.map(metric => {
            const { key, ...rest } = metric;
            return <DetailCard key={key} {...rest} />;
          })}
        </div>
      </section>

      {/* Assessment Specific Submission Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Award className="text-emerald-400" size={20} />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Submission Breakdown (Pie Charts)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.detailedMetrics.map(metric => {
            const pieData = [
              { name: 'Submitted', value: students.filter(s => s[metric.key]?.submitted).length },
              { name: 'Pending', value: students.length - students.filter(s => s[metric.key]?.submitted).length }
            ];
            
            return (
              <div key={metric.key} className="glass-card flex flex-col items-center justify-center p-4 min-h-[220px] h-[220px]">
                <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2">{metric.label}</h4>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111114', border: '1px solid #ffffff10', borderRadius: '8px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-white/60">{pieData[0].value} Done</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] text-white/60">{pieData[1].value} Pend</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Visual Trends - Bar Chart */}
        <motion.div className="glass-card space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={20} />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Average Marks Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#111114', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Risk Monitoring */}
      <div className="glass-card overflow-hidden !p-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} />
            <h3 className="text-lg font-bold uppercase tracking-wider text-sm">Priority Risk Monitoring</h3>
          </div>
          <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded-md font-black">ACTION REQUIRED</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.01]">
              <tr className="text-white/20 text-[10px] uppercase tracking-widest">
                <th className="p-4 pl-6">Student Identity</th>
                <th className="p-4">Compliance Status</th>
                <th className="p-4 text-right pr-6">Missing Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {analytics.atRisk.length > 0 ? analytics.atRisk.map(s => {
                const missing = ['mid1', 'mid2', 'assignment1', 'assignment2', 'ela1', 'ela2', 'cbp'].filter(f => !s[f]?.submitted).length;
                return (
                  <tr key={s._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{s.name}</span>
                        <span className="text-[10px] text-white/40 font-mono uppercase">{s.rollNumber} • {s.branch} {s.section}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {['mid1', 'mid2', 'asgn1', 'asgn2', 'ela1', 'ela2', 'cbp'].map((label, idx) => {
                          const field = ['mid1', 'mid2', 'assignment1', 'assignment2', 'ela1', 'ela2', 'cbp'][idx];
                          return (
                            <div 
                              key={label}
                              className={`w-1.5 h-4 rounded-sm ${s[field]?.submitted ? 'bg-emerald-500/40' : 'bg-red-500'}`}
                              title={label}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <span className="text-xl font-black text-red-400">{missing}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="3" className="p-20 text-center text-white/10 font-medium">No high-risk students identified. Participation is 100%.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
