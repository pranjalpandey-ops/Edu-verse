const express = require('express');
const router = express.Router();
const controller = require('../controllers/studyPlanController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, controller.getStudyPlan);
router.post('/generate', verifyToken, controller.generatePlan);
router.put('/task/:taskId', verifyToken, controller.updateTaskStatus);
router.get('/exam-schedule', verifyToken, controller.getExamSchedule);

module.exports = router;
