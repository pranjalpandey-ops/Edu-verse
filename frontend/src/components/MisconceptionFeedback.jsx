import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const MisconceptionFeedback = ({ diagnosis, onResolveMisconception }) => {
  const [selectedRemedial, setSelectedRemedial] = useState(null);
  const [remedialResolved, setRemedialResolved] = useState(false);

  if (!diagnosis || !diagnosis.misconception) return null;

  const handleRemedialAnswer = (optId) => {
    setSelectedRemedial(optId);
    if (optId === 'A') {
      setRemedialResolved(true);
      if (onResolveMisconception) {
        setTimeout(() => onResolveMisconception(), 1200);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500/80 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-4">
      {/* Misconception Tag */}
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
        <AlertTriangle className="w-5 h-5" />
        <span>Cognitive Misconception Detected</span>
      </div>

      {/* AI Diagnosis Description */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <p className="font-bold mb-1">What happened:</p>
        <p>{diagnosis.misconception.misconception}</p>
      </div>

      {/* Water Pipe Analogy Remedial Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>{diagnosis.remedialExplanation?.title || "Let us look at the Water-Pipe Analogy"}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{diagnosis.remedialExplanation?.teacherSpeech}"
        </p>

        <div className="space-y-1.5 pt-1 text-xs">
          {diagnosis.remedialExplanation?.analogySteps?.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-medium">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Remedial Follow-Up Question */}
      {diagnosis.followUpQuestion && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {diagnosis.followUpQuestion.question}
          </p>
          <div className="space-y-2">
            {diagnosis.followUpQuestion.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleRemedialAnswer(opt.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${selectedRemedial === opt.id ? (opt.id === 'A' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-rose-50 border-rose-500 text-rose-800') : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span>{opt.text}</span>
                {selectedRemedial === opt.id && opt.id === 'A' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {remedialResolved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Misconception Resolved! Increasing concept mastery and resuming lesson...</span>
        </div>
      )}
    </div>
  );
};

export default MisconceptionFeedback;
