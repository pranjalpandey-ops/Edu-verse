import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, UserCheck, MessageSquare } from 'lucide-react';

const TeacherAvatar = ({ state = 'speaking', currentSpeech = '', isMuted = false }) => {
  const [barHeights, setBarHeights] = useState([40, 75, 55, 90, 60, 45, 80]);

  useEffect(() => {
    if (state === 'speaking') {
      const interval = setInterval(() => {
        setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 65) + 30));
      }, 120);
      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-end shadow-inner group">
      {/* Background Avatar Image with Modern Classroom / Studio setting */}
      <img 
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85" 
        alt="ARIA - AI Teacher"
        className={`w-full h-full object-cover object-top transition-all duration-700 ${state === 'speaking' ? 'scale-[1.01]' : 'scale-100 filter brightness-95'}`}
      />

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

      {/* Live State & Audio Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 text-white text-[11px] font-semibold">
          <span className={`w-2 h-2 rounded-full ${state === 'speaking' ? 'bg-emerald-400 animate-ping' : state === 'thinking' ? 'bg-amber-400 animate-pulse' : 'bg-indigo-400'}`}></span>
          <span>ARIA • {state === 'speaking' ? 'Explaining' : state === 'thinking' ? 'Analyzing' : 'Ready'}</span>
        </div>
      </div>

      {/* Audio Waveform Live Visualizer */}
      {state === 'speaking' && !isMuted && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 mr-1 animate-pulse" />
          {barHeights.map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full transition-all duration-100"
              style={{ height: `${h * 0.25}px` }}
            />
          ))}
        </div>
      )}

      {/* Subtitles / Closed Captions */}
      {currentSpeech && (
        <div className="absolute bottom-3 left-4 right-20 z-10">
          <div className="bg-slate-900/85 backdrop-blur-md text-slate-100 text-xs px-3.5 py-2 rounded-xl border border-white/10 shadow-lg line-clamp-2 leading-relaxed">
            "{currentSpeech}"
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAvatar;
