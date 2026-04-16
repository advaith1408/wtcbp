import React from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

const ExportButton = ({ students }) => {
  const exportToExcel = () => {
    const formattedData = students.map(student => ({
      'Name': student.name,
      'Roll Number': student.rollNumber,
      'Year': student.year,
      'Branch': student.branch,
      'Section': student.section,
      'Mid 1 Marks': student.mid1.marks,
      'Mid 1 Submitted': student.mid1.submitted ? 'Yes' : 'No',
      'Mid 2 Marks': student.mid2.marks,
      'Mid 2 Submitted': student.mid2.submitted ? 'Yes' : 'No',
      'Assignment 1 Marks': student.assignment1.marks,
      'Assignment 1 Submitted': student.assignment1.submitted ? 'Yes' : 'No',
      'Assignment 2 Marks': student.assignment2.marks,
      'Assignment 2 Submitted': student.assignment2.submitted ? 'Yes' : 'No',
      'ELA 1 Marks': student.ela1.marks,
      'ELA 1 Submitted': student.ela1.submitted ? 'Yes' : 'No',
      'ELA 2 Marks': student.ela2.marks,
      'ELA 2 Submitted': student.ela2.submitted ? 'Yes' : 'No',
      'CBP Marks': student.cbp.marks,
      'CBP Submitted': student.cbp.submitted ? 'Yes' : 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    // Auto-size columns
    const max_width = formattedData.reduce((w, r) => Math.max(w, r.Name.length), 10);
    worksheet['!cols'] = [{ wch: max_width + 5 }];

    XLSX.writeFile(workbook, `Student_Academic_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <button 
      onClick={exportToExcel}
      className="btn-secondary flex items-center gap-2"
      disabled={students.length === 0}
    >
      <Download size={18} />
      Export to Excel
    </button>
  );
};

export default ExportButton;
