import React from 'react';
import { Zap, Activity, Brain, Calculator, Dna, Laptop, Layers, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const VisualCanvas = ({ visualData, concept = "Core Principles", topic = "Science" }) => {
  const { isDark } = useTheme();

  const cLower = `${concept} ${topic}`.toLowerCase();

  // Mode detection
  let mode = 'flowchart';
  if (cLower.includes('circuit') || cLower.includes('ohm') || cLower.includes('current') || cLower.includes('voltage') || cLower.includes('resistor')) {
    mode = 'circuit';
  } else if (cLower.includes('calculus') || cLower.includes('math') || cLower.includes('derivative') || cLower.includes('integral') || cLower.includes('equation')) {
    mode = 'equation';
  } else if (cLower.includes('photo') || cLower.includes('cell') || cLower.includes('dna') || cLower.includes('bio') || cLower.includes('gene')) {
    mode = 'biology';
  } else if (cLower.includes('binary') || cLower.includes('search') || cLower.includes('tree') || cLower.includes('sort') || cLower.includes('algorithm') || cLower.includes('code')) {
    mode = 'computerscience';
  }

  const title = visualData?.title || concept || topic;

  return (
    <div className={`w-full h-full rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative border shadow-2xl transition-colors ${
      isDark ? 'bg-[#0b101e] text-white border-slate-800' : 'bg-[#0f172a] text-white border-slate-700'
    }`}>
      {/* Whiteboard Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 z-10">
        <div className="flex items-center gap-2">
          {mode === 'circuit' ? <Zap className="w-4 h-4 text-cyan-400" /> :
           mode === 'equation' ? <Calculator className="w-4 h-4 text-purple-400" /> :
           mode === 'biology' ? <Dna className="w-4 h-4 text-emerald-400" /> :
           mode === 'computerscience' ? <Laptop className="w-4 h-4 text-blue-400" /> :
           <Activity className="w-4 h-4 text-cyan-400" />}
          <h3 className="font-bold text-xs md:text-sm tracking-wide text-cyan-200 line-clamp-1">
            {title}
          </h3>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Dynamic Blackboard</span>
        </div>
      </div>

      {/* Interactive Visual Display Canvas */}
      <div className="flex-1 flex items-center justify-center relative py-2 min-h-0">
        {mode === 'circuit' ? (
          /* Circuit Mode SVG */
          <svg viewBox="0 0 500 240" className="w-full max-h-52 select-none">
            <defs>
              <linearGradient id="wireGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <rect x="50" y="30" width="400" height="170" rx="16" fill="none" stroke="url(#wireGlow)" strokeWidth="3" strokeDasharray="8 6" />
            <g transform="translate(190, 18)">
              <rect x="0" y="0" width="120" height="26" fill="#0f172a" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="60" y="17" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                SOURCE (V)
              </text>
            </g>
            <g transform="translate(435, 75)">
              <rect x="-10" y="0" width="50" height="80" fill="#0f172a" rx="6" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M15,10 L5,22 L25,34 L5,46 L25,58 L15,70" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <text x="15" y="95" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                RESISTANCE (R)
              </text>
            </g>
            <g transform="translate(50, 115)">
              <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="0" y="4" fill="#34d399" fontSize="13" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                I
              </text>
              <text x="0" y="32" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                CURRENT
              </text>
            </g>
            <g transform="translate(250, 110)">
              <text x="0" y="0" fill="#38bdf8" fontSize="18" fontWeight="bold" textAnchor="middle">
                I = V / R
              </text>
              <text x="0" y="24" fill="#94a3b8" fontSize="11" textAnchor="middle">
                Throughput opposes Resistance
              </text>
            </g>
          </svg>
        ) : mode === 'biology' ? (
          /* Biological Mechanism SVG */
          <svg viewBox="0 0 500 240" className="w-full max-h-52 select-none">
            <circle cx="250" cy="120" r="90" fill="#064e3b" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="250" cy="120" r="45" fill="#047857" fillOpacity="0.6" stroke="#34d399" strokeWidth="2" />
            <text x="250" y="115" fill="#ecfdf5" fontSize="12" fontWeight="bold" textAnchor="middle">
              REACTION CORE
            </text>
            <text x="250" y="132" fill="#a7f3d0" fontSize="9" textAnchor="middle">
              Enzyme / Catalyst
            </text>

            <g transform="translate(70, 100)">
              <rect width="90" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="45" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">INPUT (Substrate)</text>
              <line x1="90" y1="20" x2="155" y2="20" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
            </g>

            <g transform="translate(340, 100)">
              <rect width="90" height="40" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <text x="45" y="24" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">PRODUCT (Energy)</text>
            </g>
          </svg>
        ) : mode === 'computerscience' ? (
          /* Tree / Algorithmic Graph SVG */
          <svg viewBox="0 0 500 240" className="w-full max-h-52 select-none">
            <g transform="translate(250, 40)">
              <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="0" y="4" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Root (N)</text>
            </g>
            <line x1="235" y1="58" x2="160" y2="105" stroke="#64748b" strokeWidth="2" />
            <line x1="265" y1="58" x2="340" y2="105" stroke="#64748b" strokeWidth="2" />

            <g transform="translate(150, 120)">
              <circle cx="0" cy="0" r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
              <text x="0" y="4" fill="#06b6d4" fontSize="10" fontWeight="bold" textAnchor="middle">&lt; Left</text>
            </g>
            <g transform="translate(350, 120)">
              <circle cx="0" cy="0" r="20" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
              <text x="0" y="4" fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">&gt; Right</text>
            </g>

            <g transform="translate(250, 200)">
              <text x="0" y="0" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                Binary Tree Partitioning: O(log N) Efficiency
              </text>
            </g>
          </svg>
        ) : mode === 'equation' ? (
          /* Mathematical Formula Derivation */
          <div className="text-center space-y-3 p-4">
            <div className="px-6 py-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 inline-block font-mono text-purple-200 text-lg md:text-xl font-bold shadow-lg">
              {"f'(x) = lim (Δx → 0) [f(x + Δx) - f(x)] / Δx"}
            </div>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Instantaneous rate of change computed by evaluating the tangent slope as the interval approaches zero.
            </p>
          </div>
        ) : (
          /* General System Flowchart */
          <div className="flex items-center justify-center gap-3 w-full px-4 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-blue-300 text-center flex-1">
              1. Input Parameter
            </div>
            <span className="text-slate-500 font-bold">→</span>
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-cyan-300 text-center flex-1">
              2. Governing Rule
            </div>
            <span className="text-slate-500 font-bold">→</span>
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center flex-1">
              3. Measured Output
            </div>
          </div>
        )}
      </div>

      {/* Concept Key Matrix */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-blue-400 font-bold">Driving Variable</div>
          <div className="text-slate-400 truncate">Stimulus / Input</div>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-emerald-400 font-bold">Core Principle</div>
          <div className="text-slate-400 truncate">Governing Laws</div>
        </div>
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <div className="text-rose-400 font-bold">Boundary Rule</div>
          <div className="text-slate-400 truncate">System Response</div>
        </div>
      </div>
    </div>
  );
};

export default VisualCanvas;
