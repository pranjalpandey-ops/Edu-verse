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

const SAMPLE_FLASHCARDS = [
  {
    subject: "Physics",
    concept: "Wave Optics & Interference",
    front: "Under what exact condition does destructive interference occur in Young's Double Slit Experiment?",
    back: "When the path difference is an odd multiple of half-wavelength: Δx = (2n - 1) * (λ / 2), resulting in zero or minimum intensity.",
    hints: ["Think about crest meeting trough (phase difference of π radians or 180°)."],
    difficulty: "medium"
  },
  {
    subject: "Mathematics",
    concept: "Differential Calculus & Chain Rule",
    front: "State the Chain Rule for composite function differentiation y = f(g(x)).",
    back: "dy/dx = f'(g(x)) * g'(x) or dy/dx = (dy/du) * (du/dx) where u = g(x).",
    hints: ["Differentiate the outer function with respect to the inner, then multiply by inner's derivative."],
    difficulty: "easy"
  },
  {
    subject: "Chemistry",
    concept: "Electrochemistry & Nernst Equation",
    front: "How does increasing the concentration of products impact cell potential (E_cell)?",
    back: "It increases reaction quotient Q, which decreases cell potential E_cell because E_cell = E° - (0.0591/n) * log(Q).",
    hints: ["Le Chatelier's principle and the negative log term in the Nernst equation."],
    difficulty: "medium"
  },
  {
    subject: "Biology",
    concept: "Photosynthesis & Light Reactions",
    front: "What is the primary function of the photolysis of water in Photosystem II (PSII)?",
    back: "Water photolysis (2H2O -> 4H+ + 4e- + O2) replaces the excited electrons lost by P680 chlorophyll and generates the proton gradient for ATP synthesis.",
    hints: ["Provides electrons to the electron transport chain and releases molecular oxygen."],
    difficulty: "medium"
  },
  {
    subject: "Computer Science",
    concept: "Binary Search & Time Complexity",
    front: "What is the worst-case time complexity of Binary Search on a sorted array of size N, and why?",
    back: "O(log N), because the search space is halved after every comparison until 1 element remains.",
    hints: ["Logarithm base 2: 2^k = N implies k = log2(N)."],
    difficulty: "easy"
  },
  {
    subject: "Physics",
    concept: "Electromagnetic Induction & Lenz's Law",
    front: "What physical conservation law is directly embodied by Lenz's Law in electromagnetic induction?",
    back: "Conservation of Energy: the induced current always opposes the change in magnetic flux that creates it to prevent free work generation.",
    hints: ["Think about why induced emf has a negative sign: ε = -dΦ/dt."],
    difficulty: "medium"
  }
];

exports.getFlashcards = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    let cards = await Flashcard.find({ userId: userId.toString() });
    if (!cards || cards.length < 3) {
      for (const sample of SAMPLE_FLASHCARDS) {
        const card = await Flashcard.create({
          userId: userId.toString(),
          subject: sample.subject,
          concept: sample.concept,
          front: sample.front,
          back: sample.back,
          hints: sample.hints,
          source: 'curriculum',
          difficulty: sample.difficulty,
          repetitions: 0,
          interval: 1,
          easeFactor: 2.5,
          nextReviewAt: new Date().toISOString(),
          lastReviewedAt: null
        });
        if (!cards) cards = [];
        cards.push(card);
      }
    }
    res.json({ success: true, count: cards.length, flashcards: cards });
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
