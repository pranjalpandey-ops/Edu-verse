import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Atom, 
  Compass, 
  Code2, 
  Cpu, 
  Layers, 
  Radio, 
  Globe2, 
  Activity, 
  BookOpen, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  BarChart2,
  Sliders,
  Award,
  Heart,
  Clock,
  UploadCloud,
  HelpCircle,
  Smile,
  Sun,
  Moon
} from 'lucide-react';
import EarthCanvas from '../components/EarthCanvas';
import { useTheme } from '../context/ThemeContext';

const STUDENT_BENEFITS = [
  { name: "TALK NATURALLY", tag: "Speak & listen freely" },
  { name: "VISUAL BLACKBOARD", tag: "Live diagrams & math" },
  { name: "CLEARS UP DOUBTS", tag: "Relatable analogies" },
  { name: "UPLOAD NOTES", tag: "PDFs into study plans" },
  { name: "MATCHES YOUR PACE", tag: "Never rushes you" },
  { name: "STEP-BY-STEP MATH", tag: "Detailed derivations" },
  { name: "24/7 AVAILABILITY", tag: "Always ready before exams" },
  { name: "100% FREE TO START", tag: "Begin in 30 seconds" }
];

const STUDY_STEPS = [
  { num: "01", name: "Check Your Level", tag: "Friendly Start", desc: "Quickly checks what you already know so you never waste time on basics you've already mastered." },
  { num: "02", name: "Custom Study Plan", tag: "Personal Roadmap", desc: "Builds a clear, manageable roadmap tailored to your specific exam syllabus, homework, or study goals." },
  { num: "03", name: "Simple Explanations", tag: "Real-Life Analogies", desc: "Breaks down complicated concepts using intuitive, everyday analogies before showing formal math." },
  { num: "04", name: "Live Demonstration", tag: "Visual Blackboard", desc: "Draws live diagrams and solves example problems step-by-step so you clearly see the 'why' behind each step." },
  { num: "05", name: "Friendly Check-Ins", tag: "Concept Verification", desc: "Asks gentle, quick questions to confirm you're following along before moving forward." },
  { num: "06", name: "Clear Up Doubts", tag: "Instant Relief", desc: "Spots exactly where you're getting stuck and explains it with a fresh, easier example." },
  { num: "07", name: "Matches Your Speed", tag: "No Pressure", desc: "Slows down on tricky topics and speeds up when you're confident—you are always in total control." },
  { num: "08", name: "Level Up & Retain", tag: "Exam Confidence", desc: "Helps you master advanced problems with fun practice questions that keep your memory sharp." }
];

const CURRICULUM_TRACKS = [
  {
    id: 'physics',
    category: 'physics',
    title: 'Physics & Circuit Basics',
    subtitle: "Electric circuits, voltage, resistance, and magnetic forces made easy.",
    icon: Zap,
    challenges: '16 Lessons',
    difficulty: 'Beginner to Advanced',
    tags: ['Circuits', 'Voltage', 'Resistance', 'Electromagnetism']
  },
  {
    id: 'algorithms',
    category: 'cs',
    title: 'Computer Science & Coding',
    subtitle: 'Binary search, trees, algorithms, and data structures step by step.',
    icon: Code2,
    challenges: '24 Lessons',
    difficulty: 'All Levels',
    tags: ['Algorithms', 'Binary Search', 'Logic', 'Problem Solving']
  },
  {
    id: 'quantum',
    category: 'physics',
    title: 'Quantum Physics & Waves',
    subtitle: 'Wave-particle duality, photons, and quantum basics explained simply.',
    icon: Atom,
    challenges: '12 Lessons',
    difficulty: 'High School & College',
    tags: ['Light', 'Waves', 'Photons', 'Energy']
  },
  {
    id: 'calculus',
    category: 'math',
    title: 'Calculus & Problem Solving',
    subtitle: 'Derivatives, integrals, limits, and equations with clear visual steps.',
    icon: Compass,
    challenges: '18 Lessons',
    difficulty: 'All Levels',
    tags: ['Derivatives', 'Integrals', 'Limits', 'Algebra']
  },
  {
    id: 'biochem',
    category: 'biology',
    title: 'Biology & Genetics',
    subtitle: 'DNA replication, cell structure, enzymes, and genetics made intuitive.',
    icon: Cpu,
    challenges: '14 Lessons',
    difficulty: 'High School & College',
    tags: ['DNA', 'Genetics', 'Enzymes', 'Cells']
  }
];

