import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UploadCloud, BookOpen, UserCheck, Globe, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const steps = [
    { num: 1, label: "UPLOAD" },
    { num: 2, label: "UNDERSTAND" },
    { num: 3, label: "PLAN" },
    { num: 4, label: "TEACH", active: true },
    { num: 5, label: "TEST" },
    { num: 6, label: "IMPROVE" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            EduVerse <span className="text-indigo-600">AI</span>
          </span>
        </div>

        <nav className="flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <button onClick={() => navigate('/login')} className="hover:text-indigo-600 transition-colors">Log In</button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="py-2 px-5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-full text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-12 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing ARIA: Your AI Tutor</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your Personal <span className="text-indigo-700 dark:text-indigo-400">AI Teacher</span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
            Learn anything through personalized, interactive AI-powered lessons. Upload your materials, and let EduVerse transform them into a custom learning journey.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="py-3 px-6 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/create-lesson')}
              className="py-3 px-6 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Material</span>
            </button>
          </div>
        </div>

        {/* Hero Graphic Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-2 group">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" 
            alt="AI Teacher Hologram" 
            className="w-full h-80 md:h-96 object-cover rounded-2xl filter brightness-90 group-hover:scale-[1.02] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="text-xs font-mono text-cyan-300">ARIA AI Engine v2.6</div>
            <div className="text-lg font-bold">Multimodal Adaptive Pedagogical Tutor</div>
          </div>
        </div>
      </section>

      {/* Teaching that adapts to you Section */}
      <section id="features" className="px-8 py-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Teaching that adapts to you
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Experience a new era of education, powered by advanced AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Learn from materials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload PDFs, docs, or web links. ARIA synthesizes them into structured courses instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Personalized lessons</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Content adjusts to your learning pace and preferred style in real-time.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI teacher avatar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Engage with ARIA visually and verbally for a human-like tutoring experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-16 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            From raw data to true understanding in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {steps.map((s) => (
            <div 
              key={s.num}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${s.active ? 'bg-indigo-700 text-white border-indigo-700 shadow-lg shadow-indigo-600/30 scale-105' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-extrabold ${s.active ? 'bg-white text-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                {s.num}
              </div>
              <div className="text-[11px] font-bold tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
        © 2026 EduVerse AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
