const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const studyPlanController = require('../controllers/studyPlanController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/timetables');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `timetable-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', (req, res) => studyPlanController.getStudyPlan(req, res));
router.post('/generate', (req, res) => studyPlanController.generatePlan(req, res));
router.post('/timetable', upload.single('timetableFile'), (req, res) => studyPlanController.uploadTimetable(req, res));
router.get('/exam-schedule', (req, res) => studyPlanController.getExamSchedule(req, res));
router.get('/calendar-events', (req, res) => studyPlanController.getCalendarEvents(req, res));
router.post('/schedule-lecture', (req, res) => studyPlanController.scheduleLecture(req, res));

module.exports = router;
