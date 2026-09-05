const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, (req, res) => quizController.generateQuiz(req, res));
router.post('/adaptive', protect, (req, res) => quizController.generateAdaptiveQuiz(req, res));
router.post('/:quizId/submit', protect, (req, res) => quizController.submitQuiz(req, res));
router.post('/submit', protect, (req, res) => quizController.submitQuiz(req, res));
router.get('/attempts', protect, (req, res) => quizController.getAttempts(req, res));
router.get('/public', (req, res) => quizController.getPublicQuizzes(req, res));
router.get('/:quizId', (req, res) => quizController.getQuizById(req, res));

// Live Quiz Room Endpoints
router.post('/live/create', protect, (req, res) => quizController.createLiveRoom(req, res));
router.post('/live/:roomCode/join', protect, (req, res) => quizController.joinLiveRoom(req, res));
router.get('/live/:roomCode', (req, res) => quizController.getRoom(req, res));

module.exports = router;
