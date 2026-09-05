const { ReviewItem, ConceptMastery } = require('../models');
const masteryService = require('../services/masteryService');

exports.getTodayDue = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    let dueItems = await masteryService.getDueReviews(userId);

    // If no explicit review items exist yet, populate from weak/learning concept masteries
    if (!dueItems || dueItems.length === 0) {
      const defaultSamples = [
        {
          concept: "Wave Optics & Interference",
          question: "Under what condition does destructive interference occur in Young's Double Slit Experiment?",
          answer: "Path difference Δx = (2n - 1)(λ / 2), causing crest-to-trough cancellation.",
          difficulty: "medium"
        },
        {
          concept: "Differential Calculus & Chain Rule",
          question: "How do you differentiate a composite function y = f(g(x))?",
          answer: "dy/dx = f'(g(x)) * g'(x) via the Chain Rule.",
          difficulty: "easy"
        },
        {
          concept: "Electrochemistry & Nernst Equation",
          question: "What happens to the cell potential E_cell when temperature T increases?",
          answer: "The slope of the Nernst potential factor (2.303 RT / nF) increases, amplifying concentration sensitivity.",
          difficulty: "medium"
        },
        {
          concept: "Binary Search Trees & Complexity",
          question: "What is the worst-case search time complexity in an unbalanced binary search tree?",
          answer: "O(N) when the tree degenerates into a linear linked list.",
          difficulty: "medium"
        }
      ];

      for (const s of defaultSamples) {
        const item = await ReviewItem.create({
          userId: userId.toString(),
          concept: s.concept,
          question: s.question,
          answer: s.answer,
          difficulty: s.difficulty,
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewAt: new Date().toISOString(),
          lastReviewedAt: null
        });
        if (!dueItems) dueItems = [];
        dueItems.push(item);
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
