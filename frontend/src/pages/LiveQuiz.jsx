import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, XCircle, Zap, Shield, Sparkles } from 'lucide-react';
import { getSocket } from '../services/api';

const LiveQuiz = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const cleanCode = (roomCode || 'EDU-9999').toUpperCase();

  const [status, setStatus] = useState('lobby'); // lobby, active, answered, finished
  const [participants, setParticipants] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [myScore, setMyScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);

  const [questions, setQuestions] = useState([
    {
      id: 'lq1',
      question: 'Which fundamental principle dictates how systems maintain equilibrium under increasing friction/resistance?',
      options: [
        { id: 'A', text: 'Throughput decreases proportionally with increased opposition.' },
        { id: 'B', text: 'Throughput increases infinitely.' }
      ],
      correctAnswer: 'A'
    },
    {
      id: 'lq2',
      question: 'In computational algorithms, what is the core time complexity advantage of divide-and-conquer searching?',
      options: [
        { id: 'A', text: 'Logarithmic search space reduction O(log n).' },
        { id: 'B', text: 'Linear scan over all elements O(n).' }
      ],
      correctAnswer: 'A'
    }
  ]);

  useEffect(() => {
    const socket = getSocket();

    socket.emit('join_room', {
      roomCode: cleanCode,
      username: 'Learner_' + Math.floor(100 + Math.random() * 900),
      avatar: '🚀'
    });

    socket.on('room_update', (data) => {
      if (data.participants) setParticipants(data.participants);
      if (data.status === 'active' && status === 'lobby') {
        setStatus('active');
      }
    });

    socket.on('quiz_started', () => {
      setStatus('active');
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeRemaining(15);
    });

    socket.on('question_changed', (data) => {
      setCurrentQIndex(data.questionIndex);
      setSelectedOption(null);
      setIsCorrect(null);
      setStatus('active');
      setTimeRemaining(15);
    });

    socket.on('leaderboard_update', (data) => {
      if (data.participants) setParticipants(data.participants);
    });

    return () => {
      socket.off('room_update');
      socket.off('quiz_started');
      socket.off('question_changed');
      socket.off('leaderboard_update');
    };
  }, [cleanCode, status]);

  // Question countdown
  useEffect(() => {
    if (status !== 'active') return;
    if (timeRemaining <= 0) {
      if (!selectedOption) {
        handleAnswer('TIME_OUT');
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, status, selectedOption]);

  const handleAnswer = (optionId) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionId);

    const currentQ = questions[currentQIndex];
    const correct = optionId === currentQ?.correctAnswer;
    setIsCorrect(correct);
    setStatus('answered');

    if (correct) {
      const speedBonus = Math.round(timeRemaining * 10);
      const points = 100 + speedBonus;
      setMyScore(prev => prev + points);
    }

    const socket = getSocket();
    socket.emit('submit_answer', {
      roomCode: cleanCode,
      questionIndex: currentQIndex,
      isCorrect: correct,
      timeRemaining
    });
  };

  const currentQ = questions[currentQIndex] || questions[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100 min-h-[75vh] flex flex-col justify-center pb-12">
      {/* Top HUD */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 font-mono text-xs font-black">
            {cleanCode}
          </span>
          <span className="text-xs font-bold text-slate-500">Live Arena</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
            <Zap className="w-4 h-4 fill-current" />
            <span>{myScore} pts</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-black text-slate-700 dark:text-slate-200">
            <Clock className={`w-4 h-4 ${timeRemaining < 5 ? 'text-rose-500 animate-pulse' : 'text-blue-600'}`} />
            <span>{timeRemaining}s</span>
          </div>
        </div>
      </div>

      {/* Lobby State */}
      {status === 'lobby' && (
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">You are in the Lobby!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Waiting for the host professor to launch the live quiz battle...
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
            👥 {participants.length} Learners connected
          </div>
        </div>
      )}

      {/* Active Question State */}
      {(status === 'active' || status === 'answered') && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Live Question {currentQIndex + 1} of {questions.length}
            </span>
            <h2 className="text-base md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3.5">
            {currentQ.options?.map(opt => {
              const isSelected = selectedOption === opt.id;
              let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400';

              if (status === 'answered') {
                if (opt.id === currentQ.correctAnswer) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={status === 'answered'}
                  className={`p-5 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback banner when answered */}
          {status === 'answered' && (
            <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold ${
              isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}>
              <span className="flex items-center gap-2">
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isCorrect ? 'Spot On! Speed bonus applied.' : 'Incorrect! Opposition reduces throughput.'}
              </span>
              <span>Waiting for next question...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveQuiz;
