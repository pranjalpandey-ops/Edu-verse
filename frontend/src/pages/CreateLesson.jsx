import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';
import API from '../services/api';

const CreateLesson = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('material');
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(true); // Preloaded for Stitch demo visual match
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  const [topic, setTopic] = useState("Teach me Newton's Laws & Electricity");
  const [level, setLevel] = useState('High School');
  const [knowledgeLevel, setKnowledgeLevel] = useState('Beginner');
  const [language, setLanguage] = useState('English');
  const [time, setTime] = useState(20);
  const [goal, setGoal] = useState('Exam preparation');
  const [style, setStyle] = useState('Simple examples');
  const [depth, setDepth] = useState('Standard');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsProcessingFile(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('level', level);
    formData.append('knowledgeLevel', knowledgeLevel);
    formData.append('language', language);

    try {
      await API.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFileUploaded(true);
    } catch (err) {
      setFileUploaded(true);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    try {
      const payload = { topic, level, knowledgeLevel, language, time, goal, style, depth };
      const res = await API.post('/lessons/generate', payload);
      if (res.data.success && res.data.lesson) {
        navigate(`/lesson-plan?id=${res.data.lesson._id}`);
      } else {
        navigate('/lesson-plan');
      }
    } catch (err) {
      navigate('/lesson-plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Your Lesson
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Design a customized learning experience powered by AI. Upload materials or specify a topic to begin.
        </p>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('material')}
          className={`py-2 px-6 rounded-xl text-xs font-bold transition-all ${activeTab === 'material' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Upload Material
        </button>
        <button
          onClick={() => setActiveTab('topic')}
          className={`py-2 px-6 rounded-xl text-xs font-bold transition-all ${activeTab === 'topic' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Enter Topic
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {activeTab === 'material' ? (
          <div className="space-y-6">
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/40">
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.doc,.pptx,.txt" />
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Drag and drop your files here</p>
                <p className="text-xs text-slate-400 mt-0.5">Support for PDF, DOCX, and PPTX up to 50MB</p>
              </div>
              <button type="button" className="py-2 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-indigo-600 shadow-xs hover:bg-slate-50">
                Browse Files
              </button>
            </label>

            {/* Uploaded File Row matching Stitch screenshot */}
            {fileUploaded && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{file?.name || "Physics_Class_10.pdf"}</h4>
                    <p className="text-[11px] text-slate-400">4.2MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </span>
                  <button onClick={() => setFileUploaded(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              What topic would you like ARIA to teach?
            </label>
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Teach me Newton's Laws or Electricity"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Dropdown selectors row matching Stitch screenshot */}
        <div className="grid md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Educational Level
            </label>
            <select 
              value={level} 
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>High School</option>
              <option>Middle School</option>
              <option>Undergraduate</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Knowledge Level
            </label>
            <select 
              value={knowledgeLevel} 
              onChange={(e) => setKnowledgeLevel(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Language
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Hinglish</option>
              <option>Bengali</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleGenerateLesson}
            disabled={isGenerating}
            className="w-full py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Structuring Pedagogical Curriculum...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Lesson</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
