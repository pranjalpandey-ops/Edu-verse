import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight, RotateCcw, BookOpen, Sparkles, Zap } from 'lucide-react';
import { quizAPI } from '../services/api';

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  const stateResult = location.state?.result;
  const [result, setResult] = useState(stateResult || {
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    timeTaken: 85,
    strongConcepts: ['System Conservation', 'Inverse Proportions'],
    weakConcepts: ['Boundary Limits'],
    feedbackList: [],
    recommendedRevision: 'Review boundary limits and initial condition assumptions.',
    recommendedNextLesson: 'Applied Systems & Problem Solving'
  });

  const topic = location.state?.topic || searchParams.get('topic') || 'Concept Mastery';

  const percentage = result.percentage || Math.round(((result.score || 0) / (result.totalQuestions || 1)) * 100);

  const getGradeBadge = (pct) => {
    if (pct >= 80) return { label: 'Mastery Achieved', color: 'bg-emerald-500 text-white', icon: Trophy };
    if (pct >= 60) return { label: 'Proficient', color: 'bg-blue-600 text-white', icon: CheckCircle2 };
    return { label: 'Needs Practice', color: 'bg-amber-500 text-white', icon: AlertTriangle };
  };

  const badge = getGradeBadge(percentage);
  const BadgeIcon = badge.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Quiz Evaluation Report</h1>
          <p className="text-xs md:text-sm text-blue-100">{topic}</p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 z-10">
          <div className="text-center">
            <span className="text-4xl md:text-5xl font-black">{percentage}%</span>
            <p className="text-[11px] uppercase tracking-wider text-blue-100 font-bold mt-0.5">Final Score</p>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 dark:text-white">{result.score || result.correctCount || 0}</span>
            <p className="text-[11px] text-slate-400 font-medium">Correct</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 dark:text-white">{(result.totalQuestions || 5) - (result.score || 0)}</span>
            <p className="text-[11px] text-slate-400 font-medium">Incorrect</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 dark:text-white">{result.timeTaken || 60}s</span>
            <p className="text-[11px] text-slate-400 font-medium">Time Taken</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 dark:text-white">+{result.score * 15 || 45}</span>
            <p className="text-[11px] text-slate-400 font-medium">Mastery XP</p>
          </div>
        </div>
      </div>

      {/* Strong vs Weak Concepts Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strong Concepts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strong Areas</span>
          </div>
          <div className="space-y-2">
            {(result.strongConcepts && result.strongConcepts.length > 0) ? (
              result.strongConcepts.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{typeof c === 'string' ? c : c.concept}</span>
                  <span className="font-mono text-emerald-600 font-bold">✓ Mastered</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Complete more modules to unlock strong areas.</p>
            )}
          </div>
        </div>

        {/* Weak Concepts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Needs Practice & Remediation</span>
          </div>
          <div className="space-y-2">
            {(result.weakConcepts && result.weakConcepts.length > 0) ? (
              result.weakConcepts.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{typeof c === 'string' ? c : c.concept}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">⚠️ Review</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500">
                🎉 No persistent weak concepts detected in this quiz!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>ARIA AI Learning Prescription</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {result.recommendedRevision || 'Continue practicing with adaptive difficulty to reinforce core mechanisms.'}
        </p>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => navigate(`/teacher?topic=${encodeURIComponent(topic)}`)}
          className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Practice Weak Area with AI Teacher</span>
        </button>

        <button
          onClick={() => navigate('/classroom/active')}
          className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review Lesson</span>
        </button>

        <button
          onClick={() => navigate('/create-quiz')}
          className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
        >
          <span>Try Another Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
