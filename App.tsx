
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CollegeCard } from './components/CollegeCard';
import { ComparisonModal } from './components/ComparisonModal';
import { User, StudentDetails, GuidanceData, College } from './types';
import { fetchCollegeRecommendations } from './services/geminiService';

type ViewType = 'recommendations' | 'dashboard' | 'study-material' | 'book-a-counsellor';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edu_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<ViewType>('recommendations');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GuidanceData | null>(null);
  const [savedColleges, setSavedColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('edu_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [comparingColleges, setComparingColleges] = useState<College[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('edu_theme') === 'dark';
  });
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    academicMetric: '',
    preferredCourse: '',
    budgetCategory: 'A',
    preferredLocation: ''
  });

  useEffect(() => {
    localStorage.setItem('edu_saved', JSON.stringify(savedColleges));
  }, [savedColleges]);

  useEffect(() => {
    if (user) localStorage.setItem('edu_user', JSON.stringify(user));
    else localStorage.removeItem('edu_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('edu_theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'bg-mesh-dark' : 'bg-mesh-light';
  }, [isDarkMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName && loginEmail) {
      setUser({ name: loginName, email: loginEmail });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRecommendations(null);
    setSavedColleges([]);
    setComparingColleges([]);
    setView('recommendations');
    setError(null);
    localStorage.removeItem('edu_saved');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCollegeRecommendations(studentDetails);
      setRecommendations(data);
      setView('recommendations');
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (college: College) => {
    setSavedColleges(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) return prev.filter(c => c.id !== college.id);
      return [...prev, college];
    });
  };

  const toggleCompare = (college: College) => {
    setComparingColleges(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) return prev.filter(c => c.id !== college.id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 colleges at a time.");
        return prev;
      }
      return [...prev, college];
    });
  };

  const glassClass = isDarkMode ? 'glass-card-dark' : 'glass-card';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`max-w-md w-full rounded-[2.5rem] shadow-xl p-10 transition-all ${glassClass}`}>
          <div className="flex justify-end mb-4">
            <button onClick={toggleTheme} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-amber-300' : 'bg-white/50 border-white/40 text-slate-400'}`}>
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#A78BFA] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 mx-auto mb-6">
              <i className="fa-solid fa-graduation-cap text-4xl"></i>
            </div>
            <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>EduGuideAI</h2>
            <p className={`text-sm font-medium mt-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Premium Indian College Guidance</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-xs font-black uppercase tracking-widest px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your Name</label>
              <input
                required
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-medium ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#A78BFA]' : 'bg-white border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className={`text-xs font-black uppercase tracking-widest px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email</label>
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-medium ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-[#A78BFA]' : 'bg-white border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                placeholder="email@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#A78BFA] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#A78BFA]/90 transform transition-all shadow-xl shadow-purple-500/20 active:scale-95 mt-4"
            >
              Start Experience
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderEmptyState = (icon: string, title: string, description: string) => (
    <div className={`rounded-[3rem] p-20 text-center transition-all ${glassClass}`}>
      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-white text-[#FBCFE8]'}`}>
        <i className={`fa-solid ${icon} text-5xl`}></i>
      </div>
      <h3 className={`text-2xl font-black ${isDarkMode ? 'text-slate-200' : 'text-[#1F2937]'}`}>{title}</h3>
      <p className={`mt-4 mb-10 text-lg font-medium max-w-md mx-auto ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{description}</p>
      <button 
        onClick={() => setView('recommendations')}
        className="bg-[#A78BFA] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-purple-500/20 hover:bg-[#A78BFA]/90 transition-all active:scale-95"
      >
        Explore Recommendations
      </button>
    </div>
  );

  return (
    <Layout user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-14 overflow-x-auto pb-4 sm:pb-0">
          <div className={`p-1.5 rounded-[1.75rem] shadow-sm border inline-flex items-center gap-1 whitespace-nowrap transition-all ${isDarkMode ? 'bg-gray-900/60 border-white/10' : 'bg-white border-slate-100'}`}>
            {[
              { id: 'recommendations', label: 'Recommendations', icon: 'fa-wand-magic-sparkles' },
              { id: 'dashboard', label: 'Shortlist', icon: 'fa-bookmark', count: savedColleges.length },
              { id: 'study-material', label: 'Preparation', icon: 'fa-book-open-reader' },
              { id: 'book-a-counsellor', label: 'Expert Help', icon: 'fa-user-tie' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setView(tab.id as ViewType)}
                className={`px-6 py-3.5 rounded-[1.25rem] text-sm font-black transition-all flex items-center gap-3 ${view === tab.id ? 'bg-[#A78BFA] text-white shadow-lg shadow-purple-500/30' : 'text-slate-500 hover:bg-[#FBCFE8]/10'}`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && <span className="bg-white/20 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* View Content */}
        {view === 'recommendations' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <section className={`rounded-[2.5rem] shadow-sm p-10 mb-12 overflow-hidden relative transition-all ${glassClass}`}>
              <div className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-10 blur-[100px] ${isDarkMode ? 'bg-purple-400' : 'bg-purple-300'}`}></div>
              <div className="relative z-10">
                <h2 className={`text-2xl font-black mb-8 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>
                  <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center">
                    <i className="fa-solid fa-fingerprint text-[#A78BFA]"></i>
                  </div>
                  Personalized Profile
                </h2>
                <form onSubmit={handleGetRecommendations} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Academic Metric
                      </label>
                      <input
                        required
                        type="text"
                        value={studentDetails.academicMetric}
                        onChange={(e) => setStudentDetails({ ...studentDetails, academicMetric: e.target.value })}
                        placeholder="e.g. 96% Board or AIR 12500"
                        className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all font-semibold ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-[#A78BFA]' : 'bg-white/50 border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Target Course</label>
                      <input
                        required
                        type="text"
                        value={studentDetails.preferredCourse}
                        onChange={(e) => setStudentDetails({ ...studentDetails, preferredCourse: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science"
                        className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all font-semibold ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-[#A78BFA]' : 'bg-white/50 border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Annual Budget</label>
                      <select
                        value={studentDetails.budgetCategory}
                        onChange={(e) => setStudentDetails({ ...studentDetails, budgetCategory: e.target.value as any })}
                        className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all font-black ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-[#A78BFA]' : 'bg-white/50 border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                      >
                        <option value="A">Less than ₹4 Lakhs</option>
                        <option value="B">₹4–8 Lakhs</option>
                        <option value="C">₹8–12 Lakhs</option>
                        <option value="D">₹12–20 Lakhs</option>
                        <option value="E">Above ₹20 Lakhs</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Preferred Location</label>
                      <input
                        required
                        type="text"
                        value={studentDetails.preferredLocation}
                        onChange={(e) => setStudentDetails({ ...studentDetails, preferredLocation: e.target.value })}
                        placeholder="e.g. Bangalore or NCR"
                        className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all font-semibold ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:border-[#A78BFA]' : 'bg-white/50 border-slate-200 text-[#1F2937] focus:border-[#A78BFA]'}`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      disabled={loading}
                      type="submit"
                      className="bg-[#A78BFA] text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-[#A78BFA]/90 flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-purple-500/20 active:scale-95"
                    >
                      {loading ? (
                        <><i className="fa-solid fa-compass animate-spin"></i> Analyzing Indian Colleges...</>
                      ) : (
                        <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Recommendations</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {recommendations && (
              <div id="results-section" className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                  <div>
                    <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>AI Selection</h2>
                    <p className={`text-lg font-medium mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Discover your top 5 matching institutions.</p>
                  </div>
                  {comparingColleges.length > 0 && (
                    <button 
                      onClick={() => setShowComparison(true)}
                      className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl"
                    >
                      <i className="fa-solid fa-layer-group"></i>
                      Compare {comparingColleges.length} Items
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                  {recommendations.recommendations.map((college) => (
                    <CollegeCard 
                      key={college.id} 
                      college={college} 
                      onSave={toggleSave}
                      onCompare={toggleCompare}
                      isSaved={savedColleges.some(c => c.id === college.id)}
                      isComparing={comparingColleges.some(c => c.id === college.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <h2 className={`text-4xl font-black mb-12 tracking-tight px-4 ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>Your Shortlist</h2>
            {savedColleges.length === 0 ? (
              renderEmptyState('fa-bookmark', 'Nothing Saved Yet', 'Explore recommendations and save your dream colleges to see them here.')
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {savedColleges.map((college) => (
                  <CollegeCard 
                    key={college.id} 
                    college={college} 
                    onSave={toggleSave}
                    onCompare={toggleCompare}
                    isSaved={true}
                    isComparing={comparingColleges.some(c => c.id === college.id)}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Study Material View */}
        {view === 'study-material' && (
          <div className="animate-in fade-in duration-500 px-4">
            <h2 className={`text-4xl font-black mb-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>Preparation Plan</h2>
            {!recommendations ? (
              renderEmptyState('fa-book-open-reader', 'Step-by-Step Guide', 'Generate recommendations first to get a tailored study roadmap.')
            ) : (
              <div className={`rounded-[3rem] p-12 shadow-sm transition-all ${glassClass}`}>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-20 h-20 bg-[#A78BFA] rounded-[1.75rem] flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                    <i className="fa-solid fa-pen-nib text-3xl"></i>
                  </div>
                  <div>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>{recommendations.studyPlan.examName} Strategy</h3>
                    <p className="text-[#A78BFA] font-black text-xs uppercase tracking-[0.3em] mt-1">Excellence roadmap</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 pb-4 border-b ${isDarkMode ? 'text-slate-300 border-white/5' : 'text-slate-800 border-slate-100'}`}>The Roadmap</h4>
                    <ul className="space-y-6">
                      {recommendations.studyPlan.roadmap.map((step, i) => (
                        <li key={i} className="flex gap-4 group">
                          <span className="w-8 h-8 rounded-xl bg-[#A78BFA]/10 text-[#A78BFA] flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-[#A78BFA] group-hover:text-white transition-all">{i+1}</span>
                          <span className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 pb-4 border-b ${isDarkMode ? 'text-slate-300 border-white/5' : 'text-slate-800 border-slate-100'}`}>Insights</h4>
                    <div className="space-y-4">
                      {recommendations.studyPlan.tips.map((tip, i) => (
                        <div key={i} className={`p-5 rounded-2xl text-sm leading-relaxed border flex gap-4 transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10' : 'bg-[#FAF7F5] border-slate-100 text-slate-600 hover:shadow-lg'}`}>
                          <i className="fa-solid fa-sparkles text-[#FBCFE8] mt-1"></i>
                          <span className="font-medium">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 pb-4 border-b ${isDarkMode ? 'text-slate-300 border-white/5' : 'text-slate-800 border-slate-100'}`}>Resources</h4>
                    <div className="space-y-3">
                       {recommendations.studyPlan.recommendedResources.map((res, i) => (
                         <a key={i} href={res.link} target="_blank" className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-300 hover:bg-[#A78BFA] hover:text-white' : 'bg-white border-slate-100 text-[#1F2937] hover:border-[#A78BFA] hover:shadow-xl'}`}>
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-[#FBCFE8]/10 flex items-center justify-center text-[#FBCFE8]">
                                  <i className={`fa-solid ${res.type === 'Book' ? 'fa-book' : res.type === 'Video' ? 'fa-play' : 'fa-link'}`}></i>
                               </div>
                               <div>
                                  <p className="font-black text-sm">{res.title}</p>
                                  <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">{res.type}</p>
                               </div>
                            </div>
                            <i className="fa-solid fa-arrow-up-right text-xs opacity-40"></i>
                         </a>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expert Consultation View */}
        {view === 'book-a-counsellor' && (
          <div className="animate-in fade-in duration-500 px-4">
             <h2 className={`text-4xl font-black mb-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>Expert Consultation</h2>
             {!recommendations ? (
              renderEmptyState('fa-user-tie', 'Human-in-the-loop', 'Match with a regional expert after reviewing your college recommendations.')
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className={`lg:col-span-2 rounded-[3rem] p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-12 items-center md:items-start transition-all ${glassClass}`}>
                  <div className={`w-48 h-48 rounded-[2.5rem] flex items-center justify-center border transition-all shrink-0 ${isDarkMode ? 'bg-white/5 border-white/10 text-[#A78BFA]' : 'bg-[#FAF7F5] border-white/40 text-[#A78BFA]'}`}>
                    <i className="fa-solid fa-user-tie text-7xl"></i>
                  </div>
                  <div className="flex-grow space-y-8 text-center md:text-left">
                    <div>
                      <h3 className={`text-5xl font-black ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>{recommendations.careerCounsellor.name}</h3>
                      <p className="text-[#A78BFA] font-black text-xl mt-2 tracking-tight">{recommendations.careerCounsellor.specialization}</p>
                    </div>
                    <p className={`leading-relaxed text-xl italic font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      "{recommendations.careerCounsellor.note}"
                    </p>
                    <div className="pt-6">
                      <a
                        href={recommendations.careerCounsellor.bookingLink}
                        target="_blank"
                        className="inline-flex items-center gap-4 bg-[#A78BFA] text-white px-14 py-6 rounded-2xl font-black text-xl hover:bg-[#A78BFA]/90 transition-all shadow-xl shadow-purple-500/30 active:scale-95"
                      >
                        <i className="fa-solid fa-calendar-check"></i>
                        Confirm Free Slot
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                   <div className={`rounded-[2.5rem] p-10 border transition-all ${glassClass}`}>
                      <h4 className={`text-xs font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                        <i className="fa-solid fa-list-check text-[#A78BFA]"></i>
                        Next Steps
                      </h4>
                      <ul className="space-y-6">
                        {recommendations.studentNextSteps.map((step, i) => (
                          <li key={i} className={`text-sm flex gap-4 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="text-[#A78BFA] font-black">{i+1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div className="bg-gradient-to-br from-[#A78BFA] to-[#FBCFE8] rounded-[2.5rem] p-10 text-white shadow-xl shadow-purple-500/20">
                      <p className="font-black text-lg mb-4">Did you know?</p>
                      <p className="text-sm opacity-90 leading-relaxed font-medium">Students who consult experts improve their scholarship conversion rates by nearly 40%.</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showComparison && (
          <ComparisonModal 
            colleges={comparingColleges} 
            onClose={() => setShowComparison(false)} 
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
