import React from 'react';
import { Zap, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const VisualCanvas = ({ visualData, concept = "Ohm's Law" }) => {
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative border shadow-2xl transition-colors ${isDark ? 'bg-[#0b101e] text-white border-slate-800' : 'bg-[#0f172a] text-white border-slate-700'}`}>
      {/* Whiteboard Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm tracking-wide text-cyan-200">
            OHM'S LAW: <span className="text-amber-400 font-mono">V = I × R</span>
          </h3>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Interactive Circuit Model
        </div>
      </div>

      {/* Interactive Circuit Schematic SVG */}
      <div className="flex-1 flex items-center justify-center relative py-2">
        <svg viewBox="0 0 500 240" className="w-full max-h-56 select-none">
          <defs>
            <linearGradient id="wireGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Circuit Loop Outline */}
          <rect 
            x="50" y="30" width="400" height="170" rx="16" 
            fill="none" 
            stroke="url(#wireGlow)" 
            strokeWidth="3" 
            strokeDasharray="8 6"
            className="animate-[dash_12s_linear_infinite]"
          />

          {/* Top Branch: Battery (Voltage Source V) */}
          <g transform="translate(190, 18)">
            <rect x="0" y="0" width="120" height="26" fill="#0f172a" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="60" y="17" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              BATTERY: 12V (V)
            </text>
          </g>

          {/* Right Branch: Resistor ZigZag (R) */}
          <g transform="translate(435, 75)">
            <rect x="-10" y="0" width="50" height="80" fill="#0f172a" rx="6" stroke="#ef4444" strokeWidth="1.5" />
            {/* Zigzag shape */}
            <path d="M15,10 L5,22 L25,34 L5,46 L25,58 L15,70" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="15" y="95" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
              R = 4 Ω
            </text>
          </g>

          {/* Left Branch: Ammeter (Current Flow I) */}
          <g transform="translate(50, 115)">
            <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="0" y="4" fill="#34d399" fontSize="13" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
              A
            </text>
            <text x="0" y="32" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
              I = 3A
            </text>
          </g>

          {/* Center Dynamic Formula & Status */}
          <g transform="translate(250, 110)">
            <text x="0" y="0" fill="#38bdf8" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              I = V / R
            </text>
            <text x="0" y="24" fill="#94a3b8" fontSize="11" textAnchor="middle">
              Current = (12 Volts) / (4 Ohms) = 3 Amps
            </text>
          </g>

          {/* Moving Electron Particles */}
          <circle cx="120" cy="30" r="3" fill="#38bdf8">
            <animate attributeName="cx" values="50;450" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="450" cy="115" r="3" fill="#f87171">
            <animate attributeName="cy" values="30;200" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="200" r="3" fill="#38bdf8">
            <animate attributeName="cx" values="450;50" dur="4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Concept Key Matrix */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-blue-400 font-bold">Voltage (V)</div>
          <div className="text-slate-400">Potential Difference</div>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-emerald-400 font-bold">Current (I)</div>
          <div className="text-slate-400">Electron Flow Rate (A)</div>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-rose-400 font-bold">Resistance (R)</div>
          <div className="text-slate-400">Opposition to Flow (Ω)</div>
        </div>
      </div>
    </div>
  );
};

export default VisualCanvas;
