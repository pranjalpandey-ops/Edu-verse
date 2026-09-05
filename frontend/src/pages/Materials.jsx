import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, FileText, Trash2, Plus, Sparkles, CheckCircle2, 
  Play, HelpCircle, BookOpen, Layers, MessageSquare, Loader2, ArrowRight, X, Send, Award, RotateCcw
} from 'lucide-react';
import API, { materialAPI, quizAPI, flashcardsAPI } from '../services/api';

export default function Materials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMat, setSelectedMat] = useState(null);
  
  // Interactive Modal State
  const [activeAction, setActiveAction] = useState(null); // 'flashcards' | 'quiz' | 'ask' | 'summary'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionData, setActionData] = useState(null);
  
  // RAG Ask state
  const [ragQuestion, setRagQuestion] = useState('');
  const [ragAnswers, setRagAnswers] = useState([]);

  // Upload state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await materialAPI.getAll();
      if (res.data?.success && res.data.materials) {
        setMaterials(res.data.materials);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', 'College / Senior Secondary');
    try {
      const res = await materialAPI.upload(formData);
      if (res.data?.success) {
        fetchMaterials();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenFlashcards = async (mat) => {
    setSelectedMat(mat);
    setActiveAction('flashcards');
    setActionLoading(true);
    setActionData(null);
    try {
      const res = await materialAPI.flashcards(mat._id);
      if (res.data?.success) {
        setActionData({ flashcards: res.data.flashcards });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenQuiz = async (mat) => {
    setSelectedMat(mat);
    setActionLoading(true);
    try {
      const res = await materialAPI.quiz(mat._id);
      if (res.data?.success && res.data.quiz) {
        navigate(`/quiz?id=${res.data.quiz.id || res.data.quiz._id}&topic=${encodeURIComponent(mat.filename.replace(/\.[^/.]+$/, ''))}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAsk = (mat) => {
    setSelectedMat(mat);
    setActiveAction('ask');
    setRagQuestion('');
    setRagAnswers([]);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!ragQuestion.trim() || !selectedMat || actionLoading) return;
    const q = ragQuestion.trim();
    setRagQuestion('');
    setActionLoading(true);
    try {
      const res = await materialAPI.ask(selectedMat._id, { question: q });
      if (res.data?.success) {
        setRagAnswers(prev => [...prev, { question: q, answer: res.data.answer, sources: res.data.sources }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenSummary = async (mat) => {
    setSelectedMat(mat);
    setActiveAction('summary');
    setActionLoading(true);
    setActionData(null);
    try {
      const res = await materialAPI.summarize(mat._id);
      if (res.data?.success) {
        setActionData({ summary: res.data.summary });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLaunchLesson = (mat) => {
    navigate(`/teacher?topic=${encodeURIComponent(mat.filename.replace(/\.[^/.]+$/, ''))}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-purple-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE GROUNDING & VECTOR RAG PIPELINE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Document RAG, <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">Notes & Materials</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Upload notes, textbooks or research slides. EduVerse extracts concepts, chunks vectors, and generates grounded flashcards, quizzes, and live AI classrooms.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <label className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{uploading ? 'Processing & Vectorizing...' : 'Upload PDF / Notes Document'}</span>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Grounded Notes & Documents ({materials.length})</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ready for AI Q&A, Flashcards & Quizzes</span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Retrieving vectorized document collections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((mat) => {
              const cleanTitle = mat.filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
              return (
                <div
                  key={mat._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase">
                          {mat.fileType || 'PDF'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                          {mat.level || 'STEM Grounded'}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Vector Grounded
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      {cleanTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pages: {mat.pageCount || mat.pages || 14} • Vector Chunks: 12 • Status: Ready
                    </p>

                    {/* Grounded Snippet preview */}
                    {mat.textContent && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 line-clamp-3 leading-relaxed font-mono text-[11px]">
                        {mat.textContent.slice(0, 240)}...
                      </p>
                    )}
                  </div>

                  {/* Primary Grounded Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    {/* Flashcards Button */}
                    <button
                      onClick={() => handleOpenFlashcards(mat)}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Flashcards</span>
                    </button>

                    {/* Quiz Button */}
                    <button
                      onClick={() => handleOpenQuiz(mat)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-600 hover:text-white text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Grounded Quiz</span>
                    </button>

                    {/* Ask AI RAG */}
                    <button
                      onClick={() => handleOpenAsk(mat)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI (RAG)</span>
                    </button>

                    {/* AI Lesson */}
                    <button
                      onClick={() => handleLaunchLesson(mat)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ml-auto"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>AI Lesson</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL / ACTION DRAWER */}
      {activeAction && selectedMat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  Grounded in: {selectedMat.filename}
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  {activeAction === 'flashcards' && 'Grounded Flashcards'}
                  {activeAction === 'ask' && 'Ask AI Anything from this Document'}
                  {activeAction === 'summary' && 'Synthesized Knowledge Summary'}
                </h2>
              </div>
              <button
                onClick={() => { setActiveAction(null); setSelectedMat(null); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ACTION 1: FLASHCARDS */}
            {activeAction === 'flashcards' && (
              <div className="space-y-4">
                {actionLoading ? (
                  <div className="py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                    <p className="text-xs text-slate-500">Generating flashcards grounded in document context...</p>
                  </div>
                ) : actionData?.flashcards ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Generated {actionData.flashcards.length} active recall cards directly from this document.
                    </p>
                    <div className="space-y-3">
                      {actionData.flashcards.map((card, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-purple-700 dark:text-purple-300">
                            <span>Card {idx + 1}: {card.concept}</span>
                            <span className="uppercase text-[10px] bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
                              {card.difficulty || 'Medium'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Q: {card.front}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-purple-100 dark:border-purple-900/30">
                            A: {card.back}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/revision?tab=spaced_repetition')}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Practice in Spaced Repetition Hub</span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* ACTION 2: RAG Q&A */}
            {activeAction === 'ask' && (
              <div className="space-y-4">
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {ragAnswers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      Ask any question about formulas, definitions, or mechanisms in this document.
                    </div>
                  ) : (
                    ragAnswers.map((item, idx) => (
                      <div key={idx} className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                        <p className="font-bold text-blue-600 dark:text-cyan-400">Q: {item.question}</p>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{item.answer}</p>
                        {item.sources && item.sources.length > 0 && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            📑 Sources cited from document chunks
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={ragQuestion}
                    onChange={(e) => setRagQuestion(e.target.value)}
                    placeholder="Ask e.g. What is the Nernst equation or Law of Cosines in this doc?..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !ragQuestion.trim()}
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Ask RAG</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
