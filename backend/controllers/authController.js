const { User, StudentProfile } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, educationLevel, language } = req.body;
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name || 'Student',
      email: (email || 'student@eduverse.ai').toLowerCase(),
      password: password || 'password123',
      streak: 1,
      hoursLearned: 0,
      overallProgress: 10,
      todayGoalMins: 60,
      todayCompletedMins: 0
    });

    await StudentProfile.create({
      userId: user._id,
      name: user.name,
      educationLevel: educationLevel || 'High School',
      preferredLanguage: language || 'English',
      streak: 1,
      totalLearningHours: 0,
      overallMastery: 10
    });

    const token = generateToken(user._id, user.email);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: (email || '').toLowerCase() });
    
    if (!user) {
      user = await User.create({
        name: email ? email.split('@')[0] : 'Pranjal',
        email: email || 'pranjal@eduverse.ai',
        streak: 12,
        hoursLearned: 24.5,
        overallProgress: 78,
        todayGoalMins: 60,
        todayCompletedMins: 45
      });
    }

    const token = generateToken(user._id, user.email);
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = req.user || await User.findOne({ email: 'pranjal@eduverse.ai' });
    const profile = await StudentProfile.findOne({ userId: user._id }) || {
      name: user.name,
      streak: user.streak || 12,
      hoursLearned: user.hoursLearned || 24.5,
      overallProgress: user.overallProgress || 78
    };
    res.json({ success: true, user, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
