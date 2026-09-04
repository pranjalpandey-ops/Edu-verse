import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Monitor, CheckCircle2, Sparkles, Volume2, ShieldCheck, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your AI tutor classroom environment, appearance, and pedagogical preferences.
        </p>
      </div>

      {/* Theme & Appearance Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Theme & Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between high-contrast Dark Mode or crisp Light Mode
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            Currently: {isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        {/* Interactive Mode Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <div
            onClick={() => { if (isDark) toggleTheme(); }}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 select-none ${!isDark ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </div>
              {!isDark && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean whiteboard aesthetic, ideal for daytime study and well-lit environments.
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); if (isDark) toggleTheme(); }}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${!isDark ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'}`}
            >
              {!isDark ? "Active Mode" : "Switch to Light Mode"}
            </button>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => { if (!isDark) toggleTheme(); }}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 select-none ${isDark ? 'border-indigo-500 bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
              </div>
              {isDark && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-focus dark classroom canvas with neon schematic glowing highlights.
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); if (!isDark) toggleTheme(); }}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'}`}
            >
              {isDark ? "Active Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Other Classroom Configurations */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
          AI Educator Profile
        </h3>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">AI Teacher Avatar</p>
              <p className="text-slate-400 text-[11px]">ARIA (Warm, encouraging, visual educator)</p>
            </div>
          </div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">Configured</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Speech Synthesis & Audio</p>
              <p className="text-slate-400 text-[11px]">Web Speech API / ElevenLabs Neural TTS</p>
            </div>
          </div>
          <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">Active</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">Misconception Interceptor</p>
              <p className="text-slate-400 text-[11px]">Real-time cognitive error diagnosis & water pipe analogy</p>
            </div>
          </div>
          <span className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">Enabled</span>
        </div>
      </div>

      {/* Account Session Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-rose-200/60 dark:border-rose-950 shadow-sm space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
          Account & Session
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">{user?.name || "Pranjal"}</p>
              <p className="text-slate-400 text-[11px]">Signed in as {user?.email || "pranjal@eduverse.ai"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of EduVerse</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

