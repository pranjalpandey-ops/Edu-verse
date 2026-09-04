import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitFork, CheckCircle2, Lock, Play, Sparkles } from 'lucide-react';
import API from '../services/api';

const LearningPath = () => {
  const navigate = useNavigate();
  const [path, setPath] = useState(null);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      const res = await API.get('/learning-path/Physics');
      if (res.data.success) {
        setPath(res.data.learningPath);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const nodes = path?.nodes || [
    { id: "1", title: "1. Electrostatics & Charge", status: "completed", score: 95 },
    { id: "2", title: "2. Electric Current & Drift", status: "completed", score: 85 },
    { id: "3", title: "3. Voltage & Potential", status: "completed", score: 90 },
    { id: "4", title: "4. Ohm's Law & Resistance", status: "in_progress", score: 65, active: true },
    { id: "5", title: "5. Kirchhoff's Laws", status: "locked", score: 0 },
    { id: "6", title: "6. Magnetic Induction", status: "locked", score: 0 },
    { id: "7", title: "7. Alternating Current (AC)", status: "locked", score: 0 },
    { id: "8", title: "8. Semiconductor Physics", status: "locked", score: 0 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Adaptive Learning Path
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic curriculum mapped to your cognitive mastery. Unlocks as you master concepts.
          </p>
        </div>
        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">
          Subject: Physics
        </span>
      </div>

      <div className="space-y-4">
        {nodes.map((node, i) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in_progress';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              onClick={() => !isLocked && navigate('/teacher')}
              className={`p-5 rounded-3xl border transition-all flex items-center justify-between ${isInProgress ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md cursor-pointer' : isCompleted ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300' : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${isCompleted ? 'bg-emerald-50 text-emerald-600' : isInProgress ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-200 text-slate-400'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </div>

                <div>
                  <h3 className={`text-sm font-bold ${isInProgress ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isCompleted ? `Mastered (${node.score}%)` : isInProgress ? `Current Focus (${node.score}%)` : 'Prerequisites required'}
                  </p>
                </div>
              </div>

              {isInProgress && (
                <button className="py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md">
                  Resume Lesson
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
