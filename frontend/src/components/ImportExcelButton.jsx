import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import { bulkCreateStudents } from '../api/studentApi';

const ImportExcelButton = ({ onRefresh }) => {
  const fileInputRef = useRef(null);

  const downloadTemplate = () => {
    const templateData = [
      { 
        'Name': 'John Doe', 
        'Roll Number': '22XX1A0501', 
        'Year': '1st Year', 
        'Branch': 'CSE', 
        'Section': 'A',
        'Mid 1': 20,
        'Mid 2': 18,
        'Assignment 1': 5,
        'Assignment 2': 5,
        'ELA 1': 10,
        'ELA 2': 9,
        'CBP': 15
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Student_Import_Template.xlsx');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        console.log('Parsed JSON from Excel:', json);

        if (json.length === 0) {
          alert('No data found in the file.');
          return;
        }

        const formattedData = json.map((item, index) => {
          const findVal = (possibleKeys, isMarks = false) => {
            const allKeys = Object.keys(item);
            
            // Priority search: keys that MATCH and are NOT status columns
            let foundKey = allKeys.find(k => {
              const lowerK = k.toLowerCase().trim();
              const isMatch = possibleKeys.some(pk => lowerK.includes(pk.toLowerCase()));
              const isStatus = lowerK.includes('status') || lowerK.includes('submitted');
              return isMatch && (isMarks ? !isStatus : true);
            });

            return foundKey !== undefined ? item[foundKey] : null;
          };

          const name = findVal(['name', 'student', 'full name']);
          const roll = findVal(['roll', 'id', 'htno', 'roll number']);

          if (!name || !roll) return null;

          // Helper to parse academic fields
          const getMarks = (keys) => {
            const val = findVal(keys, true); // Prioritize non-status columns
            const marks = (val !== null && val !== undefined && val !== '') ? Number(val) : 0;
            const hasValue = val !== null && val !== undefined && val.toString().trim() !== '';
            
            return {
              marks: isNaN(marks) ? 0 : marks,
              submitted: hasValue
            };
          };

          return {
            name: name.toString().trim(),
            rollNumber: roll.toString().trim().toUpperCase(),
            year: findVal(['year', 'yr', 'academic']) || '1st Year',
            branch: findVal(['branch', 'dept', 'department']) || 'CSE',
            section: (findVal(['section', 'sec', 'class']) || 'A').toString().trim().toUpperCase(),
            mid1: getMarks(['mid 1', 'mid1', 'm1', 'mid-1']),
            mid2: getMarks(['mid 2', 'mid2', 'm2', 'mid-2']),
            assignment1: getMarks(['assignment 1', 'asgn 1', 'a1', 'assignment1', 'asgn-1', 'asgn1']),
            assignment2: getMarks(['assignment 2', 'asgn 2', 'a2', 'assignment2', 'asgn-2', 'asgn2']),
            ela1: getMarks(['ela 1', 'ela1', 'e1', 'ela-1']),
            ela2: getMarks(['ela 2', 'ela2', 'e2', 'ela-2']),
            cbp: getMarks(['cbp', 'cp', 'cbp-marks'])
          };
        }).filter(s => s !== null);

        console.log('Formatted Students for Upload:', formattedData);

        if (formattedData.length === 0) {
          alert('No valid students found. Ensure you have "Name" and "Roll Number" columns.');
          return;
        }

        const res = await bulkCreateStudents(formattedData);
        console.log('Bulk Import Response:', res);
        
        let message = `Import Complete!\n`;
        if (res.upsertedCount > 0) message += `• ${res.upsertedCount} New Students added.\n`;
        if (res.modifiedCount > 0) message += `• ${res.modifiedCount} Existing Students updated.\n`;
        if (res.matchedCount > 0 && res.modifiedCount === 0) message += `• ${res.matchedCount} Students were already up to date.\n`;
        
        alert(message);
        onRefresh();
      } catch (error) {
        console.error('Import Error:', error);
        const errorMsg = error.response?.data?.message || error.message;
        alert(`Import Error: ${errorMsg}`);
      } finally {
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={downloadTemplate}
        className="p-2 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-all"
        title="Download Import Template"
      >
        <Download size={18} />
      </button>
      
      <div className="relative">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5 group"
        >
          <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-wider">Import Excel</span>
        </button>
      </div>
    </div>
  );
};

export default ImportExcelButton;
