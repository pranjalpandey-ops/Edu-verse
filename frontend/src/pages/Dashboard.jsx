import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, Video, Swords, Target, FolderOpen, RotateCcw, 
  Flame, Clock, Trophy, ArrowRight, Play, AlertTriangle, Compass, CheckCircle2, Zap,
  Calendar, Bell, BookOpen, Upload, ArrowUpRight, HelpCircle, Check, Loader2, Award, Brain
} from 'lucide-react';
import { 
  analyticsAPI, 
  recommendationsAPI, 
  dailyChallengeAPI, 
  studyPlanAPI, 
  revisionAPI, 
  videoLearningAPI,
  learningProfileAPI
} from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [selectedChallengeAnswer, setSelectedChallengeAnswer] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);
  const [submittingChallenge, setSubmittingChallenge] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [dueReviews, setDueReviews] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [
        analyticsRes, 
        recRes, 
        challengeRes, 
        planRes, 
        revRes, 
        historyRes,
        profileRes
      ] = await Promise.allSettled([
        analyticsAPI.get(),
        recommendationsAPI.get(),
        dailyChallengeAPI.getToday(),
        studyPlanAPI.get(),
        revisionAPI.getToday(),
        videoLearningAPI.getHistory(),
        learningProfileAPI.get()
      ]);

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.data?.analytics) {
        setAnalytics(analyticsRes.value.data.analytics);
      }
      if (recRes.status === 'fulfilled' && recRes.value.data?.recommendations) {
        setRecommendations(recRes.value.data.recommendations);
      }
      if (challengeRes.status === 'fulfilled' && challengeRes.value.data?.challenge) {
        setDailyChallenge(challengeRes.value.data.challenge);
      }
      if (planRes.status === 'fulfilled' && planRes.value.data?.plan) {
        setStudyPlan(planRes.value.data.plan);
      }
      if (revRes.status === 'fulfilled' && revRes.value.data?.items) {
        setDueReviews(revRes.value.data.items);
      }
      if (historyRes.status === 'fulfilled' && historyRes.value.data?.history) {
        setWatchHistory(historyRes.value.data.history);
      }
      if (profileRes.status === 'fulfilled' && profileRes.value.data?.profile) {
        setProfile(profileRes.value.data.profile);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubmitChallenge = async () => {
    if (!selectedChallengeAnswer || submittingChallenge) return;
    setSubmittingChallenge(true);
    try {
      const res = await dailyChallengeAPI.submit({ answer: selectedChallengeAnswer });
      if (res.data?.success && res.data.result) {
        setChallengeResult(res.data.result);
        const aRes = await analyticsAPI.get();
        if (aRes.data?.analytics) setAnalytics(aRes.data.analytics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingChallenge(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      if (studyPlanAPI.updateTask) {
        await studyPlanAPI.updateTask(taskId, { completed: !currentStatus });
      }
      setStudyPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: (prev.tasks || []).map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t)
        };
      });
    } catch (e) {
      console.error(e);
    }
  };

  const a = analytics || {
    totalStudyTimeMinutes: 0,
    lessonsCompleted: 0,
    quizzesCompleted: 0,
    averageQuizScore: 0,
    masteryAverage: 0,
    studyStreak: 1,
    strongestConcepts: [],
    weakestConcepts: [],
    insights: ['Welcome to EduVerse! Establish your baseline mastery with an introductory lesson or quiz.']
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 transition-colors pb-16">
      
      {/* Top Welcome & Search Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LEARNING INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hello, Learner 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            What would you like to master today with your personalized AI teacher?
          </p>

          {/* Universal Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any subject or concept (e.g. Binary Search, Photosynthesis, Equilibrium)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Learn Concept</span>
            </button>
          </form>

          {/* Quick Concept Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Explore:</span>
            {['Chemical Kinetics', 'Binary Trees', 'Newton Laws', 'Genetics', 'Thermodynamics'].map((t) => (
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

      {/* Real KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">STUDY TIME</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{a.totalStudyTimeMinutes} mins</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Total verified active time</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">ACTIVE STREAK</span>
            <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{a.studyStreak} Days</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Consistent retention</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">QUIZZES & LESSONS</span>
            <Trophy className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{a.quizzesCompleted + a.lessonsCompleted}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Accuracy: {a.averageQuizScore}%</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">CONCEPT MASTERY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{a.masteryAverage}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 dark:bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${a.masteryAverage}%` }} />
          </div>
        </div>
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recommendations, Daily Challenge, Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. AI Recommendation Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Recommended For You</h2>
                  <p className="text-xs text-slate-500">Grounded in your learning history and mastery gaps</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-slate-600 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                        {rec.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{rec.subtitle}</p>
                    <p className="text-[11px] text-slate-400 italic">💡 Reason: {rec.reason}</p>
                  </div>

                  <button
                    onClick={() => navigate(rec.actionUrl || '/teacher')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{rec.actionText || 'Start Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Daily AI Challenge */}
          {dailyChallenge && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Zap className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily AI Challenge</h2>
                    <p className="text-xs text-slate-500">Topic: {dailyChallenge.topic} • +50 Mastery XP</p>
                  </div>
                </div>
                {dailyChallenge.completed && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 space-y-3 shadow-xs">
                <p className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {dailyChallenge.question}
                </p>

                {/* Challenge Options */}
                {!dailyChallenge.completed && !challengeResult ? (
                  <div className="space-y-2 pt-1">
                    {dailyChallenge.options?.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedChallengeAnswer(opt.id)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center gap-3 cursor-pointer ${
                          selectedChallengeAnswer === opt.id
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-amber-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}

                    <button
                      onClick={handleSubmitChallenge}
                      disabled={!selectedChallengeAnswer || submittingChallenge}
                      className="mt-3 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submittingChallenge ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Evaluating Deduction...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5" />
                          <span>Submit Daily Deduction</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">
                      {challengeResult?.isCorrect || dailyChallenge.score > 0 ? '🎉 Excellent Deduction!' : '💡 Concept Review'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {challengeResult?.explanation || dailyChallenge.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Continue Learning / Watching */}
          {watchHistory && watchHistory.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-600">
                    <Video className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Continue Watching & Learning</h2>
                </div>
                <button
                  onClick={() => navigate('/youtube')}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchHistory.slice(0, 2).map((item) => (
                  <div
                    key={item.videoId}
                    onClick={() => navigate(`/youtube/${item.videoId}?topic=${encodeURIComponent(item.topic || '')}`)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3 hover:border-red-400 transition cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <Play className="w-5 h-5 text-red-600 fill-current" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title || item.topic}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{item.channelTitle || 'Educational Channel'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Today's Plan, Spaced Repetition Due, Weak Areas Radar */}
        <div className="space-y-6">
          
          {/* Today's Personalized Study Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Target className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Plan</h2>
              </div>
              <button
                onClick={() => navigate('/study-plan')}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                Full Plan
              </button>
            </div>

            <div className="space-y-2">
              {(studyPlan?.tasks || []).slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={Boolean(task.completed)}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                      className="w-4 h-4 rounded-md text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <div className="truncate">
                      <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.concept}
                      </span>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{task.activityType} • {task.estimatedMinutes}m</p>
                    </div>
                  </div>
                </div>
              ))}

              {(!studyPlan?.tasks || studyPlan.tasks.length === 0) && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                  <p className="text-xs text-slate-500">No active study plan generated yet.</p>
                  <button
                    onClick={() => navigate('/study-plan')}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Generate AI Plan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Spaced Repetition Due */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                  <RotateCcw className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Revision Due</h2>
                  <p className="text-xs text-slate-500">{dueReviews.length} SM-2 flashcard(s) due today</p>
                </div>
              </div>
            </div>

            {dueReviews.length > 0 ? (
              <div className="space-y-2">
                {dueReviews.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.concept}</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">Due Now</span>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/revision')}
                  className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Due Revision ({dueReviews.length})</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                🎉 All spaced reviews completed for today!
              </div>
            )}
          </div>

          {/* Weak Concepts Radar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500">
                <Brain className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Weak Concepts Radar</h2>
                <p className="text-xs text-slate-500">Automated diagnostic gap detection</p>
              </div>
            </div>

            <div className="space-y-2">
              {(a.weakestConcepts && a.weakestConcepts.length > 0) ? (
                a.weakestConcepts.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.concept}</span>
                      <p className="text-[10px] text-slate-400">{c.subject}</p>
                    </div>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{c.score}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No critical weak concepts detected yet.</p>
              )}
            </div>
          </div>

          {/* AI Learning Insights */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-cyan-400">
              DATA-DRIVEN INSIGHT
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {a.insights?.[0] || 'Maintain consistent daily reviews to cement long-term conceptual retention.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
