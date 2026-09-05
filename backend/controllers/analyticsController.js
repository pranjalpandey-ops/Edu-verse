const analyticsService = require('../services/analyticsService');

exports.getOverview = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const data = await analyticsService.getStudentAnalytics(userId);
    res.json({ success: true, analytics: data });
  } catch (err) {
    next(err);
  }
};

exports.getWeekly = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const data = await analyticsService.getWeeklyAnalytics(userId);
    res.json({ success: true, weekly: data });
  } catch (err) {
    next(err);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const data = await analyticsService.getSubjectAnalytics(userId);
    res.json({ success: true, subjects: data });
  } catch (err) {
    next(err);
  }
};
