
import React from 'react';
import { College } from '../types';

interface ComparisonModalProps {
  colleges: College[];
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ colleges, onClose, isDarkMode }) => {
  if (colleges.length === 0) return null;

  const features = [
    { label: 'Course', key: 'course' },
    { label: 'Total Fees', key: 'fees.total' },
    { label: 'Avg Placement', key: 'placements.averagePackage' },
    { label: 'Entrance Exam', key: 'admissions.entranceExam' },
    { label: 'Closing (GEN)', key: 'admissions.closingRanks.GEN' },
    { label: 'Notable Alumni', key: 'notableAlumni' },
    { label: 'Foreign Tie-ups', key: 'foreignTieUps' },
  ];

  const getValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const glassClass = isDarkMode ? 'glass-card-dark' : 'glass-card';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`${glassClass} w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all border border-white/20`}>
        <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-white/40 bg-white/40'}`}>
          <h2 className={`text-2xl font-black flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>
            <i className="fa-solid fa-layer-group text-[#A78BFA]"></i>
            College Matrix
          </h2>
          <button 
            onClick={onClose} 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto p-8 custom-scrollbar">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className={`p-6 rounded-2xl text-left text-xs font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-[#FAF7F5] text-slate-500'} min-w-[180px]`}>
                  Parameter
                </th>
                {colleges.map(c => (
                  <th key={c.id} className="p-6 rounded-2xl bg-[#A78BFA] text-white text-center min-w-[240px] shadow-lg shadow-purple-500/20">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Institute</div>
                    <div className="text-sm font-black leading-tight">{c.collegeName}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {features.map((feature, idx) => (
                <tr key={idx}>
                  <td className={`p-6 rounded-2xl font-black text-xs uppercase tracking-tight ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-[#FAF7F5] text-slate-700'}`}>
                    {feature.label}
                  </td>
                  {colleges.map(c => {
                    const val = getValue(c, feature.key);
                    return (
                      <td key={c.id} className={`p-6 rounded-2xl text-sm font-semibold text-center transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white border border-slate-50 text-slate-600 hover:shadow-xl'}`}>
                        {Array.isArray(val) ? val.join(', ') : (val || 'N/A')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={`p-6 border-t text-center ${isDarkMode ? 'border-white/5' : 'border-slate-100 bg-white/40'}`}>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Excellence in guidance powered by EduGuideAI
          </p>
        </div>
      </div>
    </div>
  );
};
