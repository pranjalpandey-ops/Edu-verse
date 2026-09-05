const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { upload } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('file'), materialController.uploadMaterial);
router.get('/', protect, materialController.getMaterials);
router.get('/:id', protect, materialController.getMaterialById);
router.delete('/:id', protect, materialController.deleteMaterial);
router.post('/:id/ask', protect, materialController.askMaterial);
router.post('/:id/summarize', protect, materialController.summarizeMaterial);
router.post('/:id/lesson', protect, materialController.generateLessonFromMaterial);
router.post('/:id/flashcards', protect, materialController.generateFlashcardsFromMaterial);
router.post('/:id/quiz', protect, materialController.generateQuizFromMaterial);

module.exports = router;
