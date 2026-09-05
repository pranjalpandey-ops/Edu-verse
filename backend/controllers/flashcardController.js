const { Flashcard, Material, Lesson } = require('../models');
const aiService = require('../services/aiService');
const masteryService = require('../services/masteryService');

exports.generateFlashcards = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { topic = 'Key Concepts', subject = 'General', materialId, lessonId, count = 5, difficulty = 'medium' } = req.body;

    let sourceText = '';
    let source = 'topic';
    let sourceId = null;

    if (materialId) {
      const mat = await Material.findById(materialId);
      if (mat?.textContent) {
        sourceText = mat.textContent;
        source = 'material';
        sourceId = materialId;
      }
    } else if (lessonId) {
      const les = await Lesson.findById(lessonId);
      if (les) {
        sourceText = JSON.stringify(les.content || les.modules || '');
        source = 'lesson';
        sourceId = lessonId;
      }
    }

    const weakConcepts = (await masteryService.getWeakConcepts(userId, 3)).map(w => w.concept);

    const generated = await aiService.generateFlashcards({
      topic,
      subject,
      materialText: sourceText,
      count: Number(count) || 5,
      difficulty,
      weakConcepts
    });

    const savedCards = [];
    for (const item of generated) {
      const card = await Flashcard.create({
        userId: userId.toString(),
        subject: subject || 'General',
        concept: item.concept || topic,
        front: item.front,
        back: item.back,
        hints: item.hints || [],
        source,
        sourceId,
        difficulty,
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
        lastReviewedAt: null
      });
      savedCards.push(card);
    }

    await masteryService.recordLearningEvent({
      userId,
      type: 'flashcard_reviewed',
      subject,
      concept: topic,
      score: 100,
      duration: 30,
      metadata: { generatedCount: savedCards.length }
    });

    res.json({ success: true, flashcards: savedCards });
  } catch (err) {
    next(err);
  }
};

exports.getFlashcards = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const cards = await Flashcard.find({ userId: userId.toString() });
    res.json({ success: true, flashcards: cards });
  } catch (err) {
    next(err);
  }
};

exports.reviewFlashcard = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { id } = req.params;
    const { quality = 4 } = req.body; // 0 to 5

    const card = await Flashcard.findById(id);
    if (!card) return res.status(404).json({ success: false, error: 'Flashcard not found' });

    const sm2 = masteryService.calculateSM2({
      quality: Number(quality) || 3,
      repetitions: card.repetitions || 0,
      previousInterval: card.interval || 1,
      previousEaseFactor: card.easeFactor || 2.5
    });

    const updated = await Flashcard.findByIdAndUpdate(id, {
      ...sm2,
      lastReviewedAt: new Date().toISOString()
    });

    // Update concept mastery
    await masteryService.updateConceptMastery({
      userId,
      subject: card.subject,
      concept: card.concept,
      isCorrect: quality >= 3,
      score: quality * 20
    });

    res.json({ success: true, flashcard: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Flashcard.findByIdAndDelete(id);
    res.json({ success: true, message: 'Flashcard removed' });
  } catch (err) {
    next(err);
  }
};
