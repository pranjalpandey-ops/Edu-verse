import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Brain, Award, Clock, ArrowRight, BookOpen, Layers, CheckSquare } from 'lucide-react';
import { quizAPI } from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || 'Binary Search and Algorithm Complexity';

  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    try {
      const res = await quizAPI.generate({
        topic,
        subject,
        difficulty,
        questionCount,
        language,
        questionTypes: ['mcq', 'true_false', 'short_answer']
      });

      if (res.data?.success && res.data.quiz) {
        navigate(`/quiz?id=${res.data.quiz.id || res.data.quiz._id}`);
      } else {
        navigate(`/quiz?topic=${encodeURIComponent(topic)}`);
      }
    } catch (err) {
      console.error(err);
      navigate(`/quiz?topic=${encodeURIComponent(topic)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          AI Quiz Generator
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate an intelligent, concept-grounded assessment for any academic subject with adaptive difficulty and automated misconception diagnosis.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            What topic would you like to test?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Binary Search, Thermodynamics, Newton's Laws"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs font-semibold"
            required
          />
        </div>

        {/* Configuration Options Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Subject Area
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>Computer Science</option>
              <option>Physics & Engineering</option>
              <option>Chemistry & Material Science</option>
              <option>Biology & Medicine</option>
              <option>Mathematics & Calculus</option>
              <option>General Studies</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="easy">Easy (Foundational & Definitions)</option>
              <option value="medium">Medium (Analytical & Causal Reasoning)</option>
              <option value="hard">Hard (Complex Multi-Step Problem Solving)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Question Count
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value={3}>3 Questions (Quick Sprint)</option>
              <option value={5}>5 Questions (Standard Diagnostic)</option>
              <option value={10}>10 Questions (Comprehensive Exam Prep)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
            </select>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-700 dark:text-cyan-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" /> MCQ &amp; Short Answer
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Misconception Diagnostics
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Real-time Mastery XP
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating AI Assessment &amp; Distractors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Quiz Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
