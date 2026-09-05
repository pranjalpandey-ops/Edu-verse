const { ReviewItem, ConceptMastery } = require('../models');
const masteryService = require('../services/masteryService');

exports.getTodayDue = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    let dueItems = await masteryService.getDueReviews(userId);

    // If no explicit review items exist yet, populate from weak/learning concept masteries
    if (!dueItems || dueItems.length === 0) {
      const masteries = await ConceptMastery.find({ userId: userId.toString() });
      if (masteries.length > 0) {
        for (const m of masteries.slice(0, 4)) {
          const item = await ReviewItem.create({
            userId: userId.toString(),
            concept: m.concept,
            question: `Explain the core mechanism and governing law of ${m.concept}.`,
            answer: `Governing principle: ${m.concept} establishes direct functional relationships under boundary constraints.`,
            difficulty: m.status === 'weak' ? 'hard' : 'medium',
            interval: 1,
            easeFactor: 2.5,
            repetitions: 0,
            nextReviewAt: new Date().toISOString(),
            lastReviewedAt: null
          });
          dueItems.push(item);
        }
      }
    }

    res.json({ success: true, count: dueItems.length, items: dueItems });
  } catch (err) {
    next(err);
  }
};

exports.submitReview = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { itemId, quality, concept, question, answer } = req.body;

    const result = await masteryService.processReview({
      userId,
      itemId,
      quality: Number(quality) || 4,
      concept,
      question,
      answer
    });

    res.json({ success: true, reviewItem: result });
  } catch (err) {
    next(err);
  }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const upcoming = await masteryService.getUpcomingReviews(userId);
    res.json({ success: true, count: upcoming.length, items: upcoming });
  } catch (err) {
    next(err);
  }
};
