const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', (req, res) => youtubeController.search(req, res));
router.get('/history', protect, (req, res) => youtubeController.getHistory(req, res));
router.get('/:videoId', (req, res) => youtubeController.getVideoDetails(req, res));
router.post('/ask', (req, res) => youtubeController.askQuestion(req, res));
router.post('/:videoId/ask', (req, res) => youtubeController.askQuestion(req, res));
router.post('/summary', (req, res) => youtubeController.generateSummary(req, res));
router.post('/:videoId/summary', (req, res) => youtubeController.generateSummary(req, res));
router.post('/notes', protect, (req, res) => youtubeController.generateNotes(req, res));
router.post('/:videoId/notes', protect, (req, res) => youtubeController.generateNotes(req, res));
router.post('/quiz', protect, (req, res) => youtubeController.generateQuiz(req, res));
router.post('/:videoId/quiz', protect, (req, res) => youtubeController.generateQuiz(req, res));
router.post('/:videoId/progress', protect, (req, res) => youtubeController.updateProgress(req, res));

module.exports = router;
