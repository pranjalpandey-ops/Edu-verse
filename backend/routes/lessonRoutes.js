const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, lessonController.generateLesson);
router.get('/:id', protect, lessonController.getLesson);
router.post('/:id/start', protect, lessonController.startLessonSession);
router.post('/:id/answer', protect, lessonController.answerQuestion);
router.post('/:id/adapt', protect, lessonController.adaptTeaching);

module.exports = router;
