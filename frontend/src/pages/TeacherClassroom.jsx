import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  HelpCircle, RotateCcw, Lightbulb, Mic, MicOff, Volume2, VolumeX, 
  Sparkles, CheckCircle2, ArrowRight, Clock, Layers, Send, MessageSquare, 
  ArrowLeft, Calendar, BookOpen, Copy, Check, Play, ChevronRight, X,
  FileText, ExternalLink, Zap
} from 'lucide-react';
import TeacherAvatar from '../components/TeacherAvatar';
import VisualCanvas from '../components/VisualCanvas';
import QuestionCard from '../components/QuestionCard';
import MisconceptionFeedback from '../components/MisconceptionFeedback';
import { lessonAPI, teacherAPI, formulaAPI, studyPlanAPI } from '../services/api';

const TeacherClassroom = () => {
  const { lessonId, id } = useParams();
  const [searchParams] = useSearchParams();
  const queryTopic = searchParams.get('topic');
  const querySubject = searchParams.get('subject') || 'Physics';
  const queryGrade = searchParams.get('grade') || 'class-12';
  const queryLectureId = searchParams.get('lectureId');
  const navigate = useNavigate();

  const activeId = lessonId || id || 'lesson_current';
  const [lessonData, setLessonData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [avatarState, setAvatarState] = useState('speaking');
  const [currentSpeech, setCurrentSpeech] = useState("Welcome to your live interactive lecture! Let's master the concepts and derivations together.");
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timeBadge, setTimeBadge] = useState("1/4 Sections");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [misconceptionDiagnosis, setMisconceptionDiagnosis] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Drawers / Panels
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);
  const [showCalendarDrawer, setShowCalendarDrawer] = useState(false);
  const [subjectFormulas, setSubjectFormulas] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [copiedFormula, setCopiedFormula] = useState(null);

  useEffect(() => {
    loadOrCreateLesson();
    loadFormulasAndSchedule();
  }, [activeId, queryTopic, querySubject, queryGrade]);

  const loadOrCreateLesson = async () => {
    try {
      const topicName = queryTopic || 'Ray Optics & Lens Maker Formula';
      const res = await lessonAPI.generate({ topic: topicName, time: 25 });
      if (res.data.success) {
        const lesson = res.data.lesson;
        setLessonData(lesson);
        setCurrentSectionIndex(0);
        const firstSec = lesson.sections?.[0];
        if (firstSec) {
          const introSpeech = `Welcome to today's live lecture on ${lesson.title}. Let's derive the core relationships on the blackboard step by step.`;
          setCurrentSpeech(introSpeech);
          speakText(introSpeech);
          setTimeBadge(`1/${lesson.sections.length} Sections`);
        }
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
    }
  };

  const loadFormulasAndSchedule = async () => {
    try {
      const [formRes, calRes] = await Promise.all([
        formulaAPI.getCurriculum({ grade: queryGrade, subject: querySubject.toLowerCase() }),
        studyPlanAPI.getCalendarEvents()
      ]);
      if (formRes.data?.success) {
        setSubjectFormulas(formRes.data.curriculum || []);
      }
      if (calRes.data?.success) {
        setCalendarEvents(calRes.data.events || []);
      }
    } catch (err) {
      console.error('Error loading formulas/schedule:', err);
    }
  };

  const currentSection = lessonData?.sections?.[currentSectionIndex] || {
    title: queryTopic || 'Core Concept',
    speechScript: 'Let us analyze the governing relationships step-by-step.',
    question: {
      id: 'q_default',
      concept: 'System Balance',
      question: 'When system constraints increase under constant driving force, what is the net response?',
      options: [
        { id: 'A', text: 'Net throughput decreases due to increased opposition.', correct: true },
        { id: 'B', text: 'Net throughput increases infinitely.', correct: false },
        { id: 'C', text: 'The system becomes unresponsive.', correct: false },
        { id: 'D', text: 'There is zero change.', correct: false }
      ]
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setAvatarState('speaking');
      utterance.onend = () => setAvatarState('idle');
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitAnswer = async (selectedOption) => {
    setIsSubmitting(true);
    setAvatarState('thinking');

    try {
      const res = await teacherAPI.diagnose({
        question: currentSection.question,
        answer: selectedOption,
        topic: lessonData?.title || 'Core Principles'
      });

      if (res.data.success) {
        const evalData = res.data.diagnosis;
        if (!evalData.correct && evalData.misconception) {
          setMisconceptionDiagnosis(evalData);
          const speech = evalData.remedialExplanation?.teacherSpeech || "Let's break this down with a visual analogy.";
          setCurrentSpeech(speech);
          speakText(speech);
        } else {
          setShowCelebration(true);
          setMisconceptionDiagnosis(null);
          const praise = "Spot on! You have correctly understood the foundational derivation.";
          setCurrentSpeech(praise);
          speakText(praise);

          setTimeout(() => {
            setShowCelebration(false);
            if (currentSectionIndex < (lessonData?.sections?.length || 1) - 1) {
              const nextIdx = currentSectionIndex + 1;
              setCurrentSectionIndex(nextIdx);
              const nextSec = lessonData.sections[nextIdx];
              setCurrentSpeech(nextSec.speechScript);
              speakText(nextSec.speechScript);
              setTimeBadge(`${nextIdx + 1}/${lessonData.sections.length} Sections`);
            } else {
              navigate('/assessment');
            }
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { sender: 'student', text: msg }]);
    setChatLoading(true);
    setAvatarState('thinking');

    try {
      const res = await teacherAPI.chat({
        message: msg,
        topic: lessonData?.title || 'Concept',
        sectionTitle: currentSection.title
      });

      if (res.data.success) {
        const reply = res.data.reply;
        setChatHistory((prev) => [...prev, { sender: 'teacher', text: reply }]);
        setCurrentSpeech(reply);
        setAvatarState(res.data.avatarState || 'speaking');
        speakText(reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAskFormulaDerivation = (f) => {
    const prompt = `Can you show me the step-by-step derivation for ${f.name} (${f.formula}) on the blackboard?`;
    setChatOpen(true);
    setChatHistory((prev) => [...prev, { sender: 'student', text: prompt }]);
    setChatLoading(true);
    setAvatarState('thinking');

    teacherAPI.chat({
      message: prompt,
      topic: lessonData?.title || 'Subject Formula',
      sectionTitle: f.name
    }).then(res => {
      if (res.data?.success) {
        const reply = res.data.reply;
        setChatHistory((prev) => [...prev, { sender: 'teacher', text: reply }]);
        setCurrentSpeech(reply);
        setAvatarState('speaking');
        speakText(reply);
      }
    }).finally(() => {
      setChatLoading(false);
    });
  };

  const handleCopyFormula = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleSwitchLecture = (lec) => {
    setShowCalendarDrawer(false);
    navigate(`/teacher?topic=${encodeURIComponent(lec.topicQuery || lec.title)}&subject=${encodeURIComponent(lec.subject)}&grade=${encodeURIComponent(lec.grade)}&lectureId=${lec.id}`);
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please type or click.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        setIsListening(false);
        handleSubmitAnswer('A');
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-7xl mx-auto p-2 md:p-4 text-slate-800 dark:text-slate-100 transition-colors pb-8">
      {/* Top Header Bar with Live Lecture Link & Fast Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/study-plan')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Schedule / Calendar</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-xs font-bold">
              {querySubject} • {queryGrade.toUpperCase()}
            </span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-xs md:max-w-md">
              {lessonData?.title || queryTopic || 'Interactive Live Lecture'}
            </span>
          </div>
        </div>

        {/* Action Buttons for Formula Sheet & Calendar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowFormulaDrawer(!showFormulaDrawer);
              setShowCalendarDrawer(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              showFormulaDrawer 
                ? 'bg-amber-500 text-white' 
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subject Formulas</span>
          </button>

          <button
            onClick={() => {
              setShowCalendarDrawer(!showCalendarDrawer);
              setShowFormulaDrawer(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              showCalendarDrawer
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-400 border border-blue-300 dark:border-blue-500/30 hover:bg-blue-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Lecture Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Grid */}
      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-190px)] min-h-[600px] relative">
        {/* Left 8 Columns: Visual Canvas + Avatar + Speech */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-2xl relative overflow-hidden">
          {/* Top Status Badges */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                Live Teaching
              </span>
              <span className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-full truncate max-w-xs">
                {currentSection.title}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{timeBadge}</span>
            </div>
          </div>

          {/* Main Visual Display (Upper Half: Blackboard, Lower Half: Avatar) */}
          <div className="flex-1 grid grid-rows-2 gap-3 min-h-0">
            <div className="w-full h-full min-h-0">
              <VisualCanvas concept={currentSection.title} topic={lessonData?.title || queryTopic} />
            </div>

            <div className="w-full h-full min-h-0 relative">
              <TeacherAvatar 
                state={avatarState} 
                currentSpeech={currentSpeech}
                isMuted={isMuted}
              />
            </div>
          </div>

          {/* Bottom Live Controls Row */}
          <div className="flex items-center justify-between gap-2 pt-3 mt-1 border-t border-slate-200 dark:border-slate-800 z-10 flex-wrap">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask ARIA AI</span>
              </button>

              <button 
                onClick={() => speakText(currentSpeech)}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Repeat</span>
              </button>

              <button 
                onClick={() => {
                  const simpler = `Let's break down ${currentSection.title} into an intuitive principle: balance the driving forces against opposing resistance!`;
                  setCurrentSpeech(simpler);
                  speakText(simpler);
                }}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Explain Simpler</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button 
                onClick={toggleSpeechRecognition}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer ${
                  isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? "Listening..." : "Voice Input"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Interactive Checkpoint or Chat Drawer */}
        <div className="lg:col-span-4 h-full flex flex-col relative">
          {chatOpen ? (
            /* Live Conversational Chat with AI Teacher */
            <div className="rounded-3xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl flex flex-col h-full space-y-3 shadow-sm dark:shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Dialogue with ARIA</h3>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatHistory.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 dark:text-slate-500 italic text-xs">
                    Ask ARIA anything about {currentSection.title}. She will explain with voice and blackboard diagrams.
                  </div>
                ) : (
                  chatHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl ${
                        m.sender === 'student'
                          ? 'bg-blue-600 text-white ml-6'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-6 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="p-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>ARIA is explaining on blackboard...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleTeacherChatSubmit} className="relative pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a clarifying question or formula derivation..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-blue-500 shadow-xs"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 dark:text-blue-400 hover:opacity-80 cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : misconceptionDiagnosis ? (
            <div className="h-full overflow-y-auto">
              <MisconceptionFeedback 
                diagnosis={misconceptionDiagnosis}
                onResolveMisconception={() => {
                  setMisconceptionDiagnosis(null);
                  const praise = "Great work mastering the core concept! Let us continue.";
                  setCurrentSpeech(praise);
                  speakText(praise);
                }}
              />
            </div>
          ) : (
            <QuestionCard 
              question={currentSection.question || {
                id: 'q_default',
                question: `In ${currentSection.title}, how do governing parameters respond to increased opposition?`,
                options: [
                  { id: 'A', text: 'Throughput decreases proportionally.' },
                  { id: 'B', text: 'Throughput increases infinitely.' }
                ]
              }}
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
              isListening={isListening}
              toggleSpeechRecognition={toggleSpeechRecognition}
            />
          )}

          {/* OVERLAY DRAWER: SUBJECT FORMULAS & DERIVATIONS */}
          {showFormulaDrawer && (
            <div className="absolute inset-0 z-30 bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-500/40 shadow-2xl p-5 flex flex-col space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {querySubject} Formulas ({queryGrade.toUpperCase()})
                  </h3>
                </div>
                <button
                  onClick={() => setShowFormulaDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {subjectFormulas.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    {group.chapters?.map((chap, cIdx) => (
                      <div key={cIdx} className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {chap.chapterName}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {chap.formulas?.map((f, fIdx) => {
                            const fId = `f-${gIdx}-${cIdx}-${fIdx}`;
                            return (
                              <div key={fIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">{f.name}</span>
                                  <button
                                    onClick={() => handleCopyFormula(f.formula, fId)}
                                    className="text-slate-400 hover:text-amber-500 p-1 rounded"
                                  >
                                    {copiedFormula === fId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <div className="p-2 rounded-lg bg-black/40 font-mono text-cyan-300 text-xs font-bold overflow-x-auto">
                                  {f.formula}
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{f.description}</span>
                                  <button
                                    onClick={() => handleAskFormulaDerivation(f)}
                                    className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
                                  >
                                    Derive on Board ➔
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OVERLAY DRAWER: LECTURE CALENDAR & NEXT SESSIONS */}
          {showCalendarDrawer && (
            <div className="absolute inset-0 z-30 bg-white dark:bg-slate-900 rounded-3xl border border-blue-300 dark:border-blue-500/40 shadow-2xl p-5 flex flex-col space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Upcoming Live Lectures
                  </h3>
                </div>
                <button
                  onClick={() => setShowCalendarDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {calendarEvents.map((lec) => (
                  <div 
                    key={lec.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 hover:border-blue-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                        {lec.subject} • {lec.grade.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {lec.date} ({lec.startTime})
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {lec.title}
                    </h4>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lec.keyFormulas?.length || 0} Formulas Attached
                      </span>
                      <button
                        onClick={() => handleSwitchLecture(lec)}
                        className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Join Lecture</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom;
