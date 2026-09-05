import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Play, Trophy, ArrowRight, CheckCircle2, Clock, Sparkles, Copy, Check } from 'lucide-react';
import { getSocket, quizAPI } from '../services/api';

const LiveQuizHost = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const cleanCode = (roomCode || 'EDU-9999').toUpperCase();

  const [roomStatus, setRoomStatus] = useState('lobby'); // lobby, active, finished
  const [participants, setParticipants] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: 'lq1',
      question: 'Which fundamental principle dictates how systems maintain equilibrium under increasing friction/resistance?',
      options: [
        { id: 'A', text: 'Throughput decreases proportionally with increased opposition.' },
        { id: 'B', text: 'Throughput increases infinitely.' }
      ]
    },
    {
      id: 'lq2',
      question: 'In computational algorithms, what is the core time complexity advantage of divide-and-conquer searching?',
      options: [
        { id: 'A', text: 'Logarithmic search space reduction O(log n).' },
        { id: 'B', text: 'Linear scan over all elements O(n).' }
      ]
    }
  ]);

  useEffect(() => {
    const socket = getSocket();

    socket.emit('join_room', {
      roomCode: cleanCode,
      username: 'Host Professor',
      avatar: '👨‍🏫'
    });

    socket.on('room_update', (data) => {
      if (data.participants) setParticipants(data.participants);
      if (data.status) setRoomStatus(data.status);
      if (data.questionIndex !== undefined) setCurrentQIndex(data.questionIndex);
    });

    socket.on('leaderboard_update', (data) => {
      if (data.participants) setParticipants(data.participants);
    });

    return () => {
      socket.off('room_update');
      socket.off('leaderboard_update');
    };
  }, [cleanCode]);

  const handleStartQuiz = () => {
    const socket = getSocket();
    socket.emit('start_quiz', { roomCode: cleanCode });
    setRoomStatus('active');
  };

  const handleNextQuestion = () => {
    const socket = getSocket();
    const nextIdx = currentQIndex + 1;
    if (nextIdx < quizQuestions.length) {
      setCurrentQIndex(nextIdx);
      socket.emit('next_question', { roomCode: cleanCode, nextIndex: nextIdx });
    } else {
      setRoomStatus('finished');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100 pb-12">
      {/* Top Banner with Room Code */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            Live Quiz Host Control
          </span>
          <h1 className="text-2xl md:text-3xl font-black">STEM Multiplayer Arena</h1>
          <p className="text-xs text-blue-100">Share the code below with your students to join the battle.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-mono font-black tracking-widest">{cleanCode}</span>
            <p className="text-[10px] text-blue-200 font-bold uppercase mt-0.5">Room Code</p>
          </div>
          <button
            onClick={copyRoomCode}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Lobby State */}
      {roomStatus === 'lobby' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-black text-sm">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Connected Learners ({participants.length})</span>
              </div>
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Lobby Open
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[180px]">
              {participants.map((p, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5">
                  <span className="text-xl">{p.avatar || '🧑‍🎓'}</span>
                  <div className="truncate">
                    <p className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">{p.username}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{p.isHost ? 'Host' : 'Ready'}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={participants.length === 0}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Live Quiz Battle</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Host Instructions</h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5 leading-relaxed">
              <li>1. Tell students to visit <strong>/join-quiz</strong></li>
              <li>2. They enter code <strong>{cleanCode}</strong></li>
              <li>3. Click <strong>Start Live Quiz Battle</strong> once everyone has joined!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Active State */}
      {roomStatus === 'active' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 font-bold text-xs">
                Question {currentQIndex + 1} of {quizQuestions.length}
              </span>
              <button
                onClick={handleNextQuestion}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
              >
                <span>{currentQIndex < quizQuestions.length - 1 ? 'Next Question' : 'End Quiz & Show Podium'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
              {quizQuestions[currentQIndex]?.question}
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {quizQuestions[currentQIndex]?.options?.map(opt => (
                <div key={opt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-500">
              <Trophy className="w-4 h-4" />
              <span>Live Leaderboard</span>
            </div>

            <div className="space-y-2">
              {participants.map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                      idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{p.username}</span>
                  </div>
                  <span className="font-mono font-black text-blue-600 dark:text-cyan-400">{p.score || 0} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished State / Final Podium */}
      {roomStatus === 'finished' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Live Quiz Battle Concluded!</h2>
          
          <div className="space-y-2 max-w-md mx-auto text-left">
            {participants.slice(0, 3).map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
                <span className="font-black">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {p.username}</span>
                <span className="font-mono font-black text-blue-600 dark:text-cyan-400">{p.score || 0} pts</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="py-3.5 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveQuizHost;
