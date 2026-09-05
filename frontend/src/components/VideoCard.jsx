import React from 'react';
import { Play, CheckCircle2, Clock, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video, onSelect }) => {
  const navigate = useNavigate();

  const handleWatch = () => {
    if (onSelect) {
      onSelect(video);
    } else {
      navigate(`/youtube/${video.videoId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Thumbnail & Badges */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {video.badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white font-extrabold text-[10px] backdrop-blur-md shadow-sm">
                {video.badge}
              </span>
            )}
            {video.matchScore && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white font-bold text-[10px] backdrop-blur-md">
                {video.matchScore}% Match
              </span>
            )}
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
            {video.duration}
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium truncate max-w-[140px]">{video.channelTitle}</span>
            <span className="text-[11px]">{video.views}</span>
          </div>
        </div>

        {/* Recommendation Reason */}
        {video.whyRecommended && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-tight">{video.whyRecommended}</p>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleWatch}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch & Learn with AI</span>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
