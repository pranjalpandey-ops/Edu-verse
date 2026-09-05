const express = require('express');
const router = express.Router();
const controller = require('../controllers/challengeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/today', verifyToken, controller.getTodayChallenge);
router.post('/submit', verifyToken, controller.submitTodayChallenge);

module.exports = router;
