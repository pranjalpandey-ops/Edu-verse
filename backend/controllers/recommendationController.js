const recommendationEngine = require('../ai/recommendationEngine');

exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const recs = await recommendationEngine.getRecommendations(userId);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    next(err);
  }
};
