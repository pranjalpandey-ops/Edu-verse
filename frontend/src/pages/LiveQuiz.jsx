import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Swords, Trophy, Users, Clock, Flame, ArrowRight, 
  CheckCircle2, Send, MessageSquare, Sparkles, Play, ShieldAlert
} from 'lucide-react';
import { getSocket } from '../services/api';

const SAMPLE_BATTLE_QUESTIONS = [
  {
    id: 'bq_1',
    question: 'In physical or algorithmic systems, what is the primary consequence of increasing system constraint with fixed driving potential?',
    options: [
      { id: 'A', text: 'Net throughput decreases proportionally with higher resistance', correct: true },
      { id: 'B', text: 'Net throughput increases infinitely without power consumption', correct: false },
      { id: 'C', text: 'Variables become completely static and unmeasurable', correct: false },
      { id: 'D', text: 'The system reverses polarity instantly', correct: false }
    ],
    timeLimit: 15
  },
  {
    id: 'bq_2',
    question: 'Which time complexity characterizes finding an element in a balanced binary search tree of N nodes?',
    options: [
      { id: 'A', text: 'O(log N)', correct: true },
      { id: 'B', text: 'O(N^2)', correct: false },
      { id: 'C', text: 'O(1)', correct: false },
      { id: 'D', text: 'O(N log N)', correct: false }
    ],
    timeLimit: 15
  },
  {
    id: 'bq_3',
    question: 'What is the primary cellular currency used to perform biological work?',
    options: [
      { id: 'A', text: 'ATP (Adenosine Triphosphate)', correct: true },
      { id: 'B', text: 'DNA Polymerase', correct: false },
      { id: 'C', text: 'Hemoglobin', correct: false },
      { id: 'D', text: 'Ribosomal RNA', correct: false }
    ],
    timeLimit: 15
  }
];

