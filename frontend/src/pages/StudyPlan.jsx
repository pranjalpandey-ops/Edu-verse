import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, CheckCircle2, Clock, Sparkles, Target, 
  ArrowRight, Award, Flame, BookOpen, ChevronRight,
  Upload, FileText, Check, AlertCircle, RefreshCw,
  Bell, ListChecks, ArrowUpRight, Zap, Play, Plus, X,
  ChevronLeft, Copy, Filter, Layers, UserCheck
} from 'lucide-react';
import { studyPlanAPI } from '../services/api';

const SUBJECT_CONFIG = {
  Physics: { icon: '⚡', color: 'blue', border: 'border-blue-400/40', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-cyan-400' },
  Chemistry: { icon: '🧪', color: 'emerald', border: 'border-emerald-400/40', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' },
  Mathematics: { icon: '📐', color: 'cyan', border: 'border-cyan-400/40', bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-300' },
  Biology: { icon: '🧬', color: 'purple', border: 'border-purple-400/40', bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400' }
};

export default function StudyPlan() {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'routine', 'exams'
  
  // Interactive Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedLectureForModal, setSelectedLectureForModal] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(null);

  // New Custom Lecture Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newGrade, setNewGrade] = useState('class-12');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('10:30 AM');
  const [newTopicQuery, setNewTopicQuery] = useState('');

  // Timetable upload & configuration state
  const [showUploader, setShowUploader] = useState(false);
  const [timetableFile, setTimetableFile] = useState(null);
  const [schoolStart, setSchoolStart] = useState('08:00');
  const [schoolEnd, setSchoolEnd] = useState('14:00');
  const [coachingStart, setCoachingStart] = useState('16:30');
  const [coachingEnd, setCoachingEnd] = useState('18:30');
  const [targetGrade, setTargetGrade] = useState('class-12');
  const [uploading, setUploading] = useState(false);

  // Exam checklist state
  const [examChecklists, setExamChecklists] = useState({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [planRes, examRes, calRes] = await Promise.all([
        studyPlanAPI.get(),
        studyPlanAPI.getExamSchedule(),
        studyPlanAPI.getCalendarEvents()
      ]);
      if (planRes.data?.success) setPlanData(planRes.data.plan);
      if (examRes.data?.success) setExamData(examRes.data);
      if (calRes.data?.success) setCalendarEvents(calRes.data.events || []);
    } catch (err) {
      console.error('Error loading study plan data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTimetableSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      if (timetableFile) formData.append('timetableFile', timetableFile);
      formData.append('schoolStart', schoolStart);
      formData.append('schoolEnd', schoolEnd);
      formData.append('coachingStart', coachingStart);
      formData.append('coachingEnd', coachingEnd);
      formData.append('targetGrade', targetGrade);

      const res = await studyPlanAPI.uploadTimetable(formData);
      if (res.data?.success) {
        setShowUploader(false);
        setActiveTab('routine');
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to upload timetable:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleScheduleCustomLecture = async (e) => {
    e.preventDefault();
    try {
      const res = await studyPlanAPI.scheduleLecture({
        title: newTitle || `${newSubject}: Guided Concept Session`,
        subject: newSubject,
        grade: newGrade,
        date: newDate,
        time: newTime,
        topicQuery: newTopicQuery || newTitle
      });

      if (res.data?.success) {
        setShowScheduleModal(false);
        setNewTitle('');
        setNewTopicQuery('');
        loadAllData();
      }
    } catch (err) {
      console.error('Failed to schedule lecture:', err);
    }
  };

  const handleToggleChecklist = (examId, itemIdx) => {
    setExamChecklists(prev => {
      const current = prev[examId] || {};
      return {
        ...prev,
        [examId]: {
          ...current,
          [itemIdx]: !current[itemIdx]
        }
      };
    });
  };

  const handleJoinLiveLecture = (lec) => {
    navigate(`/teacher?topic=${encodeURIComponent(lec.topicQuery || lec.title)}&subject=${encodeURIComponent(lec.subject)}&grade=${encodeURIComponent(lec.grade)}&lectureId=${lec.id}`);
  };

  const handleCopyFormula = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Filter calendar events
  const filteredEvents = calendarEvents.filter(ev => {
    const matchSubject = subjectFilter === 'all' || ev.subject.toLowerCase() === subjectFilter.toLowerCase();
    return matchSubject;
  });

  const selectedDateEvents = filteredEvents.filter(ev => ev.date === selectedDate);

  // Generate 7-day calendar strip
  const today = new Date();
  const dateStrip = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const eventCount = filteredEvents.filter(e => e.date === dateStr).length;
    return { dateStr, dayName, dayNum, eventCount };
  });

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 transition-colors pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-950/60 dark:via-slate-900 dark:to-cyan-950/60 border border-blue-200 dark:border-blue-500/20 backdrop-blur-xl shadow-sm dark:shadow-2xl transition-all">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CALENDAR & LIVE LECTURE ECOSYSTEM</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Interactive Calendar & <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Live Lecture Studio</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Every scheduled session links directly into the ARIA AI Live Classroom with live voice explanation, blackboard drawing, and integrated subject formula sheets.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Live Lecture</span>
            </button>

            <button
              onClick={() => setShowUploader(!showUploader)}
              className="px-5 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{showUploader ? 'Close Timetable' : 'Upload Timetable'}</span>
            </button>

            <button
              onClick={() => navigate('/revision')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Class 9-12 Formulas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'calendar'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendar & Live Lectures</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold">
            {calendarEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'routine'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Routine & Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'exams'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Exam & Test Schedules</span>
          {examData?.exams && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
              {examData.exams.length}
            </span>
          )}
        </button>
      </div>

      {/* Timetable Upload Drawer */}
      {showUploader && (
        <form 
          onSubmit={handleTimetableSubmit} 
          className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-blue-300 dark:border-blue-500/30 backdrop-blur-xl space-y-6 shadow-xl animate-fadeIn"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Upload Timetable & Sync Routine</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                EduVerse AI calculates optimal review periods around your school & coaching commitments.
              </p>
            </div>
            <button type="button" onClick={() => setShowUploader(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Timetable (PDF, Image, DOCX)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition bg-slate-50 dark:bg-slate-800/50">
                <input 
                  type="file" 
                  id="timetable-file" 
                  onChange={(e) => setTimetableFile(e.target.files[0])}
                  className="hidden" 
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                />
                <label htmlFor="timetable-file" className="cursor-pointer space-y-2 block">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {timetableFile ? timetableFile.name : 'Click to select timetable file'}
                  </p>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">School Starts</label>
                  <input 
                    type="time" 
                    value={schoolStart} 
                    onChange={(e) => setSchoolStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">School Ends</label>
                  <input 
                    type="time" 
                    value={schoolEnd} 
                    onChange={(e) => setSchoolEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Coaching Starts</label>
                  <input 
                    type="time" 
                    value={coachingStart} 
                    onChange={(e) => setCoachingStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Coaching Ends</label>
                  <input 
                    type="time" 
                    value={coachingEnd} 
                    onChange={(e) => setCoachingEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Grade / Class</label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="class-9">Class 9th</option>
                  <option value="class-10">Class 10th</option>
                  <option value="class-11">Class 11th</option>
                  <option value="class-12">Class 12th (Board & Competitive)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing Routine...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Generate AI Timetable Routine</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SCHEDULE CUSTOM LIVE LECTURE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleScheduleCustomLecture}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 border border-blue-500/30 shadow-2xl space-y-5 animate-scaleUp"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Schedule Live AI Lecture
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lecture Topic / Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Wave Optics & Double Slit Experiment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Physics">Physics ⚡</option>
                    <option value="Chemistry">Chemistry 🧪</option>
                    <option value="Mathematics">Mathematics 📐</option>
                    <option value="Biology">Biology 🧬</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Grade / Class</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="class-9">Class 9th</option>
                    <option value="class-10">Class 10th</option>
                    <option value="class-11">Class 11th</option>
                    <option value="class-12">Class 12th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <input 
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time</label>
                  <input 
                    type="text"
                    value={newTime}
                    placeholder="10:30 AM"
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                Add to Live Calendar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: CALENDAR & LIVE LECTURES */}
      {activeTab === 'calendar' && (
        <div className="space-y-8">
          {/* Top Date Strip & Subject Filter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Select Date & Subject Track</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any day to inspect live interactive sessions, objectives, and formulas.
                </p>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Subjects' },
                  { id: 'physics', label: 'Physics ⚡' },
                  { id: 'chemistry', label: 'Chemistry 🧪' },
                  { id: 'mathematics', label: 'Mathematics 📐' },
                  { id: 'biology', label: 'Biology 🧬' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubjectFilter(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      subjectFilter === s.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 7-Day Interactive Date Picker */}
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 pt-1">
              {dateStrip.map((item, idx) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-3.5 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-[1.03]'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-blue-400 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.dayName}
                    </span>
                    <span className="text-xl font-extrabold">{item.dayNum}</span>
                    <div className="flex items-center justify-center gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : item.eventCount > 0 
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-cyan-300' 
                          : 'text-slate-400'
                      }`}>
                        {item.eventCount} {item.eventCount === 1 ? 'Lecture' : 'Lectures'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled Live Lectures for Selected Date */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-500" />
                <span>Live Interactive Lectures on {selectedDate}</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {selectedDateEvents.length} Sessions Ready
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-white text-base">
                  No lectures scheduled for this date with selected filters
                </h4>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                >
                  + Schedule a Lecture for this Day
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedDateEvents.map((lec) => {
                  const sConf = SUBJECT_CONFIG[lec.subject] || SUBJECT_CONFIG.Physics;
                  return (
                    <div
                      key={lec.id}
                      className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-xs hover:shadow-md transition space-y-5 flex flex-col justify-between group hover:border-blue-400/60"
                    >
                      <div className="space-y-4">
                        {/* Top Bar */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sConf.bg} ${sConf.text} border ${sConf.border}`}>
                                {sConf.icon} {lec.subject} • {lec.grade.toUpperCase()}
                              </span>
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                ⏰ {lec.startTime} - {lec.endTime}
                              </span>
                            </div>
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition">
                              {lec.title}
                            </h4>
                          </div>

                          <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30 shrink-0">
                            ● Live Ready
                          </div>
                        </div>

                        {/* Objectives */}
                        {lec.objectives && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Key Objectives
                            </span>
                            <div className="space-y-1">
                              {lec.objectives.map((obj, oIdx) => (
                                <div key={oIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span>{obj}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Associated Formulas Box */}
                        {lec.keyFormulas && lec.keyFormulas.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Attached Formulas ({lec.keyFormulas.length})
                              </span>
                              <button
                                onClick={() => setSelectedLectureForModal(lec)}
                                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                              >
                                View Details ➔
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {lec.keyFormulas.slice(0, 2).map((f, fIdx) => (
                                <div 
                                  key={fIdx}
                                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2"
                                >
                                  <div className="truncate">
                                    <span className="text-[10px] text-slate-400 block">{f.name}</span>
                                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 truncate">
                                      {f.formula}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleCopyFormula(f.formula, `${lec.id}-${fIdx}`)}
                                    className="p-1 rounded text-slate-400 hover:text-blue-500 shrink-0"
                                  >
                                    {copiedFormula === `${lec.id}-${fIdx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Launch Live Lecture Button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedLectureForModal(lec)}
                          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Formula Sheet</span>
                        </button>

                        <button
                          onClick={() => handleJoinLiveLecture(lec)}
                          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Join Live Lecture with ARIA</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ROUTINE & TIMETABLE */}
      {activeTab === 'routine' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 border border-blue-300 dark:border-blue-500/30 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Active Synced Timetable Rhythm
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-700 dark:text-cyan-300 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700/50">
                Class 12th Master Prep
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                { time: '06:45 AM - 07:30 AM', title: 'Formula Recall', icon: '🌅', desc: '15m formula rapid fire' },
                { time: '08:00 AM - 02:00 PM', title: 'School / Academics', icon: '🏫', desc: 'Classes & Lab sessions' },
                { time: '04:30 PM - 06:30 PM', title: 'Coaching / Tuition', icon: '🎒', desc: 'Core subject tutorials' },
                { time: '07:30 PM - 09:00 PM', title: 'AI Deep Dive', icon: '💡', desc: 'Concept derivations & doubts' },
                { time: '09:15 PM - 10:00 PM', title: 'Timed Practice', icon: '⚡', desc: 'Active recall & PYQ quiz' }
              ].map((block, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{block.icon}</span>
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">{block.time}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{block.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{block.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Weekly Daily Lessons & Review</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/30">
                <Flame className="w-4 h-4" />
                <span>7-Day Streak Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {planData?.currentWeek?.map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/teacher?topic=${encodeURIComponent(day.topic)}`)}
                  className={`p-4 rounded-3xl border backdrop-blur-xl transition cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs ${
                    day.status === 'completed'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500'
                      : day.status === 'in-progress'
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-500/50 hover:border-cyan-400'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{day.day}</span>
                      {day.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition line-clamp-2">
                      {day.topic}
                    </h4>
                    {day.slot && (
                      <span className="text-[10px] text-blue-600 dark:text-cyan-400 block font-mono">
                        {day.slot}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {day.duration} mins
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXAM SCHEDULE */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Upcoming Exam & Test Schedule</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track exam countdowns, syllabus checklists, and required formulas.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700/50">
              Readiness: {examData?.summary?.overallReadiness || '82%'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examData?.exams?.map((exam) => (
              <div
                key={exam.id}
                className="rounded-3xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 text-[10px] font-bold border border-blue-200 dark:border-blue-700/50">
                          {exam.grade}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          📅 {exam.date} ({exam.time})
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {exam.name}
                      </h3>
                    </div>

                    <div className="px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-center shrink-0">
                      <span className="text-lg font-extrabold block leading-tight">{exam.daysLeft}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">Days Left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-600 dark:text-slate-400">Target Score: <strong className="text-blue-600 dark:text-cyan-400 font-bold">{exam.targetScore}</strong></span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{exam.status}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Syllabus Breakdown:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {exam.syllabus?.map((sub, sIdx) => (
                        <div key={sIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="line-clamp-1">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {exam.keyFormulasToReview && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Must-Revise Formulas:</span>
                      <div className="space-y-1">
                        {exam.keyFormulasToReview.map((f, fIdx) => (
                          <div key={fIdx} className="p-2 rounded-xl bg-blue-900/5 dark:bg-black/30 text-[11px] font-mono text-blue-700 dark:text-cyan-300 border border-blue-100 dark:border-blue-900/40">
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <ListChecks className="w-3.5 h-3.5 text-blue-500" />
                      <span>Exam Preparation Checklist</span>
                    </span>
                    <div className="space-y-1.5">
                      {exam.checklist?.map((chk, cIdx) => {
                        const isDone = examChecklists[exam.id]?.[cIdx] !== undefined 
                          ? examChecklists[exam.id][cIdx] 
                          : chk.completed;

                        return (
                          <label 
                            key={cIdx} 
                            onClick={() => handleToggleChecklist(exam.id, cIdx)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 cursor-pointer text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <input 
                              type="checkbox" 
                              checked={isDone} 
                              readOnly
                              className="rounded-md accent-blue-600 cursor-pointer"
                            />
                            <span className={isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}>
                              {chk.item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => navigate('/revision')}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Formula Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate(`/teacher?topic=${encodeURIComponent(exam.name)}`)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Live AI Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORMULA MODAL FOR SELECTED LECTURE */}
      {selectedLectureForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedLectureForModal.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedLectureForModal.subject} • {selectedLectureForModal.grade.toUpperCase()}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLectureForModal(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Attached Formulas & Theorems:
              </span>
              {selectedLectureForModal.keyFormulas?.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
                    <button
                      onClick={() => handleCopyFormula(f.formula, `modal-${idx}`)}
                      className="text-slate-400 hover:text-amber-500 p-1 rounded"
                    >
                      {copiedFormula === `modal-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 font-mono text-cyan-300 text-xs font-bold overflow-x-auto">
                    {f.formula}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedLectureForModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const lec = selectedLectureForModal;
                  setSelectedLectureForModal(null);
                  handleJoinLiveLecture(lec);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Live Session with ARIA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
