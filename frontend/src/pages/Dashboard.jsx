import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Flame, Clock, Globe, UploadCloud, Bot, Play, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import API from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/progress');
      if (res.data.success) {
        setData(res.data.dashboard);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const d = data || {
    greeting: "Good morning, Pranjal",
    subtitle: "Ready to master physics today?",
    todayGoal: { text: "60m", subText: "45m done" },
    learningStreak: { days: 12, delta: "+2 from last week" },
    hoursLearned: { hours: 24.5, period: "This month" },
    overallProgress: { percentage: 78 },
    continueLearning: {
      subject: "Physics",
      title: "Physics: Electricity",
      description: "Master the fundamentals of electric current, voltage, and resistance through interactive AI...",
      progress: 65,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80"
    },
    attentionNeeded: {
      concept: "Ohm's Law",
      description: "AI detected recurring struggles in recent quizzes regarding circuit resistance calculations."
    },
    weeklyActivity: [
      { day: "MON", hours: 2.1 },
      { day: "TUE", hours: 3.4 },
      { day: "WED", hours: 1.8 },
      { day: "THU", hours: 4.2, active: true },
      { day: "FRI", hours: 2.9 },
      { day: "SAT", hours: 3.8 },
      { day: "SUN", hours: 1.5 }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting & CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {d.greeting} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {d.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/create-lesson')}
            className="py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload Material</span>
          </button>
          <button 
            onClick={() => navigate('/teacher')}
            className="py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Start AI Lesson</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">TODAY'S GOAL</span>
            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-500">
              <Flag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{d.todayGoal.text}</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">{d.todayGoal.subText}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">LEARNING STREAK</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-500">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{d.learningStreak.days} Days</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <span>↗ {d.learningStreak.delta}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">HOURS LEARNED</span>
            <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-500">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{d.hoursLearned.hours}h</div>
            <div className="text-[11px] text-slate-400 font-medium mt-2">{d.hoursLearned.period}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">OVERALL PROGRESS</span>
            <div className="w-7 h-7 rounded-full bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center text-cyan-500">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{d.overallProgress.percentage}%</div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${d.overallProgress.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning vs Attention Needed */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Continue Learning</h2>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-full sm:w-44 h-28 rounded-2xl overflow-hidden shrink-0">
              <img 
                src={d.continueLearning.thumbnail} 
                alt={d.continueLearning.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase">
                {d.continueLearning.subject}
              </span>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{d.continueLearning.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {d.continueLearning.description}
              </p>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{d.continueLearning.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${d.continueLearning.progress}%` }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/teacher')}
                  className="py-2 px-4 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Resume</span>
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-base">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <h2>Attention Needed</h2>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-2 border-rose-500/20 dark:border-rose-500/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <span>{d.attentionNeeded.concept}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {d.attentionNeeded.description}
            </p>

            <button 
              onClick={() => navigate('/revision')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1 group"
            >
              <span>Start Quick Revision</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Activity vs Recommended for You */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Learning Activity</h2>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] font-bold text-slate-500">
              Last 7 Days
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-4">
            {d.weeklyActivity.map((act) => (
              <div key={act.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full max-w-[36px] rounded-t-xl transition-all ${act.active ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}
                  style={{ height: `${(act.hours / 5) * 120}px` }}
                ></div>
                <span className={`text-[10px] font-bold ${act.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                  {act.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Recommended for You</h2>
          <div className="space-y-3">
            <div 
              onClick={() => navigate('/create-lesson?topic=Advanced%20Circuits')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-all shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80" 
                  alt="Circuits" 
                  className="w-11 h-11 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">UP NEXT</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Advanced Circuits</h4>
                  <p className="text-[10px] text-slate-400">⏱ 45 mins</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>

            <div 
              onClick={() => navigate('/create-lesson?topic=Intro%20to%20Quantum%20Mechanics')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-all shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-blue-600 tracking-wider">NEW SUBJECT</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Intro to Quantum...</h4>
                  <p className="text-[10px] text-slate-400">✨ AI Curated</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
