import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, Video, Swords, Target, FolderOpen, RotateCcw, 
  Flame, Clock, Trophy, ArrowRight, Play, AlertTriangle, Compass, CheckCircle2, Zap,
  Calendar, Bell, BookOpen, Upload, ArrowUpRight
} from 'lucide-react';
import { progressAPI, studyPlanAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [progRes, examRes] = await Promise.all([
        progressAPI.get(),
        studyPlanAPI.getExamSchedule()
      ]);
      if (progRes.data?.success) {
        setData(progRes.data.dashboard);
      }
      if (examRes.data?.success) {
        setExamData(examRes.data);
      }
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const d = data || {
    greeting: "Welcome back, Pranjal",
    subtitle: "What would you like to master today with EduVerse AI?",
    todayGoal: { text: "60m", subText: "45m completed" },
    learningStreak: { days: 7, delta: "+2 from last week" },
    hoursLearned: { hours: 24.5, period: "This month" },
    overallProgress: { percentage: 88 }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 transition-colors pb-12">
      {/* Top Welcome & Search Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNIVERSAL AI LEARNING PLATFORM</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {d.greeting} 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            {d.subtitle}
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any topic (e.g. Lens Maker Formula, Nernst Equation, Differential Equations)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Learn Now</span>
            </button>
          </form>

          {/* Quick Concept Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Explore:</span>
            {['Ray Optics', 'Integration by Parts', 'Chemical Kinetics', 'Molecular Genetics', 'Newton Laws'].map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-600/20 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition text-xs shadow-xs cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => navigate('/revision')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-amber-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Class 9-12 Formulas</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">All subjects & derivations</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/study-plan')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Timetable & Schedule</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Upload & exam countdown</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/youtube')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-red-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">YouTube Learn</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Timestamped grounded Q&A</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/quiz')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-orange-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Quiz & Live Arena</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Battle multiplayer live</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/search')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Search & Learn</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Any subject AI overview</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/materials')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">Document RAG</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Upload PDF/DOCX/PPT</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">DAILY GOAL</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{d.todayGoal.text}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{d.todayGoal.subText}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">LEARNING STREAK</span>
            <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{d.learningStreak.days} Days</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{d.learningStreak.delta}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">TOTAL HOURS</span>
            <Trophy className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{d.hoursLearned.hours} hrs</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{d.hoursLearned.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">OVERALL MASTERY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{d.overallProgress.percentage}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 dark:bg-cyan-400 h-full rounded-full" style={{ width: `${d.overallProgress.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* UPCOMING EXAM & TEST SCHEDULE WIDGET */}
      <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                TEST RADAR
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upcoming Exam & Test Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active test countdowns, syllabus indicators, and targeted revision links.
            </p>
          </div>

          <button
            onClick={() => navigate('/study-plan')}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View Full Schedule & Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(examData?.exams || []).slice(0, 3).map((exam) => (
            <div
              key={exam.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 flex flex-col justify-between hover:border-blue-400 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300">
                    {exam.grade}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    ⏳ {exam.daysLeft} Days Left
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {exam.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  📅 {exam.date} • Target: <strong className="text-blue-600 dark:text-cyan-400">{exam.targetScore}</strong>
                </p>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Key Syllabus</span>
                  <div className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                    {exam.syllabus?.slice(0, 2).map((s, idx) => (
                      <div key={idx} className="line-clamp-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => navigate('/revision')}
                  className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Revise Formulas
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition cursor-pointer"
                >
                  Practice Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Classroom Card */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/40 dark:via-slate-900 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md dark:shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-300 dark:border-blue-400/30">
            ARIA AI TEACHER READY
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Enter the Dynamic AI Classroom</h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Experience human-like voice explanations, real-time multimodal SVG blackboards, and instant misconception remediation on any subject.
          </p>
        </div>
        <button
          onClick={() => navigate('/teacher')}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-500/30 shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch AI Classroom</span>
        </button>
      </div>
    </div>
  );
}
