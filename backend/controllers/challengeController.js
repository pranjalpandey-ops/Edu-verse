const { DailyChallenge, LearningProfile } = require('../models');
const aiService = require('../services/aiService');
const masteryService = require('../services/masteryService');

exports.getTodayChallenge = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const todayDate = new Date().toISOString().slice(0, 10);

    let challenge = await DailyChallenge.findOne({ userId: userId.toString(), date: todayDate });

    if (!challenge) {
      const [profile, weakConcepts] = await Promise.all([
        LearningProfile.findOne({ userId: userId.toString() }),
        masteryService.getWeakConcepts(userId, 1)
      ]);

      const weakConcept = weakConcepts[0]?.concept || profile?.weakConcepts?.[0] || 'System Equilibrium';
      const subject = weakConcepts[0]?.subject || (profile?.subjects && profile.subjects[0]) || 'Science';

      const generated = await aiService.generateDailyChallenge({
        weakConcept,
        currentLevel: profile?.currentLevel || 'High School',
        subject,
        difficulty: 'medium'
      });

      challenge = await DailyChallenge.create({
        userId: userId.toString(),
        date: todayDate,
        topic: generated.topic || weakConcept,
        subject: generated.subject || subject,
        difficulty: generated.difficulty || 'medium',
        type: generated.type || 'mcq',
        question: generated.question,
        options: generated.options || [],
        correctAnswer: generated.correctAnswer || 'A',
        explanation: generated.explanation,
        completed: false,
        score: null,
        userAnswer: null,
        feedback: null
      });
    }

    // Sanitize correct answer if not completed
    const safeChallenge = {
      ...challenge,
      correctAnswer: challenge.completed ? challenge.correctAnswer : undefined,
      explanation: challenge.completed ? challenge.explanation : undefined
    };

    res.json({ success: true, challenge: safeChallenge });
  } catch (err) {
    next(err);
  }
};

exports.submitTodayChallenge = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const todayDate = new Date().toISOString().slice(0, 10);
    const { answer } = req.body;

    const challenge = await DailyChallenge.findOne({ userId: userId.toString(), date: todayDate });
    if (!challenge) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    const isCorrect = String(answer).trim().toUpperCase() === String(challenge.correctAnswer).trim().toUpperCase();
    const score = isCorrect ? 100 : 0;

    const updated = await DailyChallenge.findByIdAndUpdate(challenge._id || challenge.id, {
      completed: true,
      score,
      userAnswer: answer,
      feedback: isCorrect ? 'Spot on! Correct deduction.' : `The correct answer is ${challenge.correctAnswer}.`
    });

    // Update concept mastery and record event
    await masteryService.updateConceptMastery({
      userId,
      subject: challenge.subject,
      concept: challenge.topic,
      isCorrect,
      score,
      mistake: isCorrect ? null : 'Failed daily scenario deduction'
    });

    await masteryService.recordLearningEvent({
      userId,
      type: 'challenge_completed',
      subject: challenge.subject,
      concept: challenge.topic,
      score,
      duration: 60,
      metadata: { date: todayDate, isCorrect }
    });

    res.json({
      success: true,
      result: {
        isCorrect,
        score,
        correctAnswer: challenge.correctAnswer,
        explanation: challenge.explanation,
        masteryXp: isCorrect ? 50 : 10
      }
    });
  } catch (err) {
    next(err);
  }
};