export default function LiveQuiz() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const socket = getSocket();

  const username = localStorage.getItem('eduverse_player_name') || 'Guest Player';
  const avatar = localStorage.getItem('eduverse_player_avatar') || '🧑‍🚀';

  const [roomStatus, setRoomStatus] = useState('lobby');
  const [participants, setParticipants] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    socket.emit('join_room', { roomCode, username, avatar });

    socket.on('room_update', (data) => {
      setRoomStatus(data.status);
      setParticipants(data.participants || []);
    });

    socket.on('quiz_started', (data) => {
      setRoomStatus('active');
      setCurrentQIndex(data.questionIndex || 0);
      setTimeLeft(15);
      setSelectedOption(null);
      setHasAnswered(false);
    });

    socket.on('leaderboard_update', (data) => {
      setParticipants(data.participants || []);
    });

    socket.on('question_changed', (data) => {
      setCurrentQIndex(data.questionIndex);
      setTimeLeft(15);
      setSelectedOption(null);
      setHasAnswered(false);
    });

    socket.on('chat_received', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('room_update');
      socket.off('quiz_started');
      socket.off('leaderboard_update');
      socket.off('question_changed');
      socket.off('chat_received');
    };
  }, [roomCode]);

  useEffect(() => {
    if (roomStatus !== 'active' || hasAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [roomStatus, currentQIndex, hasAnswered]);

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      socket.emit('submit_answer', {
        roomCode,
        questionIndex: currentQIndex,
        isCorrect: false,
        timeRemaining: 0
      });
    }
  };

  const handleStartBattle = () => {
    socket.emit('start_quiz', { roomCode });
  };

  const handleOptionClick = (opt) => {
    if (hasAnswered) return;
    setSelectedOption(opt.id);
    setHasAnswered(true);

    const isCorrect = opt.correct === true;
    socket.emit('submit_answer', {
      roomCode,
      questionIndex: currentQIndex,
      isCorrect,
      timeRemaining: timeLeft
    });
  };

  const handleNextQuestion = () => {
    if (currentQIndex < SAMPLE_BATTLE_QUESTIONS.length - 1) {
      socket.emit('next_question', {
        roomCode,
        nextIndex: currentQIndex + 1
      });
    } else {
      setRoomStatus('finished');
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit('send_chat', { roomCode, message: chatInput.trim(), username });
    setChatInput('');
  };

  const currentQ = SAMPLE_BATTLE_QUESTIONS[currentQIndex] || SAMPLE_BATTLE_QUESTIONS[0];
  const isHost = participants.find((p) => p.username === username)?.isHost;

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-6 transition-colors">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-wider">LIVE MULTIPLAYER LOBBY</span>
            <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">Room: {roomCode}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>{participants.length} Players</span>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Grid: Left Battle Arena / Right Leaderboard & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Arena Section (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {roomStatus === 'lobby' ? (
            /* Lobby Waiting Room */
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-sm dark:shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/40 flex items-center justify-center text-3xl mx-auto">
                {avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {username}!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Waiting for the host to launch the battle...</p>
              </div>

              {/* Roster of joined players */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Joined Players ({participants.length})</span>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs"
                    >
                      <span>{p.avatar || '🧑‍🚀'}</span>
                      <span className="font-semibold">{p.username}</span>
                      {p.isHost && <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">(Host)</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              {isHost || participants.length === 1 ? (
                <button
                  onClick={handleStartBattle}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 mx-auto"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Battle Now</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span>Host will start the match shortly...</span>
                </div>
              )}
            </div>
          ) : roomStatus === 'active' ? (
            /* Live Question Arena */
            <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-sm dark:shadow-2xl">
              {/* Question Header & Countdown Timer */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    Question {currentQIndex + 1} of {SAMPLE_BATTLE_QUESTIONS.length}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Speed Arena</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-sm font-bold border transition ${
                    timeLeft <= 5 
                      ? 'bg-red-50 dark:bg-red-950/80 border-red-500 text-red-600 dark:text-red-300 animate-pulse' 
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-blue-700 dark:text-cyan-300'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Question Body */}
              <div className="space-y-6">
                <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  {currentQ.question}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let style = "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500/40 hover:bg-slate-100 dark:hover:bg-slate-800";
                    if (hasAnswered) {
                      if (opt.correct) style = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200";
                      else if (isSelected) style = "bg-red-50 dark:bg-red-950/80 border-red-500 text-red-800 dark:text-red-200";
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={hasAnswered}
                        onClick={() => handleOptionClick(opt)}
                        className={`p-4 rounded-2xl border text-left text-xs md:text-sm font-medium transition flex items-center justify-between ${style}`}
                      >
                        <span><span className="font-bold text-orange-600 dark:text-orange-400 mr-2">{opt.id}.</span>{opt.text}</span>
                        {hasAnswered && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback / Host Next Button */}
                {hasAnswered && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Answer locked in! Check the leaderboard.</span>
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
                    >
                      <span>{currentQIndex < SAMPLE_BATTLE_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Standings'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Final Standings */
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-sm dark:shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Battle Finished!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Outstanding effort! Check the final podium standings.</p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  Return to Quiz Hub
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Live Leaderboard & Chat (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Leaderboard */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Live Leaderboard</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Ranked by Score</span>
            </div>

            <div className="space-y-2">
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                    p.username === username
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-500/40'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-amber-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-base">{p.avatar || '🧑‍🚀'}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.username}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{p.score || 0} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In-Game Room Chat */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl flex flex-col h-64 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Room Chat</span>
            </h4>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {chatMessages.length === 0 ? (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">No messages yet. Say hello!</p>
              ) : (
                chatMessages.map((m) => (
                  <div key={m.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/40">
                    <span className="font-bold text-blue-600 dark:text-cyan-400 mr-1.5">{m.sender}:</span>
                    <span className="text-slate-700 dark:text-slate-200">{m.text}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="relative mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type reaction..."
                className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-orange-500 shadow-xs"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-orange-600 dark:text-orange-400 hover:opacity-80">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