const LANDING_GRADES_DATA = {
  'class-9': {
    title: 'Class 9th Foundation',
    tag: 'Motion, Matter & Polynomials',
    subjects: [
      { name: 'Physics: Motion & Gravitation', formula: 'v = u + at | F = G*(m1*m2)/r²', desc: 'Laws of motion, work, energy and universal gravitation.' },
      { name: 'Chemistry: Matter & Atoms', formula: 'Mole = Mass / Molar Mass | 6.022×10²³', desc: 'Atomic structure, chemical formulas and states of matter.' },
      { name: 'Mathematics: Polynomials & Geometry', formula: '(a+b)² = a² + 2ab + b² | Area = ½*b*h', desc: 'Euclidean geometry, linear equations and factorization.' },
      { name: 'Biology: Cell & Tissues', formula: 'ATP Energy Cycle & Cell Organelles', desc: 'Fundamental unit of life, plant/animal tissues and diversity.' }
    ]
  },
  'class-10': {
    title: 'Class 10th Board Mastery',
    tag: 'Electricity, Optics, Reactions & Trig',
    subjects: [
      { name: 'Physics: Light & Electricity', formula: '1/f = 1/v + 1/u | V = I*R | P = V*I', desc: 'Mirror & lens equations, Ohm’s law and electromagnetic effects.' },
      { name: 'Chemistry: Chemical Reactions & Acids', formula: 'pH = -log[H⁺] | Redox Balancing', desc: 'Reactions, salts, metals/non-metals and carbon compounds.' },
      { name: 'Mathematics: Trigonometry & Quadratic', formula: 'sin²θ + cos²θ = 1 | x = (-b±√(b²-4ac))/(2a)', desc: 'Identities, heights & distances, AP series and circles.' },
      { name: 'Biology: Life Processes & Heredity', formula: 'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', desc: 'Nutrition, respiration, circulation, nervous system and genetics.' }
    ]
  },
  'class-11': {
    title: 'Class 11th Advanced Prep',
    tag: 'Mechanics, Thermodynamics & Calculus',
    subjects: [
      { name: 'Physics: Kinematics & Mechanics', formula: 'F = dp/dt | L = Iω | W = ∫F·dx', desc: 'Rotational dynamics, gravitation, SHM and wave motion.' },
      { name: 'Chemistry: Structure & Thermodynamics', formula: 'ΔG = ΔH - TΔS | PV = nRT', desc: 'Chemical bonding, hybridization, equilibrium and organic chemistry.' },
      { name: 'Mathematics: Coordinate & Calculus', formula: 'd/dx(xⁿ) = n·xⁿ⁻¹ | lim(x→0)(sin x / x) = 1', desc: 'Limits, derivatives, conic sections, permutations and binomial theorem.' },
      { name: 'Biology: Biomolecules & Physiology', formula: 'Enzyme Kinetics & Cellular Respiration (Krebs Cycle)', desc: 'Cell cycle, plant physiology and human body systems.' }
    ]
  },
  'class-12': {
    title: 'Class 12th Board & Competitive (JEE/NEET)',
    tag: 'Electromagnetism, Integrals & Genetics',
    subjects: [
      { name: 'Physics: Electrodynamics & Optics', formula: 'F = k*q1*q2/r² | 1/f = (n-1)(1/R1 - 1/R2) | dB = (μ₀/4π)(I dl sinθ)/r²', desc: 'Coulomb’s law, Biot-Savart, electromagnetic induction and wave optics.' },
      { name: 'Chemistry: Kinetics & Coordination', formula: 'k = A·e^(-Ea/RT) | E = E° - (0.0591/n)log(Q)', desc: 'Electrochemistry, Nernst equation, rate laws and organic reaction mechanisms.' },
      { name: 'Mathematics: Integrals, Vectors & 3D', formula: '∫u v dx = u∫v dx - ∫(u\' ∫v dx)dx | |(a2-a1)·(b1×b2)|/|b1×b2|', desc: 'Definite integrals, 3D geometry, matrices and differential equations.' },
      { name: 'Biology: Genetics & Biotechnology', formula: 'Central Dogma: DNA → mRNA → Protein (Polymerase Chain Reaction)', desc: 'Molecular basis of inheritance, DNA replication, recombinant DNA and ecology.' }
    ]
  }
};

