import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const MultiSelect = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (option === 'All') {
      onChange(['All']);
    } else {
      let newSelected = selected.includes('All') ? [] : [...selected];
      if (newSelected.includes(option)) {
        newSelected = newSelected.filter(item => item !== option);
      } else {
        newSelected.push(option);
      }
      
      if (newSelected.length === 0) {
        onChange(['All']);
      } else {
        onChange(newSelected);
      }
    }
  };

  const displayText = selected.includes('All') 
    ? `All ${label}s` 
    : selected.length === 1 
      ? selected[0] 
      : `${selected.length} Selected`;

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full flex items-center justify-between text-white text-left"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full glass-card !p-2 border border-white/10 shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div
            onClick={() => toggleOption('All')}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selected.includes('All') ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
          >
            <span className="text-sm font-medium">All {label}s</span>
            {selected.includes('All') && <Check size={14} />}
          </div>
          <div className="h-px bg-white/5 my-1" />
          {options.map(option => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors mb-0.5 ${selected.includes(option) ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-white/60'}`}
            >
              <span className="text-sm font-medium">{option}</span>
              {selected.includes(option) && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
