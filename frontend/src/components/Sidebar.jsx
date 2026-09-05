import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search,
  Compass,
  Sparkles, 
  BarChart3, 
  FolderOpen, 
  FileText, 
  Settings, 
  Moon, 
  Sun,
  Flame,
  LogOut,
  Layers,
  BookOpen
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

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Search & Learn', path: '/search', icon: Search, badge: 'AI' },
    { label: 'Explore Topics', path: '/topics', icon: Compass },
  ];

  const toolsNavItems = [
    { label: 'Document RAG / Notes', path: '/materials', icon: FolderOpen },
    { label: 'My Notes & Bookmarks', path: '/notes', icon: FileText },
    { label: 'Learning DNA & Progress', path: '/progress', icon: BarChart3 },
  ];

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 select-none z-20 transition-colors duration-200">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="p-5 pb-3 cursor-pointer shrink-0" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                EduVerse <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Streak: {user?.streak || 7} Days Active
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
          {/* Main Navigation Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Navigation
            </span>
            <div className="space-y-0.5 pt-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-blue-500/30 shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-80 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-500/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Tools & Study Library Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Study Library
            </span>
            <div className="space-y-0.5 pt-1">
              {toolsNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-blue-500/30 shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 opacity-80 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Actions */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1 shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
            ${isActive 
              ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-cyan-300 font-semibold border border-blue-200 dark:border-blue-500/30' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'}
          `}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>

        <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span className="text-xs font-semibold">{isDark ? "Light" : "Dark"}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-semibold transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
