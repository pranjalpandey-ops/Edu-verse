import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, AlertTriangle, ArrowRight, Play, Sparkles } from 'lucide-react';

const Revision = () => {
  const navigate = useNavigate();

  const weakAreas = [
    {
      concept: "Ohm's Law (V = IR)",
      severity: "High",
      reason: "AI detected recurring inverse proportionality inversion.",
      lastPracticed: "Today",
      duration: "10 mins"
    },
    {
      concept: "Circuit Resistance Calculations",
      severity: "Medium",
      reason: "Confusion between Series (R1+R2) and Parallel (1/R) combinations.",
      lastPracticed: "Yesterday",
      duration: "15 mins"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <RotateCcw className="w-7 h-7 text-indigo-600" />
          <span>Cognitive Revision Engine</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Targeted micro-sessions prioritized by detected misconceptions and memory retention curves.
        </p>
      </div>

      <div className="space-y-4">
        {weakAreas.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-rose-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-600 font-bold text-[10px] rounded-full uppercase">
                  {item.severity} Priority
                </span>
                <span className="text-xs text-slate-400">• ⏱ {item.duration}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.concept}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.reason}</p>
            </div>

            <button 
              onClick={() => navigate('/teacher')}
              className="py-2.5 px-5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Revision</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Revision;
