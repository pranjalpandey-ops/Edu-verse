import React, { useState, useEffect } from 'react';
import { 
  FileText, Sparkles, Copy, Check, Plus, Search, BookOpen, 
  Layers, ArrowRight, Loader2, Filter, Zap, Play, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API, { noteAPI } from '../services/api';

const SUBJECT_ICONS = {
  Physics: '⚡',
  Mathematics: '📐',
  Chemistry: '🧪',
  Biology: '🧬',
  'Computer Science': '💻',
  General: '📚'
};

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await API.get('/notes');
      if (res.data?.success && res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!customTopic.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await API.post('/notes/generate', {
        topic: customTopic.trim(),
        subject: selectedSubject === 'All' ? 'General' : selectedSubject
      });
      if (res.data?.success && res.data.note) {
        setNotes(prev => [res.data.note, ...prev]);
        setSelectedNoteIndex(0);
        setCustomTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchSubject = selectedSubject === 'All' || (n.subject || 'General') === selectedSubject;
    const matchQuery = !searchQuery.trim() || 
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchQuery;
  });

  const currentNote = filteredNotes[selectedNoteIndex] || filteredNotes[0] || notes[0];

  const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Computer Science'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI SYNTHESIZED STUDY NOTES & FORMULA SHEETS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Notes & <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Formula Cheat Sheets</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Auto-synthesized key takeaways, derivations, equations, and active recall pedagogical insights across all subjects.
          </p>
        </div>
      </div>

      {/* Generator & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Topic Generator */}
        <form 
          onSubmit={handleGenerate}
          className="lg:col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 ml-2" />
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Generate master study notes for any topic (e.g. Electromagnetic Waves, Thermodynamics, React Hooks)..."
            className="flex-1 bg-transparent text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={generating || !customTopic.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{generating ? 'Synthesizing...' : 'Generate Notes'}</span>
          </button>
        </form>

        {/* Search Notes Filter */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within study notes..."
            className="flex-1 bg-transparent text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Subject:
        </span>
        {subjects.map(subj => (
          <button
            key={subj}
            onClick={() => { setSelectedSubject(subj); setSelectedNoteIndex(0); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedSubject === subj
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{SUBJECT_ICONS[subj] || '📚'}</span>
            <span>{subj}</span>
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Notes List (1 col) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Available Study Notes ({filteredNotes.length})
          </h2>

          {loadingNotes ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No notes match your filter. Generate one above!</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredNotes.map((note, idx) => {
                const isSelected = (filteredNotes[selectedNoteIndex]?._id || filteredNotes[selectedNoteIndex]?.title) === (note._id || note.title);
                return (
                  <div
                    key={note._id || idx}
                    onClick={() => setSelectedNoteIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {SUBJECT_ICONS[note.subject] || '📚'} {note.subject || 'General'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {note.formulas?.length || 0} formulas
                      </span>
                    </div>
                    <h3 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white line-clamp-2">
                      {note.title || note.topic}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {note.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Note Detail Card (2 cols) */}
        <div className="lg:col-span-2">
          {currentNote ? (
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-xs font-bold">
                      {currentNote.subject || 'General'}
                    </span>
                    <span className="text-xs text-slate-400">Topic: {currentNote.topic}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(currentNote, 'full_note')}
                    className="py-2 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedId === 'full_note' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'full_note' ? "Copied" : "Copy Note"}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(currentNote.topic || currentNote.title)}`)}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>AI Lesson</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentNote.summary}
              </div>

              {/* Core Formulas */}
              {currentNote.formulas && currentNote.formulas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Mathematical Equations & Formulas ({currentNote.formulas.length})</span>
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentNote.formulas.map((f, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
                          <button
                            onClick={() => handleCopy(f.formula, `f_${i}`)}
                            className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 p-1 rounded-md transition cursor-pointer"
                          >
                            {copiedId === `f_${i}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-900/5 dark:bg-black/40 border border-blue-200/50 dark:border-blue-500/20 font-mono text-xs md:text-sm text-blue-700 dark:text-cyan-300 font-bold overflow-x-auto">
                          {f.formula}
                        </div>
                        {f.unit && (
                          <div className="text-[10px] text-slate-400">Unit: {f.unit}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Pedagogical Insights */}
              {currentNote.keyPoints && currentNote.keyPoints.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Core Conceptual Insights & Exam Focus</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {currentNote.keyPoints.map((p, i) => (
                      <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Select a study note from the left to view formulas and insights.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
