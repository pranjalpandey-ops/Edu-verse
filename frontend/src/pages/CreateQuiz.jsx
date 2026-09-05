import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Swords, Zap, HelpCircle, CheckCircle2, Clock, 
  ArrowLeft, ArrowRight, RefreshCw, Trophy, AlertTriangle, Lightbulb
} from 'lucide-react';
import { quizAPI } from '../services/api';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  const [topic, setTopic] = useState(initialTopic || 'Quantum Mechanics');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [mode, setMode] = useState('solo');
  const [loading, setLoading] = useState(false);

  // Active Quiz State (if playing solo)
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    if (mode === 'live') {
      try {
        setLoading(true);
        const res = await quizAPI.createLiveRoom({ topic, difficulty, questionCount });
        if (res.data.success) {
          navigate(`/live-quiz/${res.data.room.roomCode}`);
        }
      } catch (err) {
        console.error('Error creating live room:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Solo Quiz Generation
    setLoading(true);
    try {
      const res = await quizAPI.generate({ topic, difficulty, count: questionCount });
      if (res.data.success) {
        setActiveQuiz(res.data.quiz);
        setCurrentIdx(0);
        setSelectedOptions({});
        setQuizResult(null);
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optId) => {
    setSelectedOptions((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);

    const answersPayload = activeQuiz.questions.map((q) => {
      const chosen = selectedOptions[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: chosen,
        isCorrect: chosen === correctOpt?.id
      };
    });

    try {
      const res = await quizAPI.submit({
        quizId: activeQuiz.id || 'custom',
        topic: activeQuiz.topic,
        answers: answersPayload
      });
      if (res.data.success) {
        setQuizResult(res.data.result);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-4xl mx-auto space-y-8 transition-colors">
      {/* Back button */}
      <button
        onClick={() => navigate('/quiz')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quiz Hub</span>
      </button>

      {!activeQuiz ? (
        /* Configurator Card */
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-sm dark:shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI QUIZ GENERATOR</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Create Adaptive Quiz</h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Choose your topic, format, and play mode. EduVerse AI synthesizes conceptual questions with real-time misconception feedback.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Topic / Subject</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, Binary Search, Differential Equations..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500 shadow-xs"
              />
            </div>

            {/* Mode Select (Solo vs Live) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Play Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('solo')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                    mode === 'solo'
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-900 dark:text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Zap className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Solo Adaptive Drill</h4>
                    <p className="text-xs opacity-75">Instant active recall with AI misconception diagnosis</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('live')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                    mode === 'live'
                      ? 'bg-orange-50 dark:bg-blue-600/20 border-orange-500 dark:border-blue-500 text-orange-900 dark:text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Swords className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Live Multiplayer Battle</h4>
                    <p className="text-xs opacity-75">Create a real-time arena room for friends and classmates</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Difficulty & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                        difficulty === lvl
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Question Count</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                        questionCount === cnt
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'live' ? 'Create Live Arena Lobby' : 'Start Adaptive Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : !quizResult ? (
        /* Active Quiz Question Engine */
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-sm dark:shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 uppercase tracking-wider">{activeQuiz.topic}</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Question {currentIdx + 1} of {activeQuiz.questions.length}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                {activeQuiz.difficulty}
              </span>
            </div>
          </div>

          {/* Question Text */}
          {(() => {
            const q = activeQuiz.questions[currentIdx];
            return (
              <div className="space-y-6">
                <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {q.question}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOptions[q.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-600/30 border-blue-500 text-blue-900 dark:text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span><span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{opt.id}.</span>{opt.text}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-30 border border-slate-200 dark:border-slate-700"
                  >
                    Previous
                  </button>

                  {currentIdx < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled={submitting}
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition"
                    >
                      {submitting ? 'Evaluating with AI...' : 'Submit & Diagnose'}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Results & Misconception Remediation View */
        <div className="space-y-6">
          <div className="rounded-3xl p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl text-center space-y-4 shadow-sm dark:shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
              <Trophy className="w-8 h-8 text-blue-600 dark:text-cyan-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Completed!</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Mastery Status: <span className="text-blue-600 dark:text-cyan-400 font-bold">{quizResult.masteryLevel}</span></p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{quizResult.score} / {quizResult.totalQuestions}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">Percentage</span>
                <p className="text-lg font-bold text-blue-600 dark:text-cyan-300">{quizResult.percentage}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">Mastery Gain</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{quizResult.masteryGain} XP</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Create Another Quiz
              </button>
              <button
                onClick={() => navigate(`/create-lesson?topic=${encodeURIComponent(activeQuiz.topic)}`)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition border border-slate-200 dark:border-slate-700"
              >
                Study Topic with AI Teacher
              </button>
            </div>
          </div>

          {/* Misconception Diagnostic Breakdowns */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detailed Feedback & AI Remediation</h3>
            {quizResult.feedbackList?.map((fb, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border backdrop-blur-xl space-y-3 ${
                  fb.correct
                    ? 'bg-white dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-slate-900/60 border-amber-300 dark:border-amber-500/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  {fb.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  )}
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Question {idx + 1}: {fb.correct ? 'Correct' : 'Needs Concept Clarification'}
                  </h4>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">{fb.feedback}</p>

                {/* Remedial Analogy If Wrong */}
                {fb.remedialExplanation && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
                      <Lightbulb className="w-4 h-4" />
                      <span>{fb.remedialExplanation.title}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{fb.remedialExplanation.teacherSpeech}</p>
                    <div className="space-y-1 pt-1">
                      {fb.remedialExplanation.analogySteps?.map((step, sIdx) => (
                        <p key={sIdx} className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">{step}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
