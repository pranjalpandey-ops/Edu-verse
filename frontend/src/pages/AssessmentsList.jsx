import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const AssessmentsList = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Assessments & Quizzes</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Review past evaluations and test concept mastery.</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-sm">82%</div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Physics: Electricity & Magnetism End-of-Module</h3>
            <p className="text-xs text-slate-400">Completed today • 4/5 questions correct</p>
          </div>
        </div>
        <button onClick={() => navigate('/report')} className="py-2 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl">View Report</button>
      </div>
    </div>
  );
};

export default AssessmentsList;
