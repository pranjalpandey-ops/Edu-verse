const { LearningProfile, ConceptMastery, LearningEvent } = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    let profile = await LearningProfile.findOne({ userId: userId.toString() });

    if (!profile) {
      // Create initial profile
      profile = await LearningProfile.create({
        userId: userId.toString(),
        learningGoals: ['Master Core Subjects', 'Ace Upcoming Exams'],
        currentLevel: 'High School',
        preferredLanguage: 'English',
        preferredLearningStyle: 'visual',
        dailyStudyMinutes: 45,
        subjects: ['Science', 'Mathematics', 'Computer Science'],
        strongConcepts: [],
        weakConcepts: [],
        interests: ['Astrophysics', 'Algorithms', 'Quantum Theory'],
        examGoals: [{ examName: 'Board / Competitive', targetScore: '95%', examDate: new Date(Date.now() + 86400000 * 45).toISOString().slice(0, 10) }],
        preferredExplanationStyle: 'visual',
        updatedAt: new Date().toISOString()
      });
    }

    // Refresh dynamic mastery concepts
    const masteries = await ConceptMastery.find({ userId: userId.toString() });
    const strong = masteries.filter(m => m.masteryScore >= 75).map(m => m.concept);
    const weak = masteries.filter(m => m.masteryScore < 60 || m.status === 'weak').map(m => m.concept);

    res.json({
      success: true,
      profile: {
        ...profile,
        strongConcepts: strong.length ? strong : (profile.strongConcepts || []),
        weakConcepts: weak.length ? weak : (profile.weakConcepts || [])
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const patch = req.body || {};

    let profile = await LearningProfile.findOne({ userId: userId.toString() });
    if (profile) {
      profile = await LearningProfile.findByIdAndUpdate(profile._id || profile.id, {
        ...patch,
        updatedAt: new Date().toISOString()
      });
    } else {
      profile = await LearningProfile.create({
        userId: userId.toString(),
        ...patch,
        updatedAt: new Date().toISOString()
      });
    }

    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};
