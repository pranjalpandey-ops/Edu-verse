import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, Search, Sparkles, Play, Clock, Award, ArrowRight, 
  Layers, CheckCircle2, Link as LinkIcon 
} from 'lucide-react';
import { youtubeAPI } from '../services/api';

export default function YouTubeLearning() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('Quantum Physics');
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos('Quantum Physics');
  }, []);

  const fetchVideos = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await youtubeAPI.search(searchTerm);
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error('Error fetching youtube videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) fetchVideos(query.trim());
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const videoId = match ? match[1] : 'custom_video';
    navigate(`/youtube/${videoId}?topic=${encodeURIComponent('YouTube Study Session')}`);
  };

  const handleSelectVideo = (video) => {
    navigate(`/youtube/${video.videoId}?topic=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 transition-colors">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-red-100 via-rose-50 to-orange-100 dark:from-red-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-red-200 dark:border-red-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/30 text-red-600 dark:text-red-400 text-xs font-semibold tracking-wide">
            <Video className="w-3.5 h-3.5" />
            <span>AI YOUTUBE LEARNING ENGINE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Learn From Any <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-300 bg-clip-text text-transparent">YouTube Video</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Paste any YouTube link or search educational masterclasses. EduVerse AI extracts interactive transcripts, answers questions with timestamp citations, generates video quizzes, and creates revision notes.
          </p>

          {/* Paste URL or Search Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 dark:text-red-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search educational videos (e.g. Calculus, DNA, MIT)..."
                className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-red-500 text-sm shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition"
              >
                Search
              </button>
            </form>

            {/* Paste Link */}
            <form onSubmit={handleUrlSubmit} className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste any YouTube URL (https://youtube.com/watch?v=...)"
                className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500 text-sm shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
              >
                Launch AI
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-yellow-400" />
            <span>Top Ranked Videos for "{query}"</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{videos.length} educational sources evaluated</span>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((vid, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectVideo(vid)}
                className="group rounded-3xl p-4 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-700/50">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                      {vid.badge}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-200">
                      {vid.duration}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-300 transition">
                      {vid.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{vid.channelTitle} • {vid.views}</p>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/40">
                    <span className="text-red-600 dark:text-red-400 font-semibold">Match {vid.matchScore}%: </span>
                    {vid.whyRecommended}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-medium pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span>Start AI Interactive Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
