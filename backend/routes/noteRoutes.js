const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, noteController.generateNotes);
router.get('/', protect, noteController.getNotes);
router.put('/:id', protect, noteController.updateNote);

module.exports = router;
