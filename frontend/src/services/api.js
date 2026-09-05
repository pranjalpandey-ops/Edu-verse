import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduverse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.io client singleton
let socketInstance = null;
export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });
  }
  return socketInstance;
};

// API Services
export const searchAPI = {
  search: (q) => API.get(`/search?q=${encodeURIComponent(q)}`),
};

export const youtubeAPI = {
  search: (q, params = {}) => API.get(`/youtube/search?q=${encodeURIComponent(q)}`, { params }),
  getVideo: (videoId, topic) => API.get(`/youtube/${videoId}${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`),
  ask: (videoId, data) => API.post(`/youtube/${videoId}/ask`, data),
  summary: (videoId, data) => API.post(`/youtube/${videoId}/summary`, data),
  notes: (videoId, data) => API.post(`/youtube/${videoId}/notes`, data),
  quiz: (videoId, data) => API.post(`/youtube/${videoId}/quiz`, data),
  updateProgress: (videoId, data) => API.post(`/youtube/${videoId}/progress`, data),
  getHistory: () => API.get('/youtube/history')
};

export const videoLearningAPI = {
  updateProgress: (videoId, data) => API.post(`/youtube/${videoId}/progress`, data),
  getHistory: () => API.get('/youtube/history')
};

export const lessonAPI = {
  generate: (data) => API.post('/lessons/generate', data),
  getById: (id) => API.get(`/lessons/${id}`),
  getAll: () => API.get('/lessons'),
  submitCheckpoint: (lessonId, data) => API.post(`/lessons/${lessonId}/checkpoint`, data),
  generateFromMaterial: (materialId, data) => API.post(`/materials/${materialId}/lesson`, data)
};

export const teacherAPI = {
  chat: (data) => API.post('/teacher/chat', data),
  speak: (data) => API.post('/teacher/speak', data),
  diagnose: (data) => API.post('/teacher/diagnose', data)
};

export const quizAPI = {
  generate: (data) => API.post('/quizzes/generate', data),
  getById: (id) => API.get(`/quizzes/${id}`),
  submit: (quizId, data) => (quizId ? API.post(`/quizzes/${quizId}/submit`, data) : API.post('/quizzes/submit', data)),
  adaptive: (data) => API.post('/quizzes/adaptive', data),
  getAttempts: () => API.get('/quizzes/attempts'),
  getPublic: () => API.get('/quizzes/public'),
  createLiveRoom: (data) => API.post('/quizzes/live/create', data),
  joinLiveRoom: (roomCode, data) => API.post(`/quizzes/live/${roomCode}/join`, data),
  getLiveRoom: (roomCode) => API.get(`/quizzes/live/${roomCode}`)
};

export const liveQuizAPI = {
  create: (data) => API.post('/live-quiz/create', data),
  join: (roomCode, data) => API.post(`/live-quiz/${roomCode}/join`, data),
  get: (roomCode) => API.get(`/live-quiz/${roomCode}`)
};

export const studyPlanAPI = {
  get: () => API.get('/study-plan'),
  generate: (data) => API.post('/study-plan/generate', data),
  uploadTimetable: (formData) => API.post('/study-plan/timetable', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getExamSchedule: () => API.get('/study-plan/exam-schedule'),
  getCalendarEvents: () => API.get('/study-plan/calendar-events'),
  scheduleLecture: (data) => API.post('/study-plan/schedule-lecture', data)
};

export const formulaAPI = {
  getCurriculum: (params) => API.get('/formulas/curriculum', { params }),
  search: (query) => API.get(`/formulas/search?query=${encodeURIComponent(query)}`),
  getGrades: () => API.get('/formulas/grades')
};

export const revisionAPI = {
  getItems: () => API.get('/revision/today'),
  getToday: () => API.get('/revision/today'),
  review: (data) => API.post('/revision/review', data),
  submitReview: (data) => API.post('/revision/review', data),
  getUpcoming: () => API.get('/revision/upcoming')
};

export const learningProfileAPI = {
  get: () => API.get('/learning-profile'),
  update: (data) => API.put('/learning-profile', data),
  save: (data) => API.post('/learning-profile', data)
};

export const recommendationsAPI = {
  get: () => API.get('/recommendations')
};

export const analyticsAPI = {
  get: () => API.get('/analytics'),
  getWeekly: () => API.get('/analytics/weekly'),
  getSubjects: () => API.get('/analytics/subjects')
};

export const flashcardsAPI = {
  generate: (data) => API.post('/flashcards/generate', data),
  getAll: () => API.get('/flashcards'),
  review: (id, quality) => API.post(`/flashcards/${id}/review`, { quality }),
  delete: (id) => API.delete(`/flashcards/${id}`)
};

export const dailyChallengeAPI = {
  getToday: () => API.get('/challenge/today'),
  submit: (data) => API.post('/challenge/submit', data)
};

export const homeworkAPI = {
  generate: (data) => API.post('/homework/generate', data),
  getAll: () => API.get('/homework'),
  getById: (id) => API.get(`/homework/${id}`),
  submit: (id, data) => API.post(`/homework/${id}/submit`, data)
};

export const knowledgeGraphAPI = {
  getPrerequisites: (params) => API.get('/knowledge-graph/prerequisites', { params })
};

export const conceptMasteryAPI = {
  getAll: () => API.get('/progress'),
  getWeak: () => API.get('/recommendations')
};

export const noteAPI = {
  getAll: () => API.get('/notes'),
  create: (data) => API.post('/notes', data),
  update: (id, data) => API.put(`/notes/${id}`, data),
  delete: (id) => API.delete(`/notes/${id}`)
};

export const progressAPI = {
  get: () => API.get('/progress')
};

export const materialAPI = {
  upload: (formData) => API.post('/materials/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => API.get('/materials'),
  getById: (id) => API.get(`/materials/${id}`),
  ask: (id, data) => API.post(`/materials/${id}/ask`, data),
  summarize: (id) => API.post(`/materials/${id}/summarize`),
  lesson: (id, data) => API.post(`/materials/${id}/lesson`, data)
};

export default API;
