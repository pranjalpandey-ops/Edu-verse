import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Search, Sparkles, Copy, Check, Play, Filter, 
  Layers, ArrowRight, RotateCcw, Award, CheckCircle2, ChevronRight,
  Flame, Zap, Compass, Atom, Cpu
} from 'lucide-react';
import { formulaAPI } from '../services/api';

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
  const [selectedGrade, setSelectedGrade] = useState('class-12');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedFormula, setCopiedFormula] = useState(null);

  useEffect(() => {
    fetchCurriculum();
  }, [selectedGrade, selectedSubject]);

  const fetchCurriculum = async () => {
    setLoading(true);
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
      setLoading(false);
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

  // Filter formulas by search query if any
  const filteredCurriculum = curriculumData.map(subj => {
    if (!searchQuery.trim()) return subj;
    const q = searchQuery.toLowerCase();
    const matchingChapters = (subj.chapters || []).filter(chap => {
      const titleMatch = chap.chapterName.toLowerCase().includes(q);
      const formulaMatch = (chap.formulas || []).some(f => 
        f.name.toLowerCase().includes(q) || 
        f.formula.toLowerCase().includes(q) || 
        f.description.toLowerCase().includes(q)
      );
      const conceptMatch = (chap.keyConcepts || []).some(c => c.toLowerCase().includes(q));
      return titleMatch || formulaMatch || conceptMatch;
    });
    return { ...subj, chapters: matchingChapters };
  }).filter(subj => subj.chapters && subj.chapters.length > 0);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 transition-colors">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-cyan-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLASS 9TH - 12TH FORMULA & CONCEPT VAULT</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Master Formulas, <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Derivations & Lessons</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Access essential formulas, key derivations, and 1-click AI interactive lessons for Physics, Chemistry, Mathematics, and Biology across Classes 9 to 12.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 dark:text-blue-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas, laws, theorems (e.g. Lens Maker, Nernst, Newton, Calculus)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs md:text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            />
          </div>
        </div>
      </div>

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

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading curriculum formulas & concepts...</p>
        </div>
      ) : filteredCurriculum.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No formulas match your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or subject filters.</p>
        </div>
      ) : (
        /* Curriculum by Subject */
        <div className="space-y-8">
          {filteredCurriculum.map((subjectGroup, sIdx) => (
            <div key={sIdx} className="space-y-4">
              {/* Subject Section Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {subjectGroup.subject === 'Physics' ? '⚡' : 
                     subjectGroup.subject === 'Chemistry' ? '🧪' : 
                     subjectGroup.subject === 'Mathematics' ? '📐' : '🧬'}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedGrade.replace('class-', 'Class ')}th {subjectGroup.subject}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-700/50">
                    {subjectGroup.chapters?.length || 0} Chapters
                  </span>
                </div>
              </div>

              {/* Chapters & Formulas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjectGroup.chapters?.map((chapter, cIdx) => (
                  <div 
                    key={cIdx} 
                    className="rounded-3xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/40 backdrop-blur-xl shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Chapter Header */}
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
                          title="Launch AI Lesson"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">AI Lesson</span>
                        </button>
                      </div>

                      {/* Key Concepts Pills */}
                      {chapter.keyConcepts && chapter.keyConcepts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {chapter.keyConcepts.map((concept, idx) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Formulas List */}
                      <div className="space-y-2.5 pt-1">
                        {chapter.formulas?.map((f, fIdx) => {
                          const fUniqueId = `${selectedGrade}-${subjectGroup.subject}-${cIdx}-${fIdx}`;
                          const isCopied = copiedFormula === fUniqueId;

                          return (
                            <div 
                              key={fIdx} 
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-500/30 transition space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {f.name}
                                </span>
                                <button
                                  onClick={() => handleCopy(f.formula, fUniqueId)}
                                  className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 p-1 rounded-md transition"
                                  title="Copy Formula"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              {/* Highlighted Formula Block */}
                              <div className="px-3 py-2 rounded-xl bg-blue-900/5 dark:bg-black/40 border border-blue-200/50 dark:border-blue-500/20 font-mono text-xs md:text-sm text-blue-700 dark:text-cyan-300 font-bold overflow-x-auto selection:bg-blue-500 selection:text-white">
                                {f.formula}
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {f.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer 1-Click Topic Launcher */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => navigate(`/search?q=${encodeURIComponent(chapter.lessonTopic || chapter.chapterName)}`)}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Overview</span>
                      </button>

                      <button
                        onClick={() => navigate(`/teacher?topic=${encodeURIComponent(chapter.lessonTopic || chapter.chapterName)}&subject=${encodeURIComponent(subjectGroup.subject)}&grade=${encodeURIComponent(selectedGrade)}`)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Live Lecture with ARIA</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
