import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle2, Play } from 'lucide-react';
import API from '../services/api';

const LessonPlan = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const res = await API.get('/lessons/lesson_physics_electricity');
      if (res.data.success && res.data.lesson) {
        setLesson(res.data.lesson);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const l = lesson || {
    title: "Physics: Electricity & Ohm's Law",
    duration: 20,
    language: "English",
    objectives: [
      "Understand Electric Current (I) and Charge Flow",
      "Master Voltage (V) as Electric Potential Difference",
      "Apply Ohm's Law (V = IR) and Resistance (R)",
      "Solve Practical Circuit Problems"
    ],
    sections: [
      {
        title: "Electric Current & Charge Flow",
        duration: 5,
        explanationStyle: "visual",
        example: "A typical lamp draws 0.5A (3 billion billion electrons/sec)."
      },
      {
        title: "Voltage & Potential Difference",
        duration: 5,
        explanationStyle: "analogy",
        example: "Voltage is like water pump pressure pushing electrons."
      },
      {
        title: "Ohm's Law & Circuit Resistance",
        duration: 6,
        explanationStyle: "diagram",
        example: "Increasing resistance reduces current for a constant voltage supply."
      },
      {
        title: "Practical Circuit Problem Solving",
        duration: 4,
        explanationStyle: "practice",
        example: "Given 24V supply and 8Ω resistance, current I = 3A."
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-indigo-200">
            AI-GENERATED CURRICULUM
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{l.title}</h1>
          <div className="flex items-center gap-4 text-xs text-indigo-200 pt-1">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {l.duration} Minutes</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {l.sections.length} Sections</span>
            <span>•</span>
            <span>Language: {l.language}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/teacher')}
          className="py-3.5 px-6 bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start AI Teacher</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
          Target Learning Objectives
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {l.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Structured Lesson Sections</h3>
        <div className="space-y-3">
          {l.sections.map((sec, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-extrabold text-sm text-indigo-700 dark:text-indigo-300">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sec.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sec.example}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-slate-400">⏱ {sec.duration}m</span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                  {sec.explanationStyle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPlan;
