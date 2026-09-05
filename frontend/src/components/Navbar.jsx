import React, { useState } from 'react';
import { 
  Search, Globe, Bell, Sparkles, Sun, Moon, LogOut, User, 
  Settings as SettingsIcon, Video, Trophy, Target, BookOpen, 
  Play, Calendar, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, NavLink, Link } from 'react-router-dom';

const Navbar = ({ onLanguageChange, currentLanguage = 'English' }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    'English', 'Hindi', 'Hinglish', 'Bengali', 'Tamil', 
    'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Spanish', 'French'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Top Primary Learning Links
  const topNavLinks = [
    { label: 'AI Classroom', path: '/teacher', icon: Sparkles, badge: 'Live', highlight: true },
    { label: 'Formulas & Vault', path: '/revision', icon: BookOpen },
    { label: 'Schedule & Calendar', path: '/study-plan', icon: Calendar },
    { label: 'YouTube Learn', path: '/youtube', icon: Video },
    { label: 'Live Arena', path: '/quiz', icon: Trophy }
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 transition-colors gap-4">
      {/* 1. Left Primary Learning Navigation Pills */}
      <div className="hidden lg:flex items-center gap-1.5">
        {topNavLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25' 
                  : item.highlight
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'}
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* 2. Center Working Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-auto">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any concept, chapter or formula (e.g. Wave Optics, Calculus)..."
          className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/70 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
        />
        {searchQuery ? (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-md">
            ↵ Enter
          </kbd>
        )}
      </form>

      {/* 3. Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }}
            className="px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">{currentLanguage}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Teaching Language
              </div>
              <div className="max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      if (onLanguageChange) onLanguageChange(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/60 flex items-center justify-between ${currentLanguage === lang ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>{lang}</span>
                    {currentLanguage === lang && <Sparkles className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <div 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowLangMenu(false); }}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
              alt={user?.name || "Student"} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40 group-hover:ring-blue-500 transition-all"
            />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              {/* User Header */}
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || "Pranjal"}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || "pranjal@eduverse.ai"}</p>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Student Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Settings & Theme</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
