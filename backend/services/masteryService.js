const { ConceptMastery, LearningEvent, ReviewItem, LearningProfile } = require('../models');

class MasteryService {
  /**
   * Records a learning event in the persistent store
   */
  async recordLearningEvent({ userId, type, subject, concept, sourceId, score, duration = 0, metadata = {} }) {
    if (!userId) return null;
    try {
      const event = await LearningEvent.create({
        userId: userId.toString(),
        type,
        subject: subject || 'General',
        concept: concept || 'General Concept',
        sourceId: sourceId ? sourceId.toString() : null,
        score: typeof score === 'number' ? score : null,
        duration: Number(duration) || 0,
        metadata,
        createdAt: new Date().toISOString()
      });
      return event;
    } catch (err) {
      console.error('[MasteryService] Error recording learning event:', err.message);
      return null;
    }
  }

  /**
   * Updates historical concept mastery score dynamically
   */
  async updateConceptMastery({ userId, subject = 'General', concept, isCorrect, score = 0, difficulty = 'medium', mistake = null }) {
    if (!userId || !concept) return null;

    try {
      const uId = userId.toString();
      let masteryDoc = await ConceptMastery.findOne({ userId: uId, concept: concept.trim() });

      if (!masteryDoc) {
        masteryDoc = await ConceptMastery.create({
          userId: uId,
          subject: subject || 'General',
          concept: concept.trim(),
          masteryScore: isCorrect ? 60 : 30,
          confidenceScore: isCorrect ? 50 : 25,
          attempts: 1,
          correctAttempts: isCorrect ? 1 : 0,
          incorrectAttempts: isCorrect ? 0 : 1,
          lastPracticedAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + (isCorrect ? 86400000 : 3600000 * 4)).toISOString(),
          difficulty: difficulty || 'medium',
          commonMistakes: mistake ? [mistake] : [],
          status: isCorrect ? 'learning' : 'weak'
        });
      } else {
        const attempts = (masteryDoc.attempts || 0) + 1;
        const correctAttempts = (masteryDoc.correctAttempts || 0) + (isCorrect ? 1 : 0);
        const incorrectAttempts = (masteryDoc.incorrectAttempts || 0) + (isCorrect ? 0 : 1);

        // Accuracy factor weighted by attempts
        const accuracy = Math.round((correctAttempts / attempts) * 100);

        // Score delta calculation based on performance and difficulty
        const delta = isCorrect ? (difficulty === 'hard' ? 12 : 8) : (difficulty === 'hard' ? -6 : -10);
        let newScore = Math.max(5, Math.min(100, (masteryDoc.masteryScore || 50) + delta));

        // Determine status
        let status = 'learning';
        if (newScore >= 85 && attempts >= 3) status = 'mastered';
        else if (newScore >= 65) status = 'developing';
        else if (newScore >= 45) status = 'learning';
        else status = 'weak';

        // Update mistakes list
        const mistakes = Array.isArray(masteryDoc.commonMistakes) ? [...masteryDoc.commonMistakes] : [];
        if (mistake && !mistakes.includes(mistake)) {
          mistakes.push(mistake);
          if (mistakes.length > 5) mistakes.shift();
        }

        // Spaced review schedule (SM-2 simplified interval)
        const nextReviewDelayDays = status === 'mastered' ? 7 : status === 'developing' ? 3 : 1;
        const nextReviewAt = new Date(Date.now() + nextReviewDelayDays * 86400000).toISOString();

        masteryDoc = await ConceptMastery.findByIdAndUpdate(masteryDoc._id || masteryDoc.id, {
          masteryScore: newScore,
          confidenceScore: Math.min(100, Math.round((newScore + accuracy) / 2)),
          attempts,
          correctAttempts,
          incorrectAttempts,
          lastPracticedAt: new Date().toISOString(),
          nextReviewAt,
          difficulty,
          commonMistakes: mistakes,
          status
        });
      }

      // Update LearningProfile strong/weak lists in sync
      this._syncLearningProfileConcepts(uId);

      return masteryDoc;
    } catch (err) {
      console.error('[MasteryService] Error updating concept mastery:', err.message);
      return null;
    }
  }

  async _syncLearningProfileConcepts(userId) {
    try {
      const masteries = await ConceptMastery.find({ userId: userId.toString() });
      const strong = masteries.filter(m => m.masteryScore >= 75).map(m => m.concept);
      const weak = masteries.filter(m => m.masteryScore < 60 || m.status === 'weak').map(m => m.concept);

      const profile = await LearningProfile.findOne({ userId: userId.toString() });
      if (profile) {
        await LearningProfile.findByIdAndUpdate(profile._id || profile.id, {
          strongConcepts: strong.slice(0, 10),
          weakConcepts: weak.slice(0, 10),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      // Non-blocking sync
    }
  }

  /**
   * SuperMemo SM-2 Algorithm calculation
   * quality: 0 (blackout) to 5 (perfect recall)
   */
  calculateSM2({ quality, repetitions = 0, previousInterval = 1, previousEaseFactor = 2.5 }) {
    let rep = repetitions;
    let interval = previousInterval;
    let ef = previousEaseFactor;

    if (quality >= 3) {
      if (rep === 0) interval = 1;
      else if (rep === 1) interval = 6;
      else interval = Math.round(interval * ef);
      rep += 1;
    } else {
      rep = 0;
      interval = 1;
    }

    // EF calculation: EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;

    const nextReviewAt = new Date(Date.now() + interval * 86400000).toISOString();
    return { repetitions: rep, interval, easeFactor: Number(ef.toFixed(2)), nextReviewAt };
  }

  /**
   * Records or updates a spaced repetition ReviewItem
   */
  async processReview({ userId, itemId, quality, concept, question, answer }) {
    const uId = userId.toString();
    let item = null;

    if (itemId) {
      item = await ReviewItem.findById(itemId);
    } else if (concept) {
      item = await ReviewItem.findOne({ userId: uId, concept });
    }

    const currentRep = item?.repetitions || 0;
    const currentInterval = item?.interval || 1;
    const currentEF = item?.easeFactor || 2.5;

    const sm2 = this.calculateSM2({
      quality: Number(quality) || 3,
      repetitions: currentRep,
      previousInterval: currentInterval,
      previousEaseFactor: currentEF
    });

    const isSuccess = quality >= 3;

    if (item) {
      item = await ReviewItem.findByIdAndUpdate(item._id || item.id, {
        ...sm2,
        lastReviewedAt: new Date().toISOString()
      });
    } else {
      item = await ReviewItem.create({
        userId: uId,
        concept: concept || 'Core Concept',
        question: question || 'Explain core mechanics of ' + concept,
        answer: answer || 'Key principles and governing definitions.',
        difficulty: quality < 3 ? 'hard' : 'medium',
        ...sm2,
        lastReviewedAt: new Date().toISOString()
      });
    }

    // Update mastery
    if (concept) {
      await this.updateConceptMastery({
        userId: uId,
        concept,
        isCorrect: isSuccess,
        score: quality * 20,
        mistake: isSuccess ? null : 'Forgot key detail in spaced recall'
      });
    }

    // Log learning event
    await this.recordLearningEvent({
      userId: uId,
      type: 'revision_completed',
      concept: item.concept,
      score: quality * 20,
      duration: 30,
      metadata: { quality, newInterval: sm2.interval }
    });

    return item;
  }

  async getDueReviews(userId) {
    const uId = userId.toString();
    const now = new Date().toISOString();
    const items = await ReviewItem.find({ userId: uId });
    return items.filter(it => !it.nextReviewAt || it.nextReviewAt <= now);
  }

  async getUpcomingReviews(userId) {
    const uId = userId.toString();
    const now = new Date().toISOString();
    const items = await ReviewItem.find({ userId: uId });
    return items.filter(it => it.nextReviewAt && it.nextReviewAt > now);
  }

  async getWeakConcepts(userId, limit = 5) {
    const uId = userId.toString();
    const list = await ConceptMastery.find({ userId: uId });
    return list
      .filter(c => c.masteryScore < 65 || c.status === 'weak')
      .sort((a, b) => (a.masteryScore || 0) - (b.masteryScore || 0))
      .slice(0, limit);
  }

  async getStrongConcepts(userId, limit = 5) {
    const uId = userId.toString();
    const list = await ConceptMastery.find({ userId: uId });
    return list
      .filter(c => c.masteryScore >= 70)
      .sort((a, b) => (b.masteryScore || 0) - (a.masteryScore || 0))
      .slice(0, limit);
  }
}

module.exports = new MasteryService();
