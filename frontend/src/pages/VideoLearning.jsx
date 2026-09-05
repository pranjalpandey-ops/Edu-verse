import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Video, Play, MessageSquare, HelpCircle, FileText, Sparkles, 
  Clock, ArrowLeft, CheckCircle2, Send, Bookmark, Share2, Layers
} from 'lucide-react';
import { youtubeAPI } from '../services/api';

export default function VideoLearning() {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'Physics';
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState('00:00');

  useEffect(() => {
    loadVideoDetails();
  }, [videoId, topic]);

  const loadVideoDetails = async () => {
    try {
      const res = await youtubeAPI.getVideo(videoId, topic);
      if (res.data.success) {
        setVideoData(res.data.video);
        setChatMessages([
          {
            sender: 'ai',
            text: `Hi! I have analyzed this video on ${res.data.video.title}. Ask me any question, and I will explain with exact timestamp references!`
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading video data:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const query = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setChatLoading(true);

    try {
      const res = await youtubeAPI.ask({ videoId, question: query, topic });
      if (res.data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.answer,
            timestamps: res.data.timestamps
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      const res = await youtubeAPI.quiz({ videoId, topic });
      if (res.data.success) {
        setQuizData(res.data.quiz);
        setUserAnswers({});
        setQuizSubmitted(false);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    setNotesLoading(true);
    try {
      const res = await youtubeAPI.notes({ videoId, topic });
      if (res.data.success) {
        setNotesData(res.data.notes);
      }
    } catch (err) {
      console.error('Notes error:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleTimestampClick = (timeStr) => {
    setCurrentTimestamp(timeStr);
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-6 transition-colors">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/youtube')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to YouTube Hub</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-medium">
            AI Video Learning Mode
          </span>
        </div>
      </div>

      {/* Main Grid: Left Video Player & Chapters / Right Interactive Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Video + Chapters (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Container */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-2xl relative">
            <div className="aspect-video w-full bg-black flex flex-col items-center justify-center relative group">
              <iframe
                title="YouTube Video"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="p-6 space-y-3 bg-white/95 dark:bg-slate-900/90">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                <span>Timestamp: {currentTimestamp}</span>
                <span>•</span>
                <span>{videoData?.formattedDuration || '18:40'}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{videoData?.title || `Video Study: ${topic}`}</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">{videoData?.description}</p>
            </div>
          </div>

          {/* Chapters & Key Takeaways */}
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Interactive Timestamped Chapters</span>
            </h3>
            <div className="space-y-2">
              {videoData?.chapters?.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimestampClick(ch.timestamp)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/40 hover:border-red-500/40 text-left flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 font-mono text-xs font-bold">
                      {ch.timestamp}
                    </span>
                    <span className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-red-600 dark:group-hover:text-cyan-300">
                      {ch.title}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive AI Sidebar (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl flex flex-col h-[700px] overflow-hidden shadow-xs">
          {/* Tabs */}
          <div className="grid grid-cols-4 p-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                if (!quizData) handleGenerateQuiz();
              }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('notes');
                if (!notesData) handleGenerateNotes();
              }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'notes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'transcript' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: Grounded AI Chat */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[90%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.timestamps && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                            {msg.timestamps.map((t, tIdx) => (
                              <button
                                key={tIdx}
                                onClick={() => handleTimestampClick(t.time)}
                                className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/40 text-[10px] text-blue-700 dark:text-cyan-300 font-mono hover:bg-blue-100"
                              >
                                Jump to [{t.time}] ({t.label})
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>ARIA AI is reviewing video timestamps...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="relative pt-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about something in the video..."
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs md:text-sm focus:outline-hidden focus:border-blue-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Video Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Video Active Recall Check</h4>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                    className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>

                {quizLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Synthesizing quiz from video transcript...</span>
                  </div>
                ) : quizData ? (
                  <div className="space-y-4">
                    {quizData.questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            <span className="text-blue-600 dark:text-blue-400 mr-1.5">Q{qIdx + 1}.</span>
                            {q.question}
                          </p>
                          <button
                            onClick={() => handleTimestampClick(q.timestamp)}
                            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-mono hover:bg-slate-300 dark:hover:bg-slate-600 shrink-0"
                          >
                            [{q.timestamp}]
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          {q.options.map((opt) => {
                            const isChosen = userAnswers[q.id] === opt.id;
                            let style = "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 shadow-xs";
                            if (quizSubmitted) {
                              if (opt.correct) style = "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-800 dark:text-emerald-200";
                              else if (isChosen) style = "bg-red-50 dark:bg-red-950/70 border-red-500 text-red-800 dark:text-red-200";
                            } else if (isChosen) {
                              style = "bg-blue-50 dark:bg-blue-600/30 border-blue-500 text-blue-700 dark:text-white";
                            }

                            return (
                              <button
                                key={opt.id}
                                disabled={quizSubmitted}
                                onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt.id })}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${style}`}
                              >
                                <span>{opt.id}. {opt.text}</span>
                                {quizSubmitted && opt.correct && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-xs transition shadow-lg"
                      >
                        Submit Video Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateQuiz}
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
                      >
                        Try New Questions
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB 3: Video Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">AI Generated Study Notes</h4>
                  <button
                    onClick={handleGenerateNotes}
                    disabled={notesLoading}
                    className="text-[10px] text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {notesLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Extracting summary and high-yield notes...</span>
                  </div>
                ) : notesData ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {notesData.summary}
                    </div>

                    <div className="space-y-3">
                      {notesData.sections?.map((sec, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                          <h5 className="font-bold text-slate-900 dark:text-white">{sec.heading}</h5>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sec.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {notesData.tags?.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB 4: Interactive Transcript */}
            {activeTab === 'transcript' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Full Video Transcript</h4>
                {videoData?.transcript?.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTimestampClick(t.timestamp)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left flex items-start gap-2.5 transition text-xs group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-blue-700 dark:text-cyan-300 font-bold shrink-0">
                      {t.timestamp}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-relaxed">{t.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
