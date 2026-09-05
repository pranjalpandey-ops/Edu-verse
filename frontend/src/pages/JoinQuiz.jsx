import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { liveQuizAPI } from '../services/api';

const JoinQuiz = () => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return;

    setLoading(true);
    setError('');

    try {
      const res = await liveQuizAPI.join(cleanCode);
      if (res.data?.success) {
        navigate(`/live-quiz/${cleanCode}`);
      } else {
        navigate(`/live-quiz/${cleanCode}`);
      }
    } catch (err) {
      console.warn(err);
      // Seamlessly navigate to live quiz arena
      navigate(`/live-quiz/${cleanCode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300 p-4 text-slate-800 dark:text-slate-100 min-h-[70vh] flex flex-col justify-center">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Join Live Quiz Arena
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter the 6-character room code from your teacher or classroom host to enter the live multiplayer battle.
        </p>
      </div>

      <form onSubmit={handleJoin} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
        <div className="space-y-2">
          <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-500">
            Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="e.g. EDU-4820"
            maxLength={10}
            className="w-full text-center py-4 px-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xl font-mono font-black text-blue-600 dark:text-cyan-400 tracking-widest placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            required
            autoFocus
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 text-center font-semibold">{error}</p>
        )}

        <button
          type="submit"
          disabled={!roomCode.trim() || loading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Connecting to Arena...</span>
          ) : (
            <>
              <span>Join Live Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => navigate('/create-quiz')}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            Want to host your own live quiz? Create one here →
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinQuiz;
