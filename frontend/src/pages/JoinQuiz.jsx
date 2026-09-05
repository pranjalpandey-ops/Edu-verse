import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, ArrowRight, ArrowLeft, User, Sparkles } from 'lucide-react';

const AVATARS = ['🧑‍🚀', '⚡', '🦉', '🚀', '🧠', '🔬', '🌟', '🎯'];

export default function JoinQuiz() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('Player_' + Math.floor(100 + Math.random() * 900));
  const [selectedAvatar, setSelectedAvatar] = useState('🧑‍🚀');

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    const cleanCode = roomCode.trim().toUpperCase();
    localStorage.setItem('eduverse_player_name', username);
    localStorage.setItem('eduverse_player_avatar', selectedAvatar);
    navigate(`/live-quiz/${cleanCode}`);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 p-4 md:p-8 max-w-md mx-auto flex flex-col justify-center space-y-6 transition-colors">
      <button
        onClick={() => navigate('/quiz')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quiz Hub</span>
      </button>

      <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-6 shadow-sm dark:shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mx-auto">
            <Swords className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Join Live Quiz Arena</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter your lobby code to battle classmates in real-time</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Room Code</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. EDU-4921"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-center font-mono font-bold tracking-widest text-lg focus:outline-hidden focus:border-orange-500 shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Your Nickname</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Choose Avatar</label>
            <div className="flex justify-between gap-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition ${
                    selectedAvatar === av
                      ? 'bg-orange-100 dark:bg-orange-600/30 border border-orange-500 scale-110 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!roomCode.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-40"
          >
            <span>Enter Battle Lobby</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
