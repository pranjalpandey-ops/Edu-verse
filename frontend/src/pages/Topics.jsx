import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, Atom, Calculator, Dna, Laptop, Globe, Flame, 
  ArrowRight, Sparkles, BookOpen, Layers, Search, ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'physics',
    name: 'Physics & Engineering',
    icon: Atom,
    color: 'from-blue-600 to-cyan-500',
    borderColor: 'border-blue-200 dark:border-blue-500/30',
    topics: [
      { name: 'Quantum Superposition & Entanglement', duration: '25m', level: 'Advanced' },
      { name: 'Thermodynamics & Carnot Cycle', duration: '20m', level: 'Intermediate' },
      { name: 'Electromagnetism & Maxwell Equations', duration: '30m', level: 'Advanced' },
      { name: 'Special Relativity & Time Dilation', duration: '20m', level: 'Intermediate' }
    ]
  },
  {
    id: 'cs',
    name: 'Computer Science & AI',
    icon: Laptop,
    color: 'from-cyan-600 to-teal-500',
    borderColor: 'border-cyan-200 dark:border-cyan-500/30',
    topics: [
      { name: 'Binary Search Trees & Red-Black Balancing', duration: '25m', level: 'Intermediate' },
      { name: 'Dynamic Programming & Memoization', duration: '30m', level: 'Advanced' },
      { name: 'Transformer Attention & LLM Architectures', duration: '35m', level: 'Advanced' },
      { name: 'Graph Traversal (BFS & DFS) Algorithms', duration: '20m', level: 'Beginner' }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics & Calculus',
    icon: Calculator,
    color: 'from-indigo-600 to-purple-500',
    borderColor: 'border-indigo-200 dark:border-indigo-500/30',
    topics: [
      { name: 'Differential Calculus & Chain Rule', duration: '20m', level: 'Intermediate' },
      { name: 'Linear Algebra & Eigenvalues', duration: '30m', level: 'Advanced' },
      { name: 'Multivariate Integration & Stokes Theorem', duration: '35m', level: 'Advanced' },
      { name: 'Probability Distributions & Bayes Theorem', duration: '25m', level: 'Intermediate' }
    ]
  },
  {
    id: 'biology',
    name: 'Biology & Genetics',
    icon: Dna,
    color: 'from-emerald-600 to-green-500',
    borderColor: 'border-emerald-200 dark:border-emerald-500/30',
    topics: [
      { name: 'Photosynthesis & Light-Independent Reactions', duration: '20m', level: 'Intermediate' },
      { name: 'DNA Replication & CRISPR Gene Editing', duration: '30m', level: 'Advanced' },
      { name: 'Cellular Respiration & Krebs Cycle', duration: '25m', level: 'Intermediate' },
      { name: 'Neural Synapses & Action Potential', duration: '20m', level: 'Intermediate' }
    ]
  },
  {
    id: 'humanities',
    name: 'History & Economics',
    icon: Globe,
    color: 'from-amber-600 to-orange-500',
    borderColor: 'border-amber-200 dark:border-amber-500/30',
    topics: [
      { name: 'Industrial Revolution & Economic Paradigms', duration: '20m', level: 'Beginner' },
      { name: 'Game Theory & Nash Equilibrium', duration: '25m', level: 'Intermediate' },
      { name: 'Cold War Geopolitics & Space Race', duration: '25m', level: 'Beginner' },
      { name: 'Inflation, Monetary Policy & Central Banks', duration: '20m', level: 'Intermediate' }
    ]
  }
];

export default function Topics() {
  const navigate = useNavigate();
  const [customTopic, setCustomTopic] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleLaunchTopic = (topicName) => {
    navigate(`/search?q=${encodeURIComponent(topicName)}`);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      handleLaunchTopic(customTopic.trim());
    }
  };

  const filteredCategories = activeCategory === 'all' 
    ? CATEGORIES 
    : CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 transition-colors">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-cyan-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            <span>KNOWLEDGE EXPLORER</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Topics or <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Teach Me Anything</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Select from core STEM domains or type any arbitrary topic in the world. EduVerse AI creates a tailored pedagogical journey instantly.
          </p>

          {/* Arbitrary Prompt Input */}
          <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Teach me anything (e.g. Black Holes, Microeconomics, Rust Async)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm md:text-base shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Domains
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div 
              key={category.id} 
              className={`rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900/60 border ${category.borderColor} backdrop-blur-xl space-y-6 shadow-xs`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Curated foundational modules & active recall paths</p>
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLaunchTopic(topic.name)}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-500/40 transition cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700/60 text-slate-700 dark:text-cyan-300">
                          {topic.level}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{topic.duration}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition">
                        {topic.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium pt-2 border-t border-slate-200 dark:border-slate-700/40">
                      <span>Explore & Learn</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
