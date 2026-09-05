import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Sparkles, Volume2, RotateCcw, Lightbulb, Zap, HelpCircle, X } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { teacherAPI } from '../services/api';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

const AIChat = ({ topic = 'Concept Study', currentSection = 'Foundations', onVisualUpdate, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'm_init',
      sender: 'teacher',
      text: `Hello! I am ARIA, your personal AI teacher for ${topic}. Feel free to ask any question or click a quick action below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState('normal');
  const messagesEndRef = useRef(null);
  const { speak } = useSpeechSynthesis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customMessage, mode = 'normal') => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    const userMsg = {
      id: Date.now().toString(),
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await teacherAPI.chat({
        message: textToSend,
        topic,
        sectionTitle: currentSection,
        mode
      });

      if (res.data?.success) {
        const replyText = res.data.reply;
        const teacherMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'teacher',
          text: replyText,
          teachingStrategy: res.data.teachingStrategy,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, teacherMsg]);

        if (res.data.boardUpdate && onVisualUpdate) {
          onVisualUpdate(res.data.boardUpdate);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'teacher',
        text: `Let's look at ${topic} step by step: every governing rule has defined boundary conditions. What specific part can I clarify?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Dialogue with ARIA AI</h3>
            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{topic} • {currentSection}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'student' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] space-y-1 shadow-xs ${
                m.sender === 'student'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-70">
                <span>{m.timestamp}</span>
                {m.sender === 'teacher' && (
                  <button
                    onClick={() => speak(m.text)}
                    className="hover:opacity-100 transition p-0.5 rounded cursor-pointer"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>ARIA is preparing blackboard explanation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <button
          onClick={() => handleSend('Explain this concept much simpler with an intuitive everyday analogy', 'simplify')}
          className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 font-bold whitespace-nowrap hover:bg-amber-100 transition cursor-pointer"
        >
          💡 Simplify
        </button>
        <button
          onClick={() => handleSend('Provide a concrete real-world engineering example', 'example')}
          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/40 font-bold whitespace-nowrap hover:bg-blue-100 transition cursor-pointer"
        >
          📚 Example
        </button>
        <button
          onClick={() => handleSend('Give an intuitive mental analogy for this', 'analogy')}
          className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 font-bold whitespace-nowrap hover:bg-purple-100 transition cursor-pointer"
        >
          🧠 Analogy
        </button>
        <button
          onClick={() => handleSend('Iski explanation natural Hinglish mein explain karo', 'hindi')}
          className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-bold whitespace-nowrap hover:bg-emerald-100 transition cursor-pointer"
        >
          🇮🇳 Hinglish
        </button>
        <button
          onClick={() => handleSend('Ask me an active recall checkpoint question on this', 'quiz')}
          className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 font-bold whitespace-nowrap hover:bg-rose-100 transition cursor-pointer"
        >
          🎯 Quiz Me
        </button>
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
      >
        <VoiceInput onTranscript={(txt) => handleSend(txt)} disabled={loading} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ARIA a question or derivation..."
          className="flex-1 py-2.5 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIChat;
