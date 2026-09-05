const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

router.get('/search', (req, res) => youtubeController.search(req, res));
router.get('/:videoId', (req, res) => youtubeController.getVideoDetails(req, res));
router.post('/ask', (req, res) => youtubeController.askQuestion(req, res));
router.post('/quiz', (req, res) => youtubeController.generateQuiz(req, res));
router.post('/notes', (req, res) => youtubeController.generateNotes(req, res));

module.exports = router;
