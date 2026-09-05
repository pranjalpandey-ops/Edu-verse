const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/chat', (req, res) => teacherController.chat(req, res));
router.post('/speak', (req, res) => teacherController.speak(req, res));
router.post('/diagnose', (req, res) => teacherController.diagnose(req, res));

module.exports = router;
