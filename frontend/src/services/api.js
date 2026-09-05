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
  search: (q) => API.get(`/youtube/search?q=${encodeURIComponent(q)}`),
  getVideo: (videoId, topic) => API.get(`/youtube/${videoId}${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`),
  ask: (data) => API.post('/youtube/ask', data),
  quiz: (data) => API.post('/youtube/quiz', data),
  notes: (data) => API.post('/youtube/notes', data)
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
  submit: (data) => API.post('/quizzes/submit', data),
  getPublic: () => API.get('/quizzes/public'),
  createLiveRoom: (data) => API.post('/quizzes/live/create', data),
  getLiveRoom: (roomCode) => API.get(`/quizzes/live/${roomCode}`)
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
  getItems: () => API.get('/revision'),
  review: (data) => API.post('/revision/review', data)
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
  getById: (id) => API.get(`/materials/${id}`)
};

export default API;
