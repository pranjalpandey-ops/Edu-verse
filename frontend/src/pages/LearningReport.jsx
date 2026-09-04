import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, AlertTriangle, BookOpen, Edit3, Bot, ArrowRight, Sparkles } from 'lucide-react';
import API from '../services/api';

const LearningReport = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get('/assessments/assessment_1/report');
      if (res.data.success && res.data.report) {
        setReport(res.data.report);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const r = report || {
    topic: "Physics: Electricity and Magnetism",
    overallScore: 82,
    conceptMastery: [
      { concept: "Current", score: 80 },
      { concept: "Voltage", score: 90 },
      { concept: "Resistance", score: 60 },
      { concept: "Ohm's Law", score: 50 }
    ],
    strongAreas: ["Current", "Voltage"],
    weakAreas: ["Resistance", "Ohm's Law"],
    aiFeedback: "You understand the fundamentals of Current and Voltage exceptionally well. Your test scores in these areas are consistently above 85%. However, there is a clear disconnect when applying these concepts together to understand Resistance and Ohm's Law. Let's focus on bridging that gap.",
    recommendations: [
      { title: "Review Ohm's Law", duration: "15 mins", description: "Interactive module on the V=IR relationship." },
      { title: "Practice 3 Problems", duration: "10 mins", description: "Targeted exercises on circuit resistance calculation." }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header matching Stitch screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Learning Report
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {r.topic}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/revision')}
            className="py-2.5 px-5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Revise Weak Areas
          </button>
          <button 
            onClick={() => navigate('/learning-path')}
            className="py-2.5 px-5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            Continue Learning
          </button>
        </div>
      </div>

      {/* Top Row: Overall Score Donut vs Concept Mastery Bars */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Overall Score Donut (4 cols) */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">Overall Score</h2>
          
          {/* Circular Donut Visual */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600"
                strokeDasharray="82, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{r.overallScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
            Great progress! You are on track to master this module.
          </p>
        </div>

        {/* Concept Mastery (8 cols) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">Concept Mastery</h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {r.conceptMastery.map((item) => {
              const isWeak = item.score <= 60;
              return (
                <div key={item.concept} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{item.concept}</span>
                    <span className={isWeak ? 'text-rose-600 font-extrabold' : 'text-slate-500'}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isWeak ? 'bg-rose-600' : 'bg-slate-400 dark:bg-slate-600'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Row: Strong Areas vs Needs Improvement vs AI Feedback */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Strong Areas & Needs Improvement (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Strong Areas */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-l-4 border-l-emerald-500 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Strong Areas</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Current</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Voltage</span>
              </div>
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border-l-4 border-l-rose-500 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Needs Improvement</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center gap-3 text-xs font-bold text-rose-800 dark:text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Resistance</span>
              </div>
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-center gap-3 text-xs font-bold text-rose-800 dark:text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Ohm's Law</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Feedback & Actionable Recommendations (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              <Bot className="w-5 h-5" />
              <span>AI Feedback</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {r.aiFeedback}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              ACTIONABLE RECOMMENDATIONS
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div 
                onClick={() => navigate('/teacher')}
                className="p-4 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-400 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-slate-700 rounded-md">15 mins</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">Review Ohm's Law</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Interactive module on the V=IR relationship.</p>
              </div>

              <div 
                onClick={() => navigate('/assessment')}
                className="p-4 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-400 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-slate-700 rounded-md">10 mins</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">Practice 3 Problems</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Targeted exercises on circuit resistance calculation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningReport;
