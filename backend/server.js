require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const { connectDB } = require('./utils/db');
const { seedDemoData } = require('./utils/demoData');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const noteRoutes = require('./routes/noteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
const quizRoutes = require('./routes/quizRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const revisionRoutes = require('./routes/revisionRoutes');
const formulaRoutes = require('./routes/formulaRoutes');
const learningProfileRoutes = require('./routes/learningProfileRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const knowledgeGraphRoutes = require('./routes/knowledgeGraphRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static upload directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'EduVerse AI Backend',
    version: '2.0.0',
    features: ['Search & Learn', 'Dynamic AI Teacher', 'Document RAG', 'YouTube Learning', 'Live Multiplayer Quiz', 'Spaced Repetition'],
    demoMode: process.env.DEMO_MODE || 'true',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/live-quiz', quizRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/revision', revisionRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/learning-profile', learningProfileRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/knowledge-graph', knowledgeGraphRoutes);

// Global Error Handler
app.use(errorHandler);

// Live Multiplayer Socket.IO Store
const liveRooms = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join Room
  socket.on('join_room', ({ roomCode, username, avatar }) => {
    const code = (roomCode || 'ARENA-1').toUpperCase();
    socket.join(code);

    if (!liveRooms.has(code)) {
      liveRooms.set(code, {
        roomCode: code,
        hostId: socket.id,
        status: 'lobby', // lobby, active, finished
        questionIndex: 0,
        participants: []
      });
    }

    const room = liveRooms.get(code);
    const existingIndex = room.participants.findIndex(p => p.socketId === socket.id);
    const participant = {
      socketId: socket.id,
      username: username || `Learner_${socket.id.slice(0, 4)}`,
      avatar: avatar || '🧑‍🚀',
      score: 0,
      streak: 0,
      isHost: room.participants.length === 0 || socket.id === room.hostId
    };

    if (existingIndex >= 0) {
      room.participants[existingIndex] = participant;
    } else {
      room.participants.push(participant);
    }

    io.to(code).emit('room_update', {
      roomCode: code,
      status: room.status,
      participants: room.participants,
      questionIndex: room.questionIndex
    });
  });

  // Start Quiz
  socket.on('start_quiz', ({ roomCode }) => {
    const code = (roomCode || '').toUpperCase();
    const room = liveRooms.get(code);
    if (room) {
      room.status = 'active';
      room.questionIndex = 0;
      io.to(code).emit('quiz_started', {
        roomCode: code,
        questionIndex: 0
      });
    }
  });

  // Submit Answer
  socket.on('submit_answer', ({ roomCode, questionIndex, isCorrect, timeRemaining }) => {
    const code = (roomCode || '').toUpperCase();
    const room = liveRooms.get(code);
    if (room) {
      const participant = room.participants.find(p => p.socketId === socket.id);
      if (participant) {
        if (isCorrect) {
          const speedBonus = Math.round((timeRemaining || 10) * 10);
          participant.score += (100 + speedBonus);
          participant.streak += 1;
        } else {
          participant.streak = 0;
        }
      }

      // Sort leaderboard
      room.participants.sort((a, b) => b.score - a.score);

      io.to(code).emit('leaderboard_update', {
        participants: room.participants
      });
    }
  });

  // Next Question
  socket.on('next_question', ({ roomCode, nextIndex }) => {
    const code = (roomCode || '').toUpperCase();
    const room = liveRooms.get(code);
    if (room) {
      room.questionIndex = nextIndex;
      io.to(code).emit('question_changed', {
        questionIndex: nextIndex
      });
    }
  });

  // Chat message in live room
  socket.on('send_chat', ({ roomCode, message, username }) => {
    const code = (roomCode || '').toUpperCase();
    io.to(code).emit('chat_received', {
      id: Date.now().toString(),
      sender: username || 'Learner',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('disconnect', () => {
    for (const [code, room] of liveRooms.entries()) {
      const pIdx = room.participants.findIndex(p => p.socketId === socket.id);
      if (pIdx >= 0) {
        room.participants.splice(pIdx, 1);
        if (room.participants.length === 0) {
          liveRooms.delete(code);
        } else {
          io.to(code).emit('room_update', {
            roomCode: code,
            status: room.status,
            participants: room.participants,
            questionIndex: room.questionIndex
          });
        }
      }
    }
  });
});

// Connect DB and Start Server
const startServer = async () => {
  await connectDB();
  await seedDemoData();

  server.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 EduVerse AI Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Socket.IO Live Multiplayer Engine Ready`);
    console.log(`================================================`);
  });
};

startServer();
