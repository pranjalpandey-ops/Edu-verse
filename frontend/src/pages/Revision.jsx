import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Search, Sparkles, Copy, Check, Play, Filter, 
  Layers, ArrowRight, RotateCcw, Award, CheckCircle2, ChevronRight,
  Flame, Zap, Compass, Atom, Cpu, RefreshCw, HelpCircle, Plus, Eye, EyeOff, Loader2, Shuffle, Dices
} from 'lucide-react';
import MathView from '../components/MathView';
import { formulaAPI, revisionAPI, flashcardsAPI } from '../services/api';

const GRADES = [
  { id: 'class-9', label: 'Class 9th', desc: 'Foundations of Science, Math & Motion' },
  { id: 'class-10', label: 'Class 10th', desc: 'Board Exam Mastery, Optics, Electricity & Algebra' },
  { id: 'class-11', label: 'Class 11th', desc: 'Advanced Mechanics, Calculus & Physical Chemistry' },
  { id: 'class-12', label: 'Class 12th', desc: 'Board & Competitive Simulation (JEE / NEET / CBSE)' }
];

const SUBJECTS = [
  { id: 'all', label: 'All Subjects', icon: '📚' },
  { id: 'physics', label: 'Physics', icon: '⚡' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { id: 'mathematics', label: 'Mathematics', icon: '📐' },
  { id: 'biology', label: 'Biology', icon: '🧬' }
];

export default function Revision() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'random_formulas';

  const [activeTab, setActiveTab] = useState(defaultTab); // 'random_formulas' | 'spaced_repetition' | 'formulas'
  
  // Random / Unseen Formulas State
  const [randomFormulas, setRandomFormulas] = useState([]);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [randomSubjectFilter, setRandomSubjectFilter] = useState('all');

  // Spaced Repetition State
  const [dueItems, setDueReviews] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [generatingCards, setGeneratingCards] = useState(false);

  // Formula Vault State
  const [selectedGrade, setSelectedGrade] = useState('class-12');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [curriculumData, setCurriculumData] = useState([]);
  const [loadingFormulas, setLoadingFormulas] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(null);

  useEffect(() => {
    fetchRandomFormulas();
    loadDueReviews();
  }, []);

  useEffect(() => {
    if (activeTab === 'formulas') {
      fetchCurriculum();
    }
  }, [activeTab, selectedGrade, selectedSubject]);

  const fetchRandomFormulas = async () => {
    setLoadingRandom(true);
    try {
      const res = await formulaAPI.getRandom({
        count: 6,
        subject: randomSubjectFilter === 'all' ? undefined : randomSubjectFilter
      });
      if (res.data?.success) {
        setRandomFormulas(res.data.formulas || []);
      }
    } catch (err) {
      console.error('Error fetching random formulas:', err);
    } finally {
      setLoadingRandom(false);
    }
  };

  const loadDueReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await revisionAPI.getToday();
      if (res.data?.success) {
        setDueReviews(res.data.items || []);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setReviewCompleted(false);
      }
    } catch (err) {
      console.error('Error loading due reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleGenerateCustomCards = async (e) => {
    e.preventDefault();
    if (!customTopic.trim() || generatingCards) return;
    setGeneratingCards(true);
    try {
      const res = await flashcardsAPI.generate({
        topic: customTopic.trim(),
        count: 4
      });
      if (res.data?.success && res.data.flashcards) {
        setDueReviews(prev => [...(res.data.flashcards || []), ...prev]);
        setCustomTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCards(false);
    }
  };

  const handleReviewRating = async (quality) => {
    if (submittingReview || !dueItems[currentCardIndex]) return;
    setSubmittingReview(true);
    const card = dueItems[currentCardIndex];

    try {
      await revisionAPI.submitReview({
        itemId: card._id || card.id,
        quality,
        concept: card.concept,
        question: card.question || card.front,
        answer: card.answer || card.back
      });

      if (currentCardIndex < dueItems.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
        setShowHint(false);
      } else {
        setReviewCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchCurriculum = async () => {
    setLoadingFormulas(true);
    try {
      const res = await formulaAPI.getCurriculum({
        grade: selectedGrade,
        subject: selectedSubject === 'all' ? undefined : selectedSubject
      });
      if (res.data?.success) {
        setCurriculumData(res.data.curriculum || []);
      }
    } catch (err) {
      console.error('Failed to fetch formulas:', err);
    } finally {
      setLoadingFormulas(false);
    }
  };

  const handleCopy = (formulaText, id) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleLaunchLesson = (topic) => {
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  };

  const currentCard = dueItems[currentCardIndex];

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 transition-colors pb-16">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-purple-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNSEEN FORMULA DISCOVERY & REVISION VAULT</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Formulas, Derivations & <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">Spaced Retention</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Discover random formulas from across all classes and subjects, practice with SuperMemo SM-2 spaced repetition, or browse the complete Class 9–12 vault.
          </p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('random_formulas')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'random_formulas'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Discover Random Formulas</span>
        </button>

        <button
          onClick={() => setActiveTab('spaced_repetition')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'spaced_repetition'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Spaced Repetition ({dueItems.length} Due)</span>
        </button>

        <button
          onClick={() => setActiveTab('formulas')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'formulas'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Class 9-12 Curriculum Vault</span>
        </button>
      </div>

      {/* TAB 1: RANDOM FORMULA DISCOVERY */}
      {activeTab === 'random_formulas' && (
        <div className="space-y-6">
          {/* Top Shuffle Controls & Subject Filters */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Unseen & Random Formula Cards</h2>
              </div>
              <p className="text-xs text-slate-500">
                Surfacing fresh mathematical, chemical, and physical formulas across different grades and chapters.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={fetchRandomFormulas}
                disabled={loadingRandom}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Shuffle className={`w-3.5 h-3.5 ${loadingRandom ? 'animate-spin' : ''}`} />
                <span>Shuffle & Discover More</span>
              </button>
            </div>
          </div>

          {/* Random Formulas Grid */}
          {loadingRandom ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Shuffling and retrieving fresh formulas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {randomFormulas.map((f, idx) => {
                const isCopied = copiedFormula === `rand_${idx}`;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                            {f.grade || 'Curriculum'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                            {f.subject}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(f.formula, `rand_${idx}`)}
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 p-1 transition cursor-pointer"
                          title="Copy Formula"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {f.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        📖 Chapter: {f.chapter}
                      </p>

                      {/* Formula Box */}
                      <div className="p-3.5 rounded-2xl bg-blue-900/5 dark:bg-black/40 border border-blue-200/50 dark:border-blue-500/20 text-xs md:text-sm text-blue-700 dark:text-cyan-300 font-bold overflow-x-auto min-h-[48px] flex items-center">
                        <MathView math={f.formula} block={false} />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {f.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/search?q=${encodeURIComponent(f.name + ' ' + (f.chapter || ''))}`)}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Search className="w-3 h-3" />
                        <span>Search Breakdown</span>
                      </button>

                      <button
                        onClick={() => handleLaunchLesson(f.lessonTopic || f.name)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>AI Lesson</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPACED REPETITION FLASHCARDS (SM-2) */}
      {activeTab === 'spaced_repetition' && (
        <div className="space-y-6">
          
          {/* Quick Generator Box */}
          <form onSubmit={handleGenerateCustomCards} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Generate instant flashcards for any topic (e.g. Thermodynamics, Graph Theory)..."
                className="w-full bg-transparent text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={generatingCards || !customTopic.trim()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {generatingCards ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Generate AI Cards</span>
            </button>
          </form>

          {/* Flashcard Active Runner */}
          {loadingReviews ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Checking SM-2 spaced repetition database schedule...</p>
            </div>
          ) : reviewCompleted ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Revision Session Complete!</h3>
              <p className="text-xs text-slate-500">
                You reviewed {dueItems.length} concept(s). Spaced repetition intervals have been recalculated for optimal memory retention.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={loadDueReviews}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
                >
                  Review Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : dueItems.length > 0 && currentCard ? (
            <div className="max-w-2xl mx-auto space-y-4">
              
              {/* Card Meta & Counter */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  Concept: {currentCard.concept}
                </span>
                <span className="font-mono">
                  Card {currentCardIndex + 1} of {dueItems.length}
                </span>
              </div>

              {/* Interactive Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[260px] p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800/60 shadow-lg cursor-pointer flex flex-col justify-between hover:border-purple-400 transition select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {isFlipped ? 'ANSWER & MECHANISM' : 'QUESTION / PROMPT'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      {isFlipped ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isFlipped ? 'Click to show front' : 'Click to reveal answer'}</span>
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {isFlipped ? (currentCard.answer || currentCard.back) : (currentCard.question || currentCard.front)}
                  </h3>
                </div>

                {/* Hint Button */}
                {currentCard.hints && currentCard.hints.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                    {showHint ? (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs">
                        💡 Hint: {currentCard.hints[0]}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Show Conceptual Hint</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* SM-2 Recall Quality Buttons */}
              {isFlipped && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in">
                  <p className="text-xs font-bold text-slate-500 text-center">
                    How well did you recall this concept?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleReviewRating(1)}
                      className="p-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm cursor-pointer"
                    >
                      <span>Again (1)</span>
                      <span className="text-[10px] opacity-80">&lt; 10 mins</span>
                    </button>
                    <button
                      onClick={() => handleReviewRating(2)}
                      className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm cursor-pointer"
                    >
                      <span>Hard (2)</span>
                      <span className="text-[10px] opacity-80">1 Day</span>
                    </button>
                    <button
                      onClick={() => handleReviewRating(3)}
                      className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm cursor-pointer"
                    >
                      <span>Good (3)</span>
                      <span className="text-[10px] opacity-80">3 Days</span>
                    </button>
                    <button
                      onClick={() => handleReviewRating(5)}
                      className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center gap-0.5 shadow-sm cursor-pointer"
                    >
                      <span>Easy (5)</span>
                      <span className="text-[10px] opacity-80">7 Days</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <RotateCcw className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">No Flashcards Due Right Now</h3>
              <p className="text-xs text-slate-500">
                You are completely caught up on your spaced repetition schedule. Generate new flashcards from any topic above or discover random formulas!
              </p>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: CLASS 9-12 FORMULA VAULT */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          {/* Grade Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GRADES.map(grade => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedGrade === grade.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm md:text-base flex items-center justify-between">
                  <span>{grade.label}</span>
                  {selectedGrade === grade.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <p className={`text-[11px] mt-1 line-clamp-1 ${selectedGrade === grade.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {grade.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter Subject:
            </span>
            {SUBJECTS.map(subj => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedSubject === subj.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{subj.icon}</span>
                <span>{subj.label}</span>
              </button>
            ))}
          </div>

          {/* Formulas List */}
          {loadingFormulas ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading curriculum formulas & concepts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curriculumData.flatMap(s => s.chapters || []).map((chapter, cIdx) => (
                <div 
                  key={cIdx} 
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/40 backdrop-blur-xl shadow-xs transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-bold">
                        Chapter {cIdx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {chapter.chapterName}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleLaunchLesson(chapter.lessonTopic || chapter.chapterName)}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 transition text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>AI Lesson</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {chapter.formulas?.map((f, fIdx) => {
                      const fUniqueId = `f_${cIdx}_${fIdx}`;
                      const isCopied = copiedFormula === fUniqueId;
                      return (
                        <div key={fIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
                            <button
                              onClick={() => handleCopy(f.formula, fUniqueId)}
                              className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 p-1 rounded-md transition cursor-pointer"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="px-3.5 py-2.5 rounded-xl bg-blue-900/5 dark:bg-black/40 border border-blue-200/50 dark:border-blue-500/20 text-xs md:text-sm text-blue-700 dark:text-cyan-300 font-bold overflow-x-auto min-h-[44px] flex items-center">
                            <MathView math={f.formula} block={false} />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
