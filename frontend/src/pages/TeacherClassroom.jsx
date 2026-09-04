import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  RotateCcw, 
  Lightbulb, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers,
  Send,
  MessageSquare
} from 'lucide-react';
import TeacherAvatar from '../components/TeacherAvatar';
import VisualCanvas from '../components/VisualCanvas';
import QuestionCard from '../components/QuestionCard';
import MisconceptionFeedback from '../components/MisconceptionFeedback';
import API from '../services/api';

const TeacherClassroom = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [avatarState, setAvatarState] = useState('speaking'); // 'speaking', 'thinking', 'idle'
  const [currentSpeech, setCurrentSpeech] = useState("Let us look at Ohm's Law: V = I times R. Notice that Resistance OPPOSES current. If voltage stays constant and resistance increases, what happens to current?");
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentConcept, setCurrentConcept] = useState("Ohm's Law");
  const [timeBadge, setTimeBadge] = useState("6/20 mins");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [misconceptionDiagnosis, setMisconceptionDiagnosis] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Active question state
  const [activeQuestion, setActiveQuestion] = useState({
    id: "q_3",
    concept: "Ohm's Law",
    question: "If voltage remains constant and resistance increases, what happens to current?",
    options: [
      { id: "A", text: "It increases proportionally." },
      { id: "B", text: "It decreases." },
      { id: "C", text: "It remains the same." },
      { id: "D", text: "It fluctuates unpredictably." }
    ]
  });

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const res = await API.post('/lessons/lesson_physics_electricity/start');
      if (res.data.success) {
        setSession(res.data.session);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Web Speech synthesis handler
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

  // Submit Answer handler
  const handleSubmitAnswer = async (selectedOption) => {
    setIsSubmitting(true);
    setAvatarState('thinking');
    
    try {
      const res = await API.post('/lessons/lesson_physics_electricity/answer', {
        questionId: activeQuestion.id,
        answer: selectedOption,
        questionText: activeQuestion.question,
        options: activeQuestion.options,
        concept: currentConcept
      });

      if (res.data.success) {
        const evalData = res.data.evaluation;
        if (!evalData.correct && evalData.misconception) {
          // Trigger Misconception Diagnosis
          setMisconceptionDiagnosis(evalData);
          setCurrentSpeech(evalData.remedialExplanation?.teacherSpeech || "Let's explore the water pipe analogy!");
          speakText(evalData.remedialExplanation?.teacherSpeech || "Let us look at it with the water pipe analogy.");
        } else {
          // Correct Answer
          setShowCelebration(true);
          setMisconceptionDiagnosis(null);
          setCurrentSpeech("Excellent! You've mastered the inverse relationship in Ohm's Law. Let's proceed to the module assessment.");
          speakText("Excellent! You have mastered the inverse relationship in Ohm's Law.");
          setTimeout(() => {
            navigate('/assessment');
          }, 2200);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please type or select.");
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
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript.toLowerCase().includes('increase')) {
          handleSubmitAnswer('A');
        } else {
          handleSubmitAnswer('B');
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSimpler = () => {
    setCurrentSpeech("Think of resistance like a constriction in a water pipe. The more you squeeze the pipe, the less water flows through!");
    speakText("Think of resistance like a constriction in a water pipe.");
  };

  const handleRepeat = () => {
    speakText(currentSpeech);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Split Screen Grid matching Stitch Screenshot */}
      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[580px]">
        {/* Left 7.5 Columns: Classroom Visual + Avatar + Controls */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Top Status Header Badges */}
          <div className="flex items-center justify-between z-10 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Teaching
              </span>
              <span className="px-3.5 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 font-semibold text-xs rounded-full">
                Concept: {currentConcept}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{timeBadge}</span>
            </div>
          </div>

          {/* Main Visual Display (Upper Half: Circuit Whiteboard, Lower Half: ARIA Avatar) */}
          <div className="flex-1 grid grid-rows-2 gap-3 min-h-0">
            {/* Upper: Subject-Aware Visual Canvas */}
            <div className="w-full h-full min-h-0">
              <VisualCanvas concept={currentConcept} />
            </div>

            {/* Lower: ARIA AI Teacher Avatar Area */}
            <div className="w-full h-full min-h-0 relative">
              <TeacherAvatar 
                state={avatarState} 
                currentSpeech={currentSpeech}
                isMuted={isMuted}
              />
            </div>
          </div>

          {/* Bottom Live Controls Row */}
          <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-800 z-10 flex-wrap">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const q = prompt("Ask ARIA any question about this concept:");
                  if (q) {
                    setCurrentSpeech(`Great question! ${q} is governed by the ratio of Voltage to Resistance.`);
                    speakText(`Great question! In this circuit, potential difference drives current through that resistance.`);
                  }
                }}
                className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ask question</span>
              </button>

              <button 
                onClick={handleRepeat}
                className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Repeat</span>
              </button>

              <button 
                onClick={handleSimpler}
                className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Explain simpler</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                title={isMuted ? "Unmute ARIA" : "Mute ARIA"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button 
                onClick={toggleSpeechRecognition}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'}`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? "Listening..." : "Speak to ARIA"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4.5 Columns: Lesson Assistant / Misconception Feedback Card */}
        <div className="lg:col-span-4 h-full">
          {misconceptionDiagnosis ? (
            <div className="h-full overflow-y-auto">
              <MisconceptionFeedback 
                diagnosis={misconceptionDiagnosis}
                onResolveMisconception={() => {
                  setMisconceptionDiagnosis(null);
                  setCurrentSpeech("Great work understanding the water pipe analogy! Now let's complete our knowledge check.");
                  speakText("Great work resolving that misconception!");
                  setTimeout(() => navigate('/assessment'), 1500);
                }}
              />
            </div>
          ) : (
            <QuestionCard 
              question={activeQuestion}
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
              isListening={isListening}
              toggleSpeechRecognition={toggleSpeechRecognition}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom;
