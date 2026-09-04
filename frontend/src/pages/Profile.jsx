import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-6">
        <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt="Profile" className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-500/20" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || "Pranjal"}</h2>
          <p className="text-xs text-slate-400">{user?.email || "pranjal@eduverse.ai"}</p>
          <div className="flex gap-2 pt-2 text-[11px]">
            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold rounded-md">🔥 12-Day Streak</span>
            <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold rounded-md">⏱ 24.5h Learned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
