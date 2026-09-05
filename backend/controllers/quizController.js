const { Quiz, QuizAttempt, QuizRoom, ConceptMastery, LearningProgress, Material, Lesson, DocumentChunk } = require('../models');
const aiService = require('../services/aiService');
const ragPipeline = require('../rag/ragPipeline');
const misconceptionDetector = require('../ai/misconceptionDetector');

class QuizController {
  async generateQuiz(req, res) {
    try {
      const {
        topic = 'Foundational Science & Technology',
        subject = 'General Studies',
        lessonId = null,
        materialId = null,
        videoId = null,
        difficulty = 'medium',
        questionCount = 5,
        language = 'English',
        questionTypes = ['mcq', 'true_false', 'short_answer']
      } = req.body;

      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
      const count = Math.min(Math.max(parseInt(questionCount) || 5, 3), 15);
      const cleanTopic = topic.trim();

      // Retrieve RAG context if materialId or lessonId exists
      let ragContext = null;
      if (materialId) {
        ragContext = await ragPipeline.buildGroundedPrompt(cleanTopic, materialId);
      } else if (lessonId) {
        const lesson = await Lesson.findById(lessonId);
        if (lesson && lesson.sections) {
          const text = lesson.sections.map(s => `${s.title}: ${s.explanation}`).join('\n\n');
          ragContext = { hasContext: true, groundedContext: text };
        }
      }

      // Generate questions with AI
      const questions = await aiService.generateQuizQuestions({
        topic: cleanTopic,
        subject,
        difficulty,
        questionCount: count,
        language,
        questionTypes,
        ragContext
      });

      // Save full quiz with answers to Database
      const quiz = await Quiz.create({
        userId,
        title: `${cleanTopic} Mastery Challenge`,
        topic: cleanTopic,
        subject,
        description: `Adaptive ${difficulty} quiz testing core concepts of ${cleanTopic}.`,
        sourceType: materialId ? 'material' : videoId ? 'video' : lessonId ? 'lesson' : 'topic',
        sourceId: materialId || videoId || lessonId || null,
        difficulty,
        questionCount: questions.length,
        timeLimit: questions.length * 60,
        language,
        questions,
        isLive: false,
        createdAt: new Date().toISOString()
      });

      // Return sanitized quiz to client (NO answers or explanations exposed!)
      const safeQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type || 'mcq',
        concept: q.concept || cleanTopic,
        difficulty: q.difficulty || difficulty,
        options: q.options ? q.options.map(opt => ({ id: opt.id, text: opt.text })) : undefined
      }));

      return res.status(201).json({
        success: true,
        quiz: {
          id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          subject: quiz.subject,
          description: quiz.description,
          difficulty: quiz.difficulty,
          questionCount: quiz.questionCount,
          timeLimit: quiz.timeLimit,
          language: quiz.language,
          questions: safeQuestions
        }
      });
    } catch (error) {
      console.error('[QuizController] generateQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getQuizById(req, res) {
    try {
      const quizId = req.params.quizId || req.params.id;
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }

      // Sanitize questions
      const safeQuestions = (quiz.questions || []).map(q => ({
        id: q.id,
        question: q.question,
        type: q.type || 'mcq',
        concept: q.concept || quiz.topic,
        difficulty: q.difficulty || quiz.difficulty,
        options: q.options ? q.options.map(opt => ({ id: opt.id, text: opt.text })) : undefined
      }));

      return res.json({
        success: true,
        quiz: {
          id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          subject: quiz.subject,
          description: quiz.description,
          difficulty: quiz.difficulty,
          questionCount: quiz.questionCount,
          timeLimit: quiz.timeLimit,
          language: quiz.language,
          questions: safeQuestions
        }
      });
    } catch (error) {
      console.error('[QuizController] getQuizById error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitQuiz(req, res) {
    try {
      const quizId = req.params.quizId || req.body.quizId;
      const { answers = [], timeTaken = 60 } = req.body;
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

      const quiz = await Quiz.findById(quizId);
      const questions = quiz ? quiz.questions : [];
      const topic = quiz ? quiz.topic : (req.body.topic || 'General Mastery');

      let correctCount = 0;
      let incorrectCount = 0;
      const conceptResults = {};
      const feedbackList = [];

      for (let i = 0; i < (questions.length > 0 ? questions.length : answers.length); i++) {
        const q = questions[i] || {};
        const qId = q.id || `q${i + 1}`;
        const studentAnsObj = answers.find(a => a.questionId === qId) || answers[i] || {};
        const studentAnswer = (studentAnsObj.answer !== undefined ? studentAnsObj.answer : studentAnsObj.selectedOption || '').toString().trim();
        const concept = q.concept || `${topic} - Concept ${i + 1}`;

        if (!conceptResults[concept]) {
          conceptResults[concept] = { total: 0, correct: 0 };
        }
        conceptResults[concept].total += 1;

        let isCorrect = false;
        let score = 0;
        let explanation = q.explanation || 'Matches core first principles.';
        let misconception = null;

        if (q.type === 'short_answer') {
          const evalResult = await aiService.evaluateOpenEndedAnswer({
            question: q.question,
            studentAnswer,
            concept,
            expectedAnswer: q.expectedAnswer
          });
          isCorrect = evalResult.correct;
          score = evalResult.score;
          explanation = evalResult.feedback;
          misconception = evalResult.misconception;
        } else {
          // MCQ / True_False
          const correctOpt = (q.options || []).find(o => o.correct === true) || { id: q.correctAnswer || 'A' };
          const normalizedStudent = studentAnswer.toUpperCase();
          const normalizedCorrect = (correctOpt.id || 'A').toUpperCase();

          isCorrect = normalizedStudent === normalizedCorrect;
          score = isCorrect ? 1.0 : 0.0;

          if (!isCorrect) {
            const diag = misconceptionDetector.diagnoseAnswer(q, studentAnswer, concept);
            misconception = diag.misconception ? diag.misconception.misconception : null;
          }
        }

        if (isCorrect) {
          correctCount++;
          conceptResults[concept].correct += 1;
          feedbackList.push({
            questionId: qId,
            questionText: q.question,
            correct: true,
            score,
            studentAnswer,
            correctAnswer: q.correctAnswer || (q.options ? q.options.find(o => o.correct)?.text : undefined),
            explanation,
            concept
          });
        } else {
          incorrectCount++;
          feedbackList.push({
            questionId: qId,
            questionText: q.question,
            correct: false,
            score,
            studentAnswer,
            correctAnswer: q.correctAnswer || (q.options ? q.options.find(o => o.correct)?.text : undefined),
            explanation,
            concept,
            misconception
          });
        }
      }

      const totalQuestions = Math.max(1, correctCount + incorrectCount);
      const percentage = Math.round((correctCount / totalQuestions) * 100);

      // Classify Strong & Weak concepts
      const strongConcepts = [];
      const weakConcepts = [];
      for (const [cName, data] of Object.entries(conceptResults)) {
        const cPercent = Math.round((data.correct / data.total) * 100);
        if (cPercent >= 75) {
          strongConcepts.push({ concept: cName, score: cPercent });
        } else {
          weakConcepts.push({ concept: cName, score: cPercent });
        }

        // Update ConceptMastery in DB
        const existingMastery = await ConceptMastery.findOne({ userId, concept: cName });
        if (existingMastery) {
          await ConceptMastery.updateOne({ userId, concept: cName }, {
            masteryScore: Math.round((existingMastery.masteryScore + cPercent) / 2),
            lastTested: new Date().toISOString()
          });
        } else {
          await ConceptMastery.create({
            userId,
            concept: cName,
            masteryScore: cPercent,
            status: cPercent >= 75 ? 'mastered' : 'learning',
            lastTested: new Date().toISOString()
          });
        }
      }

      // Save Quiz Attempt
      const attempt = await QuizAttempt.create({
        userId,
        quizId: quizId || 'direct_quiz',
        topic,
        score: correctCount,
        percentage,
        totalQuestions,
        correctCount,
        incorrectCount,
        timeTaken,
        conceptResults: Object.entries(conceptResults).map(([k, v]) => ({ concept: k, ...v })),
        strongConcepts: strongConcepts.map(s => s.concept),
        weakConcepts: weakConcepts.map(w => w.concept),
        feedbackList,
        completedAt: new Date().toISOString()
      });

      return res.json({
        success: true,
        result: {
          attemptId: attempt._id,
          quizId,
          topic,
          score: correctCount,
          totalQuestions,
          percentage,
          correctCount,
          incorrectCount,
          timeTaken,
          strongConcepts,
          weakConcepts,
          feedbackList,
          recommendedRevision: weakConcepts.length > 0
            ? `Review the foundational rules and boundary conditions for ${weakConcepts.map(w => w.concept).join(', ')}.`
            : `Outstanding mastery! You have scored ${percentage}% across all evaluated concepts.`,
          recommendedNextLesson: `Deep Dive & Problem Solving: ${topic}`,
          submittedAt: attempt.completedAt
        }
      });
    } catch (error) {
      console.error('[QuizController] submitQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateAdaptiveQuiz(req, res) {
    try {
      const { topic = 'Core STEM' } = req.body;
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

      // Inspect student's mastery in this topic
      const masteries = await ConceptMastery.find({ userId });
      const avgMastery = masteries.length > 0
        ? Math.round(masteries.reduce((sum, m) => sum + (m.masteryScore || 50), 0) / masteries.length)
        : 65;

      let difficulty = 'medium';
      if (avgMastery >= 80) {
        difficulty = 'hard';
      } else if (avgMastery < 50) {
        difficulty = 'easy';
      }

      req.body.difficulty = difficulty;
      req.body.topic = topic;
      return this.generateQuiz(req, res);
    } catch (error) {
      console.error('[QuizController] generateAdaptiveQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAttempts(req, res) {
    try {
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
      const attempts = await QuizAttempt.find({ userId });
      return res.json({ success: true, attempts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPublicQuizzes(req, res) {
    try {
      const sampleQuizzes = [
        {
          id: 'quiz_pub_1',
          title: 'Quantum Mechanics & Wave Functions',
          topic: 'Quantum Physics',
          difficulty: 'Hard',
          questionCount: 5,
          playCount: 1420,
          avgScore: '74%',
          badge: 'Trending Challenge'
        },
        {
          id: 'quiz_pub_2',
          title: 'Cellular Respiration & Krebs Cycle',
          topic: 'Cell Biology',
          difficulty: 'Medium',
          questionCount: 5,
          playCount: 2890,
          avgScore: '82%',
          badge: 'Popular'
        },
        {
          id: 'quiz_pub_3',
          title: 'Binary Search Trees & Graph Traversal',
          topic: 'Computer Science',
          difficulty: 'Medium',
          questionCount: 5,
          playCount: 3100,
          avgScore: '79%',
          badge: 'Editor Choice'
        },
        {
          id: 'quiz_pub_4',
          title: 'Differential Calculus & Optimization',
          topic: 'Mathematics',
          difficulty: 'Hard',
          questionCount: 5,
          playCount: 1980,
          avgScore: '68%',
          badge: 'Brain Buster'
        }
      ];

      return res.json({ success: true, quizzes: sampleQuizzes });
    } catch (error) {
      console.error('[QuizController] getPublicQuizzes error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createLiveRoom(req, res) {
    try {
      const { topic = 'Live STEM Arena', difficulty = 'Medium', questionCount = 5, quizId = null } = req.body;
      const roomCode = 'EDU-' + Math.floor(1000 + Math.random() * 9000);
      const userId = req.user ? (req.user._id || req.user.id) : 'host_user';
      const userName = req.user ? req.user.name : 'Host Professor';

      const room = await QuizRoom.create({
        roomCode,
        hostId: userId,
        quizId: quizId || 'live_quick_quiz',
        topic,
        difficulty,
        status: 'waiting', // waiting, started, finished
        questionCount,
        participants: [
          { userId, name: userName, score: 0, correct: 0, answered: 0, joinedAt: new Date().toISOString(), connected: true }
        ],
        currentQuestion: 0,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({ success: true, roomCode, room });
    } catch (error) {
      console.error('[QuizController] createLiveRoom error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async joinLiveRoom(req, res) {
    try {
      const { roomCode } = req.params;
      const cleanCode = (roomCode || '').toUpperCase().trim();
      const userId = req.user ? (req.user._id || req.user.id) : 'guest_' + Math.floor(Math.random() * 1000);
      const userName = req.user ? req.user.name : 'Learner_' + cleanCode.slice(-3);

      const room = await QuizRoom.findOne({ roomCode: cleanCode });
      if (!room) {
        return res.status(404).json({ success: false, message: `Room ${cleanCode} does not exist.` });
      }

      if (room.status === 'finished') {
        return res.status(400).json({ success: false, message: 'This live quiz has already concluded.' });
      }

      const existing = (room.participants || []).find(p => p.userId === userId);
      if (!existing) {
        room.participants.push({
          userId,
          name: userName,
          score: 0,
          correct: 0,
          answered: 0,
          joinedAt: new Date().toISOString(),
          connected: true
        });
        await QuizRoom.updateOne({ roomCode: cleanCode }, { participants: room.participants });
      }

      return res.json({ success: true, roomCode: cleanCode, room });
    } catch (error) {
      console.error('[QuizController] joinLiveRoom error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRoom(req, res) {
    try {
      const { roomCode } = req.params;
      const cleanCode = (roomCode || '').toUpperCase().trim();
      const room = await QuizRoom.findOne({ roomCode: cleanCode });
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      return res.json({ success: true, room });
    } catch (error) {
      console.error('[QuizController] getRoom error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new QuizController();
