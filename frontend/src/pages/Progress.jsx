import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Dna, Award, Clock, CheckCircle2, AlertTriangle, 
  Layers, Sparkles, Flame, Target, BookOpen, Brain 
} from 'lucide-react';
import { progressAPI } from '../services/api';

export default function Progress() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await progressAPI.get();
      if (res.data.success) {
        setProgressData(res.data.progress);
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 transition-colors">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Brain className="w-3.5 h-3.5" />
            <span>LEARNING DNA & MASTERY ANALYTICS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your Adaptive <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Cognitive DNA</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Track real-time conceptual mastery, retention velocity, resolved misconceptions, and cognitive strengths across all subjects.
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold">Overall Concept Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">88.4%</p>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+12% this week</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold">Total Study Hours</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">42.5 hrs</p>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">18 lessons completed</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold">Active Recall Retention</span>
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">94.2%</p>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">SuperMemo-2 Spaced Pacing</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold">Misconceptions Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">14 of 15</p>
          <div className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">93% remediation rate</div>
        </div>
      </div>

      {/* Domain Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Bars */}
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Domain Mastery Index</span>
          </h3>

          <div className="space-y-4">
            {[
              { domain: 'Physics & Engineering', score: 92, color: 'from-blue-500 to-cyan-400' },
              { domain: 'Computer Science & Algorithms', score: 86, color: 'from-cyan-500 to-teal-400' },
              { domain: 'Mathematics & Calculus', score: 81, color: 'from-indigo-500 to-purple-400' },
              { domain: 'Biology & Genetics', score: 95, color: 'from-emerald-500 to-green-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-200">{item.domain}</span>
                  <span className="text-blue-600 dark:text-cyan-300 font-mono font-bold">{item.score}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Strengths & Learning Style */}
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Dna className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Cognitive Profile & Learning Preferences</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Primary Modality</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Visual & Analogy First</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">High affinity for visual flowcharts and interactive diagrams</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Optimal Session Pacing</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">20 - 25 Minutes</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Maintains 95% retention in focused bursts</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Problem Solving Style</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">First-Principles Logic</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Excels at isolating boundary rules before calculating</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Remediation Speed</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Instant (1 Iteration)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Misconceptions resolved upon first analogy review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
