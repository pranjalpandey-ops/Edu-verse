import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Swords, Sparkles, PlusCircle, Users, ArrowRight, 
  Clock, Flame, HelpCircle, CheckCircle2, ChevronRight, Zap 
} from 'lucide-react';
import { quizAPI } from '../services/api';

export default function Quiz() {
  const navigate = useNavigate();
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [quickTopic, setQuickTopic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPublicQuizzes();
  }, []);

  const loadPublicQuizzes = async () => {
    try {
      const res = await quizAPI.getPublic();
      if (res.data.success) {
        setPublicQuizzes(res.data.quizzes);
      }
    } catch (err) {
      console.error('Error fetching public quizzes:', err);
    }
  };

  const handleStartQuickQuiz = (topic) => {
    const t = topic || quickTopic || 'Quantum Mechanics';
    navigate(`/create-quiz?topic=${encodeURIComponent(t)}`);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 transition-colors">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Trophy className="w-3.5 h-3.5" />
            <span>AI QUIZ & LIVE MULTIPLAYER ARENA</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Test Your Knowledge. <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Compete Live.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Generate AI-tailored adaptive mastery quizzes on any concept, battle classmates in real-time live multiplayer lobbies, and eliminate misconceptions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/create-quiz')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Custom Quiz</span>
            </button>
            <button
              onClick={() => navigate('/join-quiz')}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-sm transition flex items-center gap-2 shadow-xs"
            >
              <Swords className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Join Live Arena Battle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Quick Practice Bar */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Quick AI Knowledge Drill</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Generate a 5-question high-yield check in seconds</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-96">
          <input
            type="text"
            value={quickTopic}
            onChange={(e) => setQuickTopic(e.target.value)}
            placeholder="Enter any topic (e.g. DNA, Calculus)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500 shadow-xs"
          />
          <button
            onClick={() => handleStartQuickQuiz(quickTopic)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition shadow-xs"
          >
            Start Drill
          </button>
        </div>
      </div>

      {/* Public Arena Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            <span>Featured Public Arena Challenges</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Compete for high scores & mastery badges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {publicQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => handleStartQuickQuiz(quiz.topic)}
              className="group rounded-3xl p-5 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/40 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    {quiz.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{quiz.difficulty}</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{quiz.topic}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{quiz.questionCount} Questions</span>
                  <span>Avg: {quiz.avgScore}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <span>Launch Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
