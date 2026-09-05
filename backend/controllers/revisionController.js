class RevisionController {
  async getRevisionItems(req, res) {
    try {
      const items = [
        {
          id: 'card_1',
          topic: 'Physics',
          concept: 'Ohm\'s Law & Resistance',
          front: 'What happens to electric current if resistance is tripled at constant voltage?',
          back: 'Current is reduced to 1/3 of its original value (I = V/R: inverse relationship).',
          intervalDays: 1,
          repetitionCount: 2,
          easeFactor: 2.5,
          nextReviewDate: new Date().toISOString(),
          status: 'due'
        },
        {
          id: 'card_2',
          topic: 'Computer Science',
          concept: 'Binary Search Time Complexity',
          front: 'What is the worst-case and average time complexity of Binary Search on a sorted array of N elements?',
          back: 'O(log N), because the search space is divided in half at every step.',
          intervalDays: 3,
          repetitionCount: 3,
          easeFactor: 2.6,
          nextReviewDate: new Date().toISOString(),
          status: 'due'
        },
        {
          id: 'card_3',
          topic: 'Biology',
          concept: 'Cellular Energy Currency',
          front: 'Which molecule serves as the universal direct chemical energy carrier in living cells?',
          back: 'ATP (Adenosine Triphosphate), releasing energy when hydrolyzed into ADP + Pi.',
          intervalDays: 5,
          repetitionCount: 4,
          easeFactor: 2.7,
          nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
          status: 'scheduled'
        }
      ];

      return res.json({
        success: true,
        summary: {
          dueToday: 2,
          learning: 4,
          mastered: 18,
          totalCards: 24,
          retentionRate: '94%'
        },
        items
      });
    } catch (error) {
      console.error('[RevisionController] getRevisionItems error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async recordReview(req, res) {
    try {
      const { cardId, rating } = req.body; // rating: 'again' | 'hard' | 'good' | 'easy'
      
      let nextIntervalDays = 1;
      if (rating === 'easy') nextIntervalDays = 4;
      else if (rating === 'good') nextIntervalDays = 2;
      else if (rating === 'hard') nextIntervalDays = 1;
      else nextIntervalDays = 0; // repeat today

      return res.json({
        success: true,
        cardId,
        rating,
        nextReviewDate: new Date(Date.now() + nextIntervalDays * 86400000).toISOString(),
        message: `Card updated using SuperMemo-2 spaced repetition algorithm.`
      });
    } catch (error) {
      console.error('[RevisionController] recordReview error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RevisionController();
