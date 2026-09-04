import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  GraduationCap, 
  FolderOpen, 
  GitFork, 
  BarChart3, 
  RotateCcw, 
  HelpCircle, 
  FileText, 
  Settings, 
  Moon, 
  Sun,
  Flame,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Teacher', path: '/teacher', icon: Sparkles, badge: 'Active' },
    { label: 'Learn', path: '/create-lesson', icon: GraduationCap },
    { label: 'My Materials', path: '/materials', icon: FolderOpen },
    { label: 'Learning Path', path: '/learning-path', icon: GitFork },
    { label: 'Progress', path: '/report', icon: BarChart3 },
    { label: 'Revision', path: '/revision', icon: RotateCcw },
    { label: 'Assessments', path: '/assessments', icon: HelpCircle },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 select-none z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-6 pb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                EduVerse <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-500" />
                Learning Streak: {user?.streak || 12} Days
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </div>
                {item.label === 'AI Teacher' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Bottom Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <button 
          onClick={() => navigate('/settings')}
          className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade to Pro
        </button>

        <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>Theme</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
            title="Log out of account"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
