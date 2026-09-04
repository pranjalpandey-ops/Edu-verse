import React, { useState } from 'react';
import { HelpCircle, Send, Mic, CheckCircle2, AlertCircle } from 'lucide-react';

const QuestionCard = ({ question, onSubmitAnswer, isSubmitting, isListening, toggleSpeechRecognition }) => {
  const [selectedOption, setSelectedOption] = useState('B'); // Default to B for demo flow or let user choose

  const defaultQuestion = question || {
    id: "q_3",
    question: "If voltage remains constant and resistance increases, what happens to current?",
    options: [
      { id: "A", text: "It increases proportionally." },
      { id: "B", text: "It decreases." },
      { id: "C", text: "It remains the same." },
      { id: "D", text: "It fluctuates unpredictably." }
    ]
  };

  const handleSelect = (optId) => {
    setSelectedOption(optId);
  };

  const handleSubmit = () => {
    if (onSubmitAnswer) {
      onSubmitAnswer(selectedOption, defaultQuestion);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-base mb-4">
          <HelpCircle className="w-5 h-5" />
          <span>Lesson Assistant</span>
        </div>

        {/* Check your understanding badge */}
        <div className="mb-4">
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] tracking-wider uppercase rounded-full">
            CHECK YOUR UNDERSTANDING
          </span>
        </div>

        {/* Question Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug mb-5">
          {defaultQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {defaultQuestion.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`
                  flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 select-none
                  ${isSelected 
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-600 text-slate-900 dark:text-slate-100 font-medium' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'}
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full border flex items-center justify-center transition-all
                  ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'}
                `}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <div className="text-sm font-medium">
                  <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Submit Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 bg-indigo-700 hover:bg-indigo-800 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            <span>Evaluating Concept...</span>
          ) : (
            <>
              <span>Submit Answer</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
