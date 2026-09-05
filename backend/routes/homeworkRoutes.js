const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeworkController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, controller.generateHomework);
router.get('/', verifyToken, controller.getAllHomework);
router.get('/:id', verifyToken, controller.getHomeworkById);
router.post('/:id/submit', verifyToken, controller.submitHomework);

module.exports = router;
