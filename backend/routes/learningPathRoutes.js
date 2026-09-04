const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:topic?', protect, learningPathController.getLearningPath);
router.post('/generate', protect, learningPathController.generateLearningPath);

module.exports = router;
