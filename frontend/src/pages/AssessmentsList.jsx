import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Sparkles, HelpCircle, CheckCircle2, ArrowRight, 
  Play, Users, Zap, Clock, BookOpen, Flame, Plus, Target
} from 'lucide-react';
import { quizAPI } from '../services/api';

const SAMPLE_CHALLENGES = [
  {
    id: 'quiz_pub_1',
    title: 'Quantum Mechanics & Wave Functions',
    topic: 'Quantum Physics',
    subject: 'Physics',
    difficulty: 'Hard',
    questionCount: 5,
    playCount: 1420,
    avgScore: '74%',
    badge: 'Trending Challenge',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'quiz_pub_2',
    title: 'Cellular Respiration & Krebs Cycle',
    topic: 'Cell Biology',
    subject: 'Biology',
    difficulty: 'Medium',
    questionCount: 5,
    playCount: 2890,
    avgScore: '82%',
    badge: 'Popular',
    gradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'quiz_pub_3',
    title: 'Binary Search Trees & Graph Traversal',
    topic: 'Data Structures',
    subject: 'Computer Science',
    difficulty: 'Medium',
    questionCount: 5,
    playCount: 3100,
    avgScore: '79%',
    badge: 'Editor Choice',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'quiz_pub_4',
    title: 'Differential Calculus & Optimization',
    topic: 'Calculus',
    subject: 'Mathematics',
    difficulty: 'Hard',
    questionCount: 5,
    playCount: 1980,
    avgScore: '68%',
    badge: 'Brain Buster',
    gradient: 'from-amber-600 to-rose-600'
  },
  {
    id: 'quiz_pub_5',
    title: 'Electrochemistry & Nernst Potential',
    topic: 'Electrochemistry',
    subject: 'Chemistry',
    difficulty: 'Medium',
    questionCount: 5,
    playCount: 2150,
    avgScore: '76%',
    badge: 'Exam Prep',
    gradient: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'quiz_pub_6',
    title: 'Wave Optics & Interference Fringes',
    topic: 'Wave Optics',
    subject: 'Physics',
    difficulty: 'Medium',
    questionCount: 5,
    playCount: 2430,
    avgScore: '81%',
    badge: 'Board Mastery',
    gradient: 'from-indigo-600 to-violet-600'
  }
];

export default function AssessmentsList() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await quizAPI.getAttempts();
      if (res.data?.success && res.data.attempts) {
        setAttempts(res.data.attempts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartQuiz = (topic) => {
    navigate(`/quiz?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-purple-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>DIAGNOSTIC ASSESSMENTS & REAL-TIME CHALLENGES</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Assessments, Quizzes & <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">Live Battles</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Test concept mastery with adaptive AI questions, play featured challenges, or join multiplayer competitive arenas.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/create-quiz')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Quiz</span>
            </button>
            <button
              onClick={() => navigate('/join-quiz')}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-500" />
              <span>Join Live Quiz Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Sample Quizzes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Featured Sample Challenges</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Instant AI Diagnostic Evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_CHALLENGES.map((challenge, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                    {challenge.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase">
                    {challenge.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white line-clamp-1">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Topic: {challenge.topic} • {challenge.subject}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{challenge.questionCount} Questions (~5m)</span>
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Avg: {challenge.avgScore}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {challenge.playCount.toLocaleString()} attempts
                </span>
                <button
                  onClick={() => handleStartQuiz(challenge.topic)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Challenge</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Quiz Attempts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Quiz Attempts</h2>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No past quiz attempts found.</p>
            <p className="text-xs text-slate-500">Pick any sample challenge above to test your skills!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((att, idx) => (
              <div
                key={att._id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${
                    att.percentage >= 75 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                  }`}>
                    {att.percentage}%
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {att.topic} Mastery Quiz
                    </h3>
                    <p className="text-xs text-slate-400">
                      Score: {att.score}/{att.totalQuestions} • Time: {att.timeTaken || 45}s • {new Date(att.completedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartQuiz(att.topic)}
                    className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => navigate('/report')}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    View Mastery Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
