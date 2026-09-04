import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';
import API from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const n = notes[0] || {
    title: "Physics: Electricity & Ohm's Law - Master Formula Sheet",
    summary: "Essential reference points for exam preparation.",
    formulas: [
      { name: "Ohm's Law", formula: "V = I × R", unit: "Volts (V)" },
      { name: "Electric Current", formula: "I = Q / t", unit: "Amperes (A)" },
      { name: "Resistance Formula", formula: "R = ρ (L / A)", unit: "Ohms (Ω)" }
    ],
    keyPoints: [
      "Current is inversely proportional to resistance for a constant voltage.",
      "Water-pipe analogy: Squeezing a pipe tighter restricts flow (less current)."
    ]
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(n, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Smart Notes & Formulas
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Auto-synthesized key takeaways, derivations, and mathematical cheat sheets.
          </p>
        </div>

        <button 
          onClick={handleCopy}
          className="py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied" : "Copy Notes"}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{n.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.summary}</p>

        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Core Formulas</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {n.formulas?.map((f, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-bold text-slate-400">{f.name}</div>
                <div className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{f.formula}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Unit: {f.unit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Pedagogical Insights</h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {n.keyPoints?.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notes;
