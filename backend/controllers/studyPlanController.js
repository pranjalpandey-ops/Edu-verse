const { StudyPlan, LearningProfile, ConceptMastery } = require('../models');
const aiService = require('../services/aiService');
const masteryService = require('../services/masteryService');

exports.getStudyPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    let plan = await StudyPlan.findOne({ userId: userId.toString(), status: 'active' });

    if (!plan) {
      const plans = await StudyPlan.find({ userId: userId.toString() });
      plan = plans[0] || null;
    }

    res.json({ success: true, plan });
  } catch (err) {
    next(err);
  }
};

exports.generatePlan = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { goal = 'Mastery & Top Exam Score', examDate, dailyMinutes = 45, subjects = ['Science', 'Mathematics'] } = req.body;

    const [profile, weakConcepts, strongConcepts] = await Promise.all([
      LearningProfile.findOne({ userId: userId.toString() }),
      masteryService.getWeakConcepts(userId, 3),
      masteryService.getStrongConcepts(userId, 3)
    ]);

    const generated = await aiService.generateStudyPlan({
      goal,
      examDate: examDate || (profile?.examGoals?.[0]?.examDate) || 'In 30 days',
      dailyMinutes: Number(dailyMinutes) || 45,
      weakConcepts: weakConcepts.map(w => w.concept),
      strongConcepts: strongConcepts.map(s => s.concept),
      subjects,
      learningStyle: profile?.preferredLearningStyle || 'visual'
    });

    const tasks = (generated.tasks || []).map((t, idx) => {
      const taskDate = new Date(Date.now() + (t.dayOffset || idx) * 86400000).toISOString().slice(0, 10);
      return {
        id: 'task_' + (idx + 1) + '_' + Date.now().toString(36),
        date: taskDate,
        subject: t.subject || subjects[0] || 'Core',
        concept: t.concept || 'General Concept',
        activityType: t.activityType || 'learn',
        estimatedMinutes: t.estimatedMinutes || 20,
        priority: t.priority || 'medium',
        reason: t.reason || 'Scheduled study milestone',
        completed: false
      };
    });

    const studyPlan = await StudyPlan.create({
      userId: userId.toString(),
      title: generated.title || `Study Roadmap: ${goal}`,
      goal,
      examDate: examDate || new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
      dailyMinutes: Number(dailyMinutes) || 45,
      tasks,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, plan: studyPlan });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { taskId } = req.params;
    const { completed } = req.body;

    const plan = await StudyPlan.findOne({ userId: userId.toString(), status: 'active' });
    if (!plan) return res.status(404).json({ success: false, error: 'Active study plan not found' });

    let foundTask = null;
    const updatedTasks = (plan.tasks || []).map(t => {
      if (t.id === taskId) {
        foundTask = t;
        return { ...t, completed: Boolean(completed) };
      }
      return t;
    });

    const updated = await StudyPlan.findByIdAndUpdate(plan._id || plan.id, {
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    });

    if (foundTask && completed) {
      await masteryService.recordLearningEvent({
        userId,
        type: 'lesson_completed',
        subject: foundTask.subject,
        concept: foundTask.concept,
        duration: (foundTask.estimatedMinutes || 20) * 60,
        score: 100
      });
    }

    res.json({ success: true, plan: updated });
  } catch (err) {
    next(err);
  }
};

exports.getExamSchedule = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const profile = await LearningProfile.findOne({ userId: userId.toString() });

    const examGoals = profile?.examGoals || [
      { examName: 'Midterm STEM Diagnostic', targetScore: '90%', examDate: new Date(Date.now() + 86400000 * 18).toISOString().slice(0, 10) }
    ];

    const exams = examGoals.map((eg, idx) => {
      const daysLeft = Math.max(1, Math.round((new Date(eg.examDate) - new Date()) / 86400000));
      return {
        id: 'exam_' + (idx + 1),
        name: eg.examName,
        date: eg.examDate,
        daysLeft,
        targetScore: eg.targetScore || '90%',
        grade: 'Core Level',
        syllabus: ['Mechanisms & Laws', 'Applied Problem Solving', 'Calculations & Edge Cases']
      };
    });

    res.json({ success: true, exams });
  } catch (err) {
    next(err);
  }
};
