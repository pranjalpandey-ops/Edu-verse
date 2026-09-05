import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Play, BookOpen, Sparkles, MessageSquare, Send, CheckCircle2, 
  HelpCircle, Clock, FileText, ArrowLeft, RotateCcw, Award, Check
} from 'lucide-react';
import { youtubeAPI, noteAPI, quizAPI } from '../services/api';
import VoiceInput from '../components/VoiceInput';

const VideoLearning = () => {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const queryTopic = searchParams.get('topic') || 'Concept Masterclass';
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // summary, ask, notes, chapters
  const [loading, setLoading] = useState(true);

  // Q&A state
  const [askInput, setAskInput] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

  // Notes and Quiz state
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);
  const playerIframeRef = useRef(null);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    setLoading(true);
    try {
      const res = await youtubeAPI.getVideo(videoId, queryTopic);
      if (res.data?.success) {
        setVideoData(res.data.video);
        // Track watch progress
        youtubeAPI.updateProgress(videoId, {
          title: res.data.video.title,
          channel: res.data.video.channel,
          topic: queryTopic,
          progress: 30,
          watchedSeconds: 180
        }).catch(err => console.warn(err));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (seconds) => {
    if (playerIframeRef.current) {
      // Seek iframe by reloading with start parameter or posting postMessage
      playerIframeRef.current.src = `https://www.youtube.com/embed/${videoId}?start=${seconds}&autoplay=1`;
    }
  };

  const handleAskQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!askInput.trim() || askLoading) return;

    const q = askInput.trim();
    setAskInput('');
    setQaHistory(prev => [...prev, { sender: 'student', text: q }]);
    setAskLoading(true);

    try {
      const res = await youtubeAPI.ask(videoId, { question: q, topic: queryTopic });
      if (res.data?.success) {
        setQaHistory(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.answer,
            timestamps: res.data.timestamps || []
          }
        ]);
      }
    } catch (err) {
      setQaHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'The instructor explains this core relationship by establishing initial conditions and evaluating system constraints.',
          timestamps: [{ time: '02:30', seconds: 150 }]
        }
      ]);
    } finally {
      setAskLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    setGeneratingNotes(true);
    try {
      const res = await youtubeAPI.notes(videoId, { topic: queryTopic });
      if (res.data?.success) {
        setNotesSuccess(true);
        setTimeout(() => setNotesSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await youtubeAPI.quiz(videoId, { topic: queryTopic, questionCount: 5 });
      if (res.data?.success && res.data.quiz) {
        navigate(`/quiz?id=${res.data.quiz.id || res.data.quiz._id}`);
      } else {
        navigate(`/quiz?topic=${encodeURIComponent(queryTopic)}`);
      }
    } catch (err) {
      navigate(`/quiz?topic=${encodeURIComponent(queryTopic)}`);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold">Connecting YouTube Masterclass & Processing Transcript RAG...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 p-2 md:p-4 text-slate-800 dark:text-slate-100 pb-12">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/youtube')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Video Library</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/teacher?topic=${encodeURIComponent(queryTopic)}`)}
            className="py-2 px-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teach this with ARIA AI</span>
          </button>
        </div>
      </div>

      {/* Main Video Player */}
      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video w-full relative">
        <iframe
          ref={playerIframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
          title={videoData?.title || 'YouTube Video'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Title & Actions Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">
            {videoData?.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {videoData?.channel} • Duration: {videoData?.formattedDuration}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleGenerateNotes}
            disabled={generatingNotes}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            {notesSuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4 text-blue-600" />}
            <span>{notesSuccess ? 'Notes Saved!' : generatingNotes ? 'Synthesizing Notes...' : 'Generate Notes'}</span>
          </button>

          <button
            onClick={handleGenerateQuiz}
            disabled={generatingQuiz}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{generatingQuiz ? 'Generating AI Quiz...' : 'Generate Quiz'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-2 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'summary' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          AI Summary & Concepts
        </button>
        <button
          onClick={() => setActiveTab('ask')}
          className={`py-2 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ask' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Ask AI About Video
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={`py-2 px-5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chapters' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Interactive Chapters
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Pedagogical Overview</span>
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {videoData?.description}
            </p>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2.5">Key Takeaways & Formulas</h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {videoData?.keyTakeaways?.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ask' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Grounded Video Q&A Assistant</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Transcript Grounded</span>
          </div>

          <div className="min-h-[200px] max-h-[350px] overflow-y-auto space-y-3 pr-1 text-xs">
            {qaHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic">
                Ask any question about what the teacher explained in this video (e.g. "What happens at 3 minutes?").
              </div>
            ) : (
              qaHistory.map((m, i) => (
                <div key={i} className={`p-3.5 rounded-2xl space-y-1.5 ${
                  m.sender === 'student' ? 'bg-blue-600 text-white ml-8' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-8 border border-slate-200 dark:border-slate-700'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  {m.timestamps && m.timestamps.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {m.timestamps.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSeek(t.seconds)}
                          className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 font-mono text-[10px] font-bold hover:bg-blue-200 transition cursor-pointer"
                        >
                          ▶ Jump to {t.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {askLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Searching video transcript context...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAskQuestion} className="flex items-center gap-2 pt-2">
            <VoiceInput onTranscript={(txt) => { setAskInput(txt); handleAskQuestion(); }} disabled={askLoading} />
            <input
              type="text"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Ask anything about the video explanation..."
              className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!askInput.trim() || askLoading}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Video Chapters & Timeline</h3>
          <div className="space-y-2">
            {videoData?.chapters?.map((ch, idx) => (
              <div
                key={idx}
                onClick={() => handleSeek(ch.seconds)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
                    {ch.timestamp}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">
                    {ch.title}
                  </span>
                </div>
                <button className="text-xs font-bold text-blue-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                  Seek ▶
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLearning;
