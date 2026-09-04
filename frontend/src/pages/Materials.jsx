import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, FileText, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await API.get('/materials');
      if (res.data.success) {
        setMaterials(res.data.materials);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Learning Materials
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Uploaded textbooks, research notes, and lecture slides processed by EduVerse RAG.
          </p>
        </div>

        <button 
          onClick={() => navigate('/create-lesson')}
          className="py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {materials.map((mat) => (
          <div key={mat._id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950 text-rose-600 text-[10px] font-bold rounded-md">
                {mat.fileType || 'PDF'}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Vector Embedded
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{mat.filename}</h3>
            <p className="text-xs text-slate-400">Pages: {mat.pages || 18} • Sections: {mat.sections?.length || 5}</p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => navigate('/teacher')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Teach from this doc →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
