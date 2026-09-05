const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/generate', (req, res) => quizController.generateQuiz(req, res));
router.post('/submit', (req, res) => quizController.submitQuiz(req, res));
router.get('/public', (req, res) => quizController.getPublicQuizzes(req, res));
router.post('/live/create', (req, res) => quizController.createLiveRoom(req, res));
router.get('/live/:roomCode', (req, res) => quizController.getRoom(req, res));

module.exports = router;
