const express = require('express');
const router = express.Router();
const controller = require('../controllers/flashcardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, controller.generateFlashcards);
router.get('/', verifyToken, controller.getFlashcards);
router.post('/:id/review', verifyToken, controller.reviewFlashcard);
router.delete('/:id', verifyToken, controller.deleteFlashcard);

module.exports = router;
