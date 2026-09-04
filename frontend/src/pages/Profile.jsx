import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Flame, 
  Clock, 
  BookOpen, 
  Award, 
  Shield, 
  Globe, 
  GraduationCap, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your student credentials, learning metrics, and account status.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-all shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
              alt="Profile" 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || "Pranjal"}</h2>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider">
                Pro Learner
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || "pranjal@eduverse.ai"}</p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-500" />
                {user?.streak || 12}-Day Streak
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                24.5h Learned
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/settings')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Account & Learning Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Curriculum & Preferences
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Target Grade / Level</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.educationLevel || "High School / Grade 10-12"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Instruction Language</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.preferredLanguage || "English"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Active Course</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Physics & Circuit Fundamentals</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            AI Tutor Badges & Stats
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Mastery Level</span>
              <span className="font-bold text-emerald-600">Level 4 (Advanced)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Completed Sessions</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">18 Sessions</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Misconceptions Resolved</span>
              <span className="font-bold text-blue-600">7 Concepts fixed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
