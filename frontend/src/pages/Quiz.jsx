import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, AlertTriangle, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { quizAPI } from '../services/api';

const Quiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryQuizId = searchParams.get('id');
  const queryTopic = searchParams.get('topic') || 'Binary Search';

  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: answer }
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [queryQuizId, queryTopic]);

  // Quiz Timer
  useEffect(() => {
    if (timeLeft <= 0 && !submitting && quiz) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitting, quiz]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      if (queryQuizId) {
        const res = await quizAPI.getById(queryQuizId);
        if (res.data?.success && res.data.quiz) {
          setQuiz(res.data.quiz);
          setTimeLeft(res.data.quiz.timeLimit || 180);
          return;
        }
      }

      // Generate dynamic quiz
      const res = await quizAPI.generate({ topic: queryTopic, questionCount: 5 });
      if (res.data?.success && res.data.quiz) {
        setQuiz(res.data.quiz);
        setTimeLeft(res.data.quiz.timeLimit || 180);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleTextAnswer = (questionId, text) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  const handleSubmit = async () => {
    if (submitting || !quiz) return;
    setSubmitting(true);

    const formattedAnswers = (quiz.questions || []).map(q => ({
      questionId: q.id,
      answer: selectedAnswers[q.id] || 'A'
    }));

    const totalSeconds = (quiz.timeLimit || 180) - timeLeft;

    try {
      const res = await quizAPI.submit(quiz.id || quiz._id, {
        answers: formattedAnswers,
        timeTaken: Math.max(10, totalSeconds),
        topic: quiz.topic
      });

      if (res.data?.success && res.data.result) {
        navigate('/quiz/result', {
          state: {
            result: res.data.result,
            topic: quiz.topic
          }
        });
      } else {
        navigate('/quiz/result', { state: { topic: quiz.topic } });
      }
    } catch (err) {
      console.error(err);
      navigate('/quiz/result', { state: { topic: quiz.topic } });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold">Structuring Diagnostic Quiz Questions with Gemini AI...</p>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const currentQ = questions[currentQIndex] || {};
  const progressPercent = Math.round(((currentQIndex + 1) / Math.max(1, questions.length)) * 100);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100 pb-12">
      {/* Top Header Row with Timer & Progress */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            {quiz?.topic || 'STEM Mastery'}
          </span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Question {currentQIndex + 1} of {questions.length}
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
          <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-rose-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`} />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
              {currentQ.concept}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase">
              {currentQ.difficulty || 'Medium'}
            </span>
          </div>

          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options / Answer Input */}
        {currentQ.type === 'short_answer' ? (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500">
              Type your explanation or calculation:
            </label>
            <textarea
              rows={4}
              value={selectedAnswers[currentQ.id] || ''}
              onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
              placeholder="Explain the core mechanism step-by-step..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs leading-relaxed"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options?.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-cyan-200 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-blue-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0}
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          {currentQIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQIndex(prev => prev + 1)}
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answers with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
