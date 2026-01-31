
import React from 'react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
  isSaved?: boolean;
  isComparing?: boolean;
  onSave: (college: College) => void;
  onCompare: (college: College) => void;
  isDarkMode?: boolean;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, isSaved, isComparing, onSave, onCompare, isDarkMode }) => {
  const cardClass = isDarkMode ? 'glass-card-dark' : 'glass-card';
  
  return (
    <div className={`${cardClass} rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group overflow-hidden border border-white/20`}>
      {/* Header Section */}
      <div className="p-8 pb-4 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex flex-col gap-1 max-w-[70%]">
             <h3 className={`text-xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>{college.collegeName}</h3>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-[#A78BFA] uppercase">{college.course}</span>
             </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onSave(college); }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isSaved ? 'bg-[#A78BFA] text-white border-[#A78BFA] shadow-lg shadow-purple-500/40' : (isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white/50 border-white/40 text-slate-400 hover:text-[#1F2937] hover:bg-white')}`}
              title={isSaved ? "Saved" : "Save College"}
            >
              <i className={`fa-solid fa-bookmark ${isSaved ? 'scale-110' : ''}`}></i>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCompare(college); }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isComparing ? 'bg-[#FBCFE8] text-[#1F2937] border-[#FBCFE8] shadow-lg' : (isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white/50 border-white/40 text-slate-400 hover:text-[#1F2937] hover:bg-white')}`}
              title={isComparing ? "Comparing" : "Compare College"}
            >
              <i className={`fa-solid fa-layer-group ${isComparing ? 'rotate-12' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Global Partner Pill */}
        {college.foreignTieUps && college.foreignTieUps !== 'N/A' && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 text-[10px] font-bold ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-100 text-[#A78BFA]'}`}>
            <i className="fa-solid fa-earth-americas"></i>
            Global Partnership: {college.foreignTieUps}
          </div>
        )}

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
           <div className={`p-4 rounded-3xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-white/40 hover:bg-white/80'}`}>
              <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Fee</span>
              <span className={`text-lg font-black ${isDarkMode ? 'text-[#A78BFA]' : 'text-[#A78BFA]'}`}>{college.fees.total}</span>
           </div>
           <div className={`p-4 rounded-3xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white/40 border-white/40 hover:bg-white/80'}`}>
              <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Avg Package</span>
              <span className={`text-lg font-black ${isDarkMode ? 'text-[#86EFAC]' : 'text-[#86EFAC]'}`}>{college.placements.averagePackage}</span>
           </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-8 pt-0 space-y-6 flex-grow overflow-y-auto">
        {/* Admissions Detail */}
        <div className={`p-5 rounded-[1.5rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#FAF7F5] border-white/40'}`}>
           <h4 className={`text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
             <i className="fa-solid fa-graduation-cap text-[#A78BFA]"></i> Admissions
           </h4>
           <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Exam</span>
                <span className="font-bold">{college.admissions.entranceExam}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Window</span>
                <span className="font-bold">{college.admissions.admissionWindow}</span>
              </div>
           </div>
           
           <div className="mt-5 space-y-2">
             <div className={`grid grid-cols-3 text-[9px] font-black uppercase tracking-tighter text-slate-500 border-b pb-1 mb-1 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <span>Category</span>
                <span className="text-center">Opening</span>
                <span className="text-right">Closing</span>
             </div>
             {['GEN', 'OBC'].map(cat => (
               <div key={cat} className="grid grid-cols-3 text-[11px] font-medium items-center py-1">
                 <span className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{cat}</span>
                 <span className="text-center tabular-nums">{college.admissions.openingRanks[cat as keyof typeof college.admissions.openingRanks]}</span>
                 <span className="text-right tabular-nums font-black text-[#A78BFA]">{college.admissions.closingRanks[cat as keyof typeof college.admissions.closingRanks]}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Career Outcomes */}
        <div className="space-y-3">
          <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <i className="fa-solid fa-chart-line text-[#A78BFA]"></i> Outcomes
          </h4>
          <div className="flex flex-wrap gap-2">
            {college.careerOutcomes.slice(0, 3).map((outcome, i) => (
              <span key={i} className={`text-[9px] px-2.5 py-1 rounded-lg font-bold ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-[#FBCFE8]/20 text-[#FBCFE8]'}`}>
                {outcome}
              </span>
            ))}
          </div>
        </div>

        {/* notable alumni chips */}
        <div className="space-y-3">
           <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <i className="fa-solid fa-users-crown text-[#A78BFA]"></i> Alumni
          </h4>
          <div className="flex flex-wrap gap-2">
             {college.notableAlumni.map((alumni, i) => (
               <span key={i} className="text-[10px] font-bold text-[#A78BFA] hover:underline cursor-default">{alumni}</span>
             ))}
          </div>
        </div>

        {/* summary */}
        <p className={`text-[11px] leading-relaxed italic border-t pt-4 ${isDarkMode ? 'text-slate-500 border-white/5' : 'text-slate-400 border-slate-100'}`}>
          "{college.summary}"
        </p>
      </div>
    </div>
  );
};
