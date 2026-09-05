import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Sparkles, BookOpen, Video, ArrowRight, Clock, Award, 
  HelpCircle, Compass, Zap, CheckCircle2, ChevronRight, Layers, Flame, Copy, Check
} from 'lucide-react';
import { searchAPI } from '../services/api';

const QUICK_TOPICS = [
  'Photosynthesis',
  'Binary Search Trees',
  'Quantum Superposition',
  'Differential Calculus',
  'Newton\'s Laws of Motion',
  'DNA Replication & CRISPR',
  'Lens Maker Formula',
  'Nernst Equation'
];

export default function SearchLearn() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [copiedFormula, setCopiedFormula] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchTerm) => {
    const q = (searchTerm || query).trim();
    if (!q) return;
    setLoading(true);
    setSearchParams({ q });

    try {
      const res = await searchAPI.search(q);
      if (res.data?.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (topic) => {
    navigate(`/create-lesson?topic=${encodeURIComponent(topic || query)}`);
  };

  const handleOpenVideo = (video) => {
    navigate(`/youtube/${video.videoId || 'vid_yt_1'}?topic=${encodeURIComponent(results?.topic || query)}`);
  };

  const handleCopy = (formulaText, id) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 transition-colors pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNIVERSAL AI SEARCH & MULTIMODAL LEARNING</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Search Any Topic. <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Learn Without Limits.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Instant AI conceptual synthesis, grounded YouTube masterclasses, live formulas, and adaptive diagnostic questions for any subject.
          </p>

          {/* Search Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any concept, formula, or law (e.g. Lens Maker, Nernst, Binary Search, Photosynthesis)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm md:text-base shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 shrink-0 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Try exploring:</span>
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setQuery(topic);
                  handleSearch(topic);
                }}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:border-blue-300 dark:hover:border-blue-400/40 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 transition text-xs shadow-xs cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Synthesizing multimodal knowledge with Gemini AI...</p>
        </div>
      ) : results && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Grid: AI Overview & Lesson Launcher */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: AI Overview (2 cols) */}
            <div className="lg:col-span-2 rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-xs">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>AI Comprehensive Synthesis</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{results.topic}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>{results.recommendedStudyTime}</span>
                  </div>
                  <button
                    onClick={() => handleStartLesson(results.topic)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs md:text-sm flex items-center gap-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
                  >
                    <span>Launch AI Teacher</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                {results.overview}
              </p>

              {/* Key Concepts Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Key Concepts You Will Master</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.keyConcepts?.map((concept, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3 hover:border-blue-500/40 transition"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Learning Path */}
              {results.suggestedPath && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>Suggested 4-Step Mastery Roadmap</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {results.suggestedPath.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                            {item.step}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Action & Related Topics */}
            <div className="space-y-6">
              {/* Ready to Learn Card */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-900/40 dark:via-slate-900 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-500/30 backdrop-blur-xl space-y-4 shadow-sm dark:shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Flame className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interactive AI Classroom</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Enter the dynamic classroom with ARIA the AI Educator, multimodal SVG blackboard, and voice interaction.
                  </p>
                </div>
                <button
                  onClick={() => handleStartLesson(results.topic)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start 20m Interactive Lesson</span>
                </button>
              </div>

              {/* Matching Formulas */}
              {results.matchingFormulas && results.matchingFormulas.length > 0 && (
                <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Relevant Formulas in Vault</span>
                  </h4>
                  <div className="space-y-2">
                    {results.matchingFormulas.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>{f.name}</span>
                          <button
                            onClick={() => handleCopy(f.formula, `s_f_${idx}`)}
                            className="text-slate-400 hover:text-blue-600"
                          >
                            {copiedFormula === `s_f_${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono text-xs text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-black/30 p-1.5 rounded-lg">
                          {f.formula}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Concepts */}
              {results.relatedTopics && (
                <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Related Branches</h4>
                  <div className="space-y-2">
                    {results.relatedTopics.map((rel, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(rel);
                          handleSearch(rel);
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-600/20 border border-slate-200 dark:border-slate-700/50 text-left text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center justify-between transition group cursor-pointer"
                      >
                        <span>{rel}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* YouTube Curated Video Masterclasses */}
          {results.youtubeVideos && results.youtubeVideos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500 dark:text-red-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Curated Educational YouTube Masterclasses</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Live search ranked by conceptual match</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.youtubeVideos?.map((video, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleOpenVideo(video)}
                    className="group rounded-3xl p-4 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700/50">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                          {video.badge || 'TOP PICK'}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-200">
                          {video.duration || '15:00'}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{video.channelTitle} • {video.views || 'Verified'}</p>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">Match {video.matchScore || 95}%: </span>
                        {video.whyRecommended || 'Matches search intent with clear visual derivations.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <span>Learn with AI grounded Q&A</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Checkpoint Questions */}
          {results.sampleQuestions && (
            <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-xs">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500 dark:text-yellow-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Active Recall Checkpoint</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.sampleQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 space-y-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">Q{qIdx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedAnswer[qIdx] === oIdx;
                        const isCorrect = oIdx === q.correctIndex;
                        let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 shadow-xs";
                        if (selectedAnswer[qIdx] !== undefined) {
                          if (isCorrect) btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/60 text-emerald-800 dark:text-emerald-200";
                          else if (isChosen) btnStyle = "bg-red-50 dark:bg-red-950/60 border-red-500/60 text-red-800 dark:text-red-200";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedAnswer({ ...selectedAnswer, [qIdx]: oIdx })}
                            className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {selectedAnswer[qIdx] !== undefined && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
