const express = require('express');
const router = express.Router();
const formulaController = require('../controllers/formulaController');

// GET /api/formulas/curriculum?grade=class-10&subject=physics
router.get('/curriculum', (req, res) => formulaController.getCurriculum(req, res));

// GET /api/formulas/search?query=newton
router.get('/search', (req, res) => formulaController.searchFormulas(req, res));

// GET /api/formulas/grades
router.get('/grades', (req, res) => {
  res.json({
    success: true,
    grades: [
      { id: 'class-9', label: 'Class 9th', description: 'Foundations of Science, Mathematics & Motion' },
      { id: 'class-10', label: 'Class 10th', description: 'Board Exam Mastery, Electricity, Optics & Algebra' },
      { id: 'class-11', label: 'Class 11th', description: 'Advanced Mechanics, Organic Foundations, Calculus & Cell Bio' },
      { id: 'class-12', label: 'Class 12th', description: 'Board & Competitive Exams (Electromagnetism, Vectors, Genetics)' }
    ],
    subjects: [
      { id: 'all', label: 'All Subjects', icon: '📚' },
      { id: 'physics', label: 'Physics', icon: '⚡' },
      { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
      { id: 'mathematics', label: 'Mathematics', icon: '📐' },
      { id: 'biology', label: 'Biology', icon: '🧬' }
    ]
  });
});

module.exports = router;