const LANDING_EXAM_PREVIEW = [
  { name: 'CBSE Class 12 Physics Pre-Board', days: 10, date: 'Sept 15', badge: 'Board Exam' },
  { name: 'Class 12 Math Term Assessment', days: 17, date: 'Sept 22', badge: 'Term Test' },
  { name: 'JEE / NEET All-India Mock Test 3', days: 23, date: 'Sept 28', badge: 'National Mock' }
];

const Landing = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTrackCategory, setActiveTrackCategory] = useState('all');
  const [selectedLandingGrade, setSelectedLandingGrade] = useState('class-12');

  const filteredTracks = activeTrackCategory === 'all' 
    ? CURRICULUM_TRACKS 
    : CURRICULUM_TRACKS.filter(t => t.category === activeTrackCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030611] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden relative transition-colors duration-200">
      
      {/* 1. Deep Space / Atmospheric Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 dark:from-blue-600/15 via-cyan-500/5 dark:via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 dark:from-blue-500/15 via-indigo-600/5 dark:via-indigo-600/10 to-transparent blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 -left-20 w-[500px] h-[500px] bg-blue-950/15 dark:bg-blue-950/25 blur-[130px] pointer-events-none -z-10" />
      
      {/* Space Perspective Grid Overlay */}
      <div className="fixed inset-0 perspective-grid opacity-20 dark:opacity-30 pointer-events-none -z-10" />

      {/* 2. Top Minimalist Floating Navbar */}
      <header className="px-6 md:px-12 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] sticky top-0 bg-white/80 dark:bg-[#030611]/80 backdrop-blur-xl z-50 transition-colors">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-white dark:bg-[#030714] rounded-[10px] flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              EduVerse <span className="text-blue-600 dark:text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI TUTOR</span>
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span className="text-[9px] text-blue-500 dark:text-blue-400">01</span> How It Works
          </a>
          <a href="#study-steps" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span className="text-[9px] text-blue-500 dark:text-blue-400">02</span> Study Journey
          </a>
          <a href="#subjects" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span className="text-[9px] text-blue-500 dark:text-blue-400">03</span> Subjects
          </a>
          <a href="#why-us" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span className="text-[9px] text-blue-500 dark:text-blue-400">04</span> Why EduVerse
          </a>
        </nav>

        <div className="flex items-center gap-3.5">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-white/10"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-300 hover:-rotate-12 transition-transform" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>AI TUTOR READY</span>
          </div>

          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors hidden sm:block cursor-pointer"
          >
            Student Login
          </button>

          <button 
            onClick={() => navigate('/teacher')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Live Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION (Clear, Student-Friendly & Welcoming) */}
      <section className="relative min-h-[92vh] flex items-center px-6 md:px-12 pt-8 pb-16 overflow-hidden border-b border-white/[0.06]">
        
        {/* Background 3D Earth floating on right */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <EarthCanvas />
        </div>

        {/* Foreground Content with Clean Typography & Negative Space */}
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 items-center relative z-10 pointer-events-none">
          
          <div className="lg:col-span-8 space-y-8 pointer-events-auto">

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-white leading-[1.05]">
                Master any subject with ease. <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-200 bg-clip-text text-transparent">
                  Your 24/7 personal AI tutor.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
                Talk naturally with an AI teacher who listens, draws live visual blackboard diagrams, and explains difficult math and science concepts in simple, everyday language.
              </p>
            </div>

            {/* Hero Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => navigate('/teacher')}
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 transition-all flex items-center gap-2.5 cursor-pointer glow-blue"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a 
                href="#how-it-works"
                className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>See How It Works</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 4. STUDENT-FRIENDLY BENEFITS MARQUEE */}
      <section className="py-12 border-b border-white/[0.06] bg-[#02040b]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500 font-bold">
            EVERYTHING YOU NEED TO ACE YOUR NEXT EXAM
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-2">
            {STUDENT_BENEFITS.map((benefit, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-center group cursor-default"
              >
                <div className="text-xs font-mono font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                  {benefit.name}
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                  {benefit.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Core Student Pillars) */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            01 // HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Learning that feels like talking to a patient, master tutor.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            No more feeling stuck on confusing textbooks. EduVerse AI listens to your questions in real time, draws live solutions on a visual blackboard, and breaks down complex problems until they make complete sense.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
              <Radio className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Talk Naturally by Voice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Speak just like you would with a human teacher. Ask follow-ups, request simpler examples, and interrupt anytime you need clarification.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <span>REAL-TIME TWO-WAY VOICE</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Live Visual Blackboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch equations solve themselves step-by-step alongside animated diagrams and circuit schematics so you truly understand the concepts.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <span>ANIMATED DIAGRAMS & MATH</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Clears Up Doubts Instantly</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stuck on a tricky step? Your tutor figures out exactly why you were confused and gives easy, real-life analogies to make it click.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <span>TARGETED RELATABLE ANALOGIES</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. THE 8-STEP STUDY JOURNEY */}
      <section id="study-steps" className="py-24 px-6 md:px-12 bg-[#02050e] border-t border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              02 // THE 8-STEP STUDY JOURNEY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              How EduVerse AI Guides You to 100% Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A structured step-by-step learning loop designed to help you truly master tough topics without stress.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STUDY_STEPS.map((step) => (
              <div 
                key={step.num} 
                className="p-6 rounded-2xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300/80 uppercase tracking-wider">
                    {step.tag}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CURRICULUM TRACKS */}
      <section id="subjects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              03 // SUBJECT TRACKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Choose Your Subject & Start Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive courses designed for school, college, and exam preparation.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-md">
            {['all', 'physics', 'cs', 'math', 'biology'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTrackCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer ${
                  activeTrackCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'cs' ? 'Coding' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => {
            const IconComp = track.icon;
            return (
              <div 
                key={track.id} 
                className="p-7 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                      {track.challenges}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {track.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {track.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.05]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/teacher')}
                  className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-blue-600 hover:text-white text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/[0.08] hover:border-cyan-400 cursor-pointer shadow-sm"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </section>

      {/* 7.5 CLASS 9TH - 12TH CURRICULUM & EXAM SCHEDULE MASTERCLASS */}
      <section id="curriculum-exams" className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#02050f] via-[#040c20] to-[#02050f] border-t border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                04 // CLASS 9TH - 12TH CURRICULUM & EXAM RADAR
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Important Formulas, Key Derivations & Timetable Sync
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tailored for CBSE, ICSE, State Boards and Competitive Prep (JEE / NEET).
              </p>
            </div>

            {/* Grade Switcher */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/[0.08] backdrop-blur-md">
              {[
                { id: 'class-9', label: 'Class 9th' },
                { id: 'class-10', label: 'Class 10th' },
                { id: 'class-11', label: 'Class 11th' },
                { id: 'class-12', label: 'Class 12th' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedLandingGrade(g.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    selectedLandingGrade === g.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curriculum Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LANDING_GRADES_DATA[selectedLandingGrade]?.subjects.map((subj, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">
                      {subj.name}
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      High Yield
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/20 font-mono text-xs text-cyan-300 font-bold overflow-x-auto">
                    {subj.formula}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {subj.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => navigate('/revision')}
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Formulas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(subj.name)}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>AI Lesson</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Exam Schedule Radar Bar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#060e24] to-cyan-950/40 border border-blue-500/20 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                LIVE EXAM RADAR
              </span>
              <h3 className="text-lg font-bold text-white">
                Upcoming Board & Competitive Test Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Auto-sync your timetable and track syllabus completion in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {LANDING_EXAM_PREVIEW.map((ex, eIdx) => (
                <div key={eIdx} className="px-4 py-2.5 rounded-2xl bg-black/40 border border-white/[0.08] text-center space-y-0.5">
                  <span className="text-xs font-bold text-white block">{ex.name}</span>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>{ex.date}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{ex.days} Days Left</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/study-plan')}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/30 cursor-pointer shrink-0"
            >
              <span>Upload Timetable</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 8. WHY STUDENTS LOVE EDUVERSE AI */}
      <section id="why-us" className="py-24 px-6 md:px-12 bg-[#02050e] border-t border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              04 // WHY STUDENTS LOVE EDUVERSE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Designed for Confident, Stress-Free Studying
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2">
              <div className="text-3xl font-extrabold text-cyan-400 flex items-center gap-2">
                <Clock className="w-7 h-7" /> 24/7
              </div>
              <div className="text-sm font-bold text-white">Always Available</div>
              <p className="text-xs text-slate-400">Get instant answers whether studying at noon or 2 AM before an exam.</p>
            </div>

            <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2">
              <div className="text-3xl font-extrabold text-cyan-400 flex items-center gap-2">
                <Smile className="w-7 h-7" /> 100%
              </div>
              <div className="text-sm font-bold text-white">Zero Judgment</div>
              <p className="text-xs text-slate-400">Ask as many "basic" questions as you want. Your AI tutor is endlessly patient.</p>
            </div>

            <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2">
              <div className="text-3xl font-extrabold text-cyan-400 flex items-center gap-2">
                <UploadCloud className="w-7 h-7" /> Any File
              </div>
              <div className="text-sm font-bold text-white">Upload Your Notes</div>
              <p className="text-xs text-slate-400">Drop in your class slides or PDFs to get customized tutoring on your exact syllabus.</p>
            </div>

            <div className="p-8 rounded-3xl bg-[#060b18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2">
              <div className="text-3xl font-extrabold text-cyan-400 flex items-center gap-2">
                <Heart className="w-7 h-7" /> Free
              </div>
              <div className="text-sm font-bold text-white">Start Free in Seconds</div>
              <p className="text-xs text-slate-400">No credit card required. Jump right into your first interactive lesson immediately.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. FINAL GRAND CALL TO ACTION */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#030611] via-[#05112e] to-[#030611] border-t border-white/[0.06] relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] mx-auto shadow-2xl shadow-blue-500/40">
            <div className="w-full h-full bg-[#030718] rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to make studying easier?
            </h2>
            <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join students mastering difficult concepts in minutes with their own interactive AI tutor. Start your first session today.
            </p>
          </div>

          {/* Grand Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/teacher')}
              className="py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-blue-500/30 transition-all cursor-pointer glow-blue flex items-center gap-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => navigate('/signup')}
              className="py-4 px-8 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

        </div>
      </section>

      {/* 10. MINIMAL REFINED FOOTER */}
      <footer className="px-6 md:px-12 py-12 border-t border-white/[0.06] bg-[#02040b] text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-tight">EDUVERSE AI</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Your Personal 1-on-1 AI Tutor</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              All Systems Operational
            </span>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#study-steps" className="hover:text-white transition-colors">Study Steps</a>
            <a href="#subjects" className="hover:text-white transition-colors">Subjects</a>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">Login</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
