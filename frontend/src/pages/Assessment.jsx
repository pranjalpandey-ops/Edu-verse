import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import API from '../services/api';

const Assessment = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "q1",
      concept: "Current",
      question: "What is the SI unit of Electric Current?",
      options: [
        { id: "A", text: "Ampere (A)", correct: true },
        { id: "B", text: "Volt (V)", correct: false },
        { id: "C", text: "Ohm (Ω)", correct: false },
        { id: "D", text: "Joule (J)", correct: false }
      ]
    },
    {
      id: "q2",
      concept: "Voltage",
      question: "Which component maintains the electric potential difference across a circuit?",
      options: [
        { id: "A", text: "Battery / Electric Cell", correct: true },
        { id: "B", text: "Connecting wire", correct: false },
        { id: "C", text: "Switch", correct: false },
        { id: "D", text: "Plastic insulator", correct: false }
      ]
    },
    {
      id: "q3",
      concept: "Resistance",
      question: "If a wire's resistance increases while connected to a 12V battery, what happens to the electric current?",
      options: [
        { id: "A", text: "It decreases inversely (I = V / R)", correct: true },
        { id: "B", text: "It increases proportionally", correct: false },
        { id: "C", text: "It stays exactly the same", correct: false },
        { id: "D", text: "It becomes infinite", correct: false }
      ]
    },
    {
      id: "q4",
      concept: "Ohm's Law",
      question: "A 24V power supply is connected across an 8Ω resistor. What current is measured by an ammeter?",
      options: [
        { id: "A", text: "3 Amperes", correct: true },
        { id: "B", text: "192 Amperes", correct: false },
        { id: "C", text: "0.33 Amperes", correct: false },
        { id: "D", text: "16 Amperes", correct: false }
      ]
    }
  ];

  const currentQ = questions[currentIdx];

  const handleSelect = (optId) => {
    setAnswers({ ...answers, [currentQ.id]: optId });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      await API.post('/assessments/assessment_1/submit', { answers });
      navigate('/report');
    } catch (e) {
      navigate('/report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
          <span className="uppercase tracking-wider">Module Assessment • Physics: Electricity</span>
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Concept: {currentQ.concept}</span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 ring-1 ring-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="py-2.5 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="py-2.5 px-6 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <span>{currentIdx === questions.length - 1 ? (isSubmitting ? "Generating Report..." : "Submit Assessment") : "Next Question"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
