const { Homework } = require('../models');
const aiService = require('../services/aiService');
const masteryService = require('../services/masteryService');

exports.generateHomework = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { topic = 'Core Foundations', subject = 'General', difficulty = 'medium', questionCount = 3 } = req.body;

    const generated = await aiService.generateHomework({
      topic,
      subject,
      difficulty,
      questionCount: Number(questionCount) || 3
    });

    const hw = await Homework.create({
      userId: userId.toString(),
      title: generated.title || `Homework: ${topic}`,
      subject,
      topic,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      questions: generated.questions || [],
      status: 'assigned',
      submissions: []
    });

    res.json({ success: true, homework: hw });
  } catch (err) {
    next(err);
  }
};

exports.getAllHomework = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const list = await Homework.find({ userId: userId.toString() });
    res.json({ success: true, homework: list });
  } catch (err) {
    next(err);
  }
};

exports.getHomeworkById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hw = await Homework.findById(id);
    if (!hw) return res.status(404).json({ success: false, error: 'Homework not found' });
    res.json({ success: true, homework: hw });
  } catch (err) {
    next(err);
  }
};

exports.submitHomework = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { id } = req.params;
    const { answers = [] } = req.body; // [{ questionId, answer }]

    const hw = await Homework.findById(id);
    if (!hw) return res.status(404).json({ success: false, error: 'Homework not found' });

    const gradedAnswers = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const q of (hw.questions || [])) {
      maxScore += (q.points || 10);
      const studentAnsObj = answers.find(a => a.questionId === q.id);
      const studentAns = studentAnsObj?.answer || '';

      const evalRes = await aiService.evaluateHomeworkAnswer({
        question: q.question,
        type: q.type,
        studentAnswer: studentAns,
        rubric: q.rubric,
        correctAnswer: q.correctAnswer
      });

      const earned = Math.round((evalRes.score || 0) * (q.points || 10));
      totalScore += earned;

      gradedAnswers.push({
        questionId: q.id,
        answer: studentAns,
        score: earned,
        feedback: evalRes.feedback,
        mistakeExplanation: evalRes.mistakeExplanation
      });
    }

    const percentage = Math.round((totalScore / (maxScore || 1)) * 100);

    const updated = await Homework.findByIdAndUpdate(id, {
      status: 'graded',
      submissions: [
        {
          studentId: userId.toString(),
          answers: gradedAnswers,
          totalScore,
          maxScore,
          percentage,
          submittedAt: new Date().toISOString()
        }
      ]
    });

    // Update concept mastery and log event
    await masteryService.updateConceptMastery({
      userId,
      subject: hw.subject,
      concept: hw.topic,
      isCorrect: percentage >= 60,
      score: percentage
    });

    await masteryService.recordLearningEvent({
      userId,
      type: 'homework_completed',
      subject: hw.subject,
      concept: hw.topic,
      score: percentage,
      duration: 300,
      metadata: { homeworkId: id, percentage }
    });

    res.json({
      success: true,
      result: {
        totalScore,
        maxScore,
        percentage,
        gradedAnswers
      }
    });
  } catch (err) {
    next(err);
  }
};
