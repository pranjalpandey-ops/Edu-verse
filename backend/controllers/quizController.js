const { Quiz, QuizRoom } = require('../models');
const aiService = require('../services/aiService');
const misconceptionDetector = require('../ai/misconceptionDetector');

class QuizController {
  async generateQuiz(req, res) {
    try {
      const { topic = 'Universal Science', difficulty = 'Medium', count = 5, category = 'General' } = req.body;
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
      const questionCount = Math.min(Math.max(parseInt(count) || 5, 3), 15);

      const questions = [];
      for (let i = 1; i <= questionCount; i++) {
        questions.push({
          id: `q_${i}`,
          questionNumber: i,
          type: 'MCQ',
          concept: `${cleanTopic} - Key Concept ${i}`,
          question: i === 1
            ? `Which foundational principle dictates the core mechanism of ${cleanTopic}?`
            : i === 2
            ? `In ${cleanTopic}, what is the direct consequence of increasing system constraints under constant driving force?`
            : i === 3
            ? `Which formula or analytical model accurately describes the relationship between variables in ${cleanTopic}?`
            : `How does optimizing boundary parameters in ${cleanTopic} impact practical real-world efficiency?`,
          options: [
            { id: 'A', text: i % 2 === 1 ? `Standard governed balance between inputs and throughput in ${cleanTopic}` : `Throughput decreases proportionally with increased opposition`, correct: true },
            { id: 'B', text: `Unconstrained exponential increase without energy input`, correct: false },
            { id: 'C', text: `Random behavior independent of initial parameters`, correct: false },
            { id: 'D', text: `Completely static state that cannot be modified`, correct: false }
          ],
          explanation: `In ${cleanTopic}, outcomes are strictly bounded by fundamental laws and input-to-resistance proportions.`
        });
      }

      const quizData = {
        title: `${cleanTopic} Mastery Challenge`,
        topic: cleanTopic,
        category,
        difficulty,
        timeLimit: questionCount * 60, // seconds
        totalQuestions: questionCount,
        questions,
        createdBy: req.user ? req.user.id : 'ai_system',
        createdAt: new Date().toISOString()
      };

      return res.json({ success: true, quiz: quizData });
    } catch (error) {
      console.error('[QuizController] generateQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitQuiz(req, res) {
    try {
      const { quizId, topic = 'Topic Mastery', answers = [], timeSpent = 60 } = req.body;
      
      let correctCount = 0;
      const feedbackList = [];
      let totalMasteryGain = 0;

      answers.forEach((ans, idx) => {
        const isCorrect = ans.isCorrect !== undefined ? ans.isCorrect : (ans.selectedOption === 'A' || ans.correct === true);
        if (isCorrect) {
          correctCount++;
          totalMasteryGain += 15;
          feedbackList.push({
            questionId: ans.questionId || `q_${idx + 1}`,
            correct: true,
            feedback: 'Excellent work! Your answer matches first principles.'
          });
        } else {
          totalMasteryGain = Math.max(0, totalMasteryGain - 5);
          const diag = misconceptionDetector.diagnoseAnswer(
            { question: ans.questionText || 'Concept Question', options: [{ id: 'A', correct: true }] },
            ans.selectedOption || 'B',
            topic
          );
          feedbackList.push({
            questionId: ans.questionId || `q_${idx + 1}`,
            correct: false,
            misconception: diag.misconception,
            remedialExplanation: diag.remedialExplanation,
            followUpQuestion: diag.followUpQuestion,
            feedback: diag.feedback
          });
        }
      });

      const totalQuestions = answers.length || 5;
      const percentage = Math.round((correctCount / totalQuestions) * 100);

      const result = {
        score: correctCount,
        totalQuestions,
        percentage,
        timeSpent,
        masteryGain: totalMasteryGain,
        masteryLevel: percentage >= 80 ? 'Mastered' : percentage >= 60 ? 'Proficient' : 'Developing',
        feedbackList,
        submittedAt: new Date().toISOString()
      };

      return res.json({ success: true, result });
    } catch (error) {
      console.error('[QuizController] submitQuiz error:', error);
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
      const { topic = 'Live Battle', difficulty = 'Medium', questionCount = 5 } = req.body;
      const roomCode = 'EDU-' + Math.floor(1000 + Math.random() * 9000);

      const room = {
        roomCode,
        topic,
        difficulty,
        hostId: req.user ? req.user.id : 'host_1',
        hostName: req.user ? req.user.name : 'Professor AI',
        status: 'waiting', // waiting, active, finished
        questionCount,
        currentQuestionIndex: 0,
        participants: [
          { id: 'host_p', name: req.user ? req.user.name : 'Host Player', score: 0, ready: true, isHost: true }
        ],
        createdAt: new Date().toISOString()
      };

      return res.json({ success: true, room });
    } catch (error) {
      console.error('[QuizController] createLiveRoom error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRoom(req, res) {
    try {
      const { roomCode } = req.params;
      const cleanCode = roomCode.toUpperCase();

      const room = {
        roomCode: cleanCode,
        topic: 'Live STEM Arena',
        difficulty: 'Medium',
        status: 'waiting',
        questionCount: 5,
        currentQuestionIndex: 0,
        participants: [
          { id: 'p_1', name: 'Alex Runner', score: 240, ready: true },
          { id: 'p_2', name: 'Sophia AI', score: 190, ready: true },
          { id: 'p_3', name: 'You', score: 0, ready: true }
        ]
      };

      return res.json({ success: true, room });
    } catch (error) {
      console.error('[QuizController] getRoom error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new QuizController();
