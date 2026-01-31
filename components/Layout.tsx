
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string } | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, isDarkMode, toggleTheme }) => {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-mesh-dark text-slate-100' : 'bg-mesh-light text-[#1F2937]'}`}>
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${isDarkMode ? 'bg-gray-900/60 backdrop-blur-xl border-white/10' : 'bg-white/60 backdrop-blur-xl border-white/40'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A78BFA] rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <i className="fa-solid fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] to-[#FBCFE8]">
                  EduGuideAI
                </h1>
                <p className={`text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Premium guidance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${isDarkMode ? 'bg-white/5 text-amber-300 border-white/10 hover:bg-white/10' : 'bg-white/50 text-slate-600 border-white/40 hover:bg-white/80'}`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              
              {user && (
                <>
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white/50 border-white/40 text-slate-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse"></div>
                    <span className="text-sm font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-bold text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-power-off"></i>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className={`py-12 mt-20 transition-all duration-300 border-t ${isDarkMode ? 'bg-gray-900/40 border-white/10 text-slate-500' : 'bg-white/40 border-white/40 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium">
          <p>&copy; 2024 EduGuideAI. Excellence in Indian Admissions.</p>
        </div>
      </footer>
    </div>
  );
};
