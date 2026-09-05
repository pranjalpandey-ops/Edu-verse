import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { youtubeAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import { useNavigate, useSearchParams } from 'react-router-dom';

const YouTubeLearning = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Binary Search Algorithm';
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [level, setLevel] = useState('All');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch(initialQuery);
  }, []);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await youtubeAPI.search(q, { level, language, duration });
      if (res.data?.success) {
        setVideos(res.data.videos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bestMatch = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          YouTube Learning Hub
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search, watch, and learn from top educational masterclasses with live AI transcript grounding, notes, and quizzes.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to learn? (e.g. Binary Search, Photosynthesis, Thermodynamics)"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            {loading ? 'Finding Videos...' : 'Search'}
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
          </select>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="All">Any Duration</option>
            <option value="Short">Short (&lt; 10m)</option>
            <option value="Medium">Medium (10m - 30m)</option>
            <option value="Long">Long (&gt; 30m)</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold">Personalizing recommendations with EduVerse AI...</p>
        </div>
      )}

      {/* Results */}
      {!loading && videos.length > 0 && (
        <div className="space-y-6">
          {/* Best Match Hero Card */}
          {bestMatch && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>TOP AI RECOMMENDATION FOR YOU</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-blue-200 dark:border-blue-800/60 shadow-md">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group">
                  <img
                    src={bestMatch.thumbnail}
                    alt={bestMatch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md">
                    {bestMatch.matchScore}% Match
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white font-mono text-xs font-bold">
                    {bestMatch.duration}
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                      {bestMatch.difficulty}
                    </span>
                    <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {bestMatch.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {bestMatch.channelTitle} • {bestMatch.views}
                    </p>
                    {bestMatch.whyRecommended && (
                      <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300">
                        <strong className="text-blue-700 dark:text-cyan-400 block mb-0.5">Why recommended:</strong>
                        {bestMatch.whyRecommended}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/youtube/${bestMatch.videoId}?topic=${encodeURIComponent(query)}`)}
                    className="w-full py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch & Learn with AI</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Videos Grid */}
          {otherVideos.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Other Recommended Masterclasses
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherVideos.map((vid) => (
                  <VideoCard
                    key={vid.videoId}
                    video={vid}
                    onSelect={(v) => navigate(`/youtube/${v.videoId}?topic=${encodeURIComponent(query)}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeLearning;
