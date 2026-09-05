const { Lesson, LessonSession, Misconception } = require('../models');
const lessonPlanner = require('../ai/lessonPlanner');
const misconceptionDetector = require('../ai/misconceptionDetector');
const adaptiveTeacher = require('../ai/adaptiveTeacher');
const visualPlanner = require('../ai/visualPlanner');
const ragPipeline = require('../rag/ragPipeline');

exports.generateLesson = async (req, res) => {
  try {
    const { topic = 'Photosynthesis and Energy Systems', documentId, level, knowledgeLevel, language, time, goal, style, depth } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

    let ragContext = null;
    if (documentId) {
      ragContext = await ragPipeline.buildGroundedPrompt(topic, documentId);
    }

    const plan = await lessonPlanner.generateLessonPlan({
      topic,
      documentId,
      level: level || 'High School',
      knowledgeLevel: knowledgeLevel || 'Beginner',
      language: language || 'English',
      time: time || 20,
      goal: goal || 'Exam Preparation & Mastery',
      style: style || 'Intuitive Analogies & Math',
      depth: depth || 'Standard',
      ragContext
    });

    const lesson = await Lesson.create({
      userId,
      title: plan.title || `${topic}: Conceptual & Practical Mastery`,
      topic: plan.topic || topic,
      subject: plan.subject || 'Academic Mastery',
      duration: plan.duration || 20,
      language: plan.language || language || 'English',
      difficulty: knowledgeLevel || 'Beginner',
      objectives: plan.objectives || [],
      sections: plan.sections || [],
      currentSectionIndex: 0,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error('[generateLesson]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      lesson = await Lesson.findOne({});
    }
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startLessonSession = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id) || await Lesson.findOne({});
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'No lesson found to start session' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

    const session = await LessonSession.create({
      lessonId: lesson._id,
      userId,
      currentSectionIndex: 0,
      mastery: 50,
      difficulty: lesson.difficulty || 'Beginner',
      language: lesson.language || 'English',
      explanationStyle: 'diagram',
      elapsedSeconds: 0,
      totalSeconds: (lesson.duration || 20) * 60
    });

    res.json({ success: true, session, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { questionId, answer, questionText, options, concept } = req.body;
    const lessonId = req.params.id;
    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

    const questionObj = {
      id: questionId || 'q1',
      concept: concept || 'Core Concept',
      question: questionText || `Evaluate the primary mechanism governing ${concept || 'this system'}.`,
      options: options || [
        { id: "A", text: "Directly satisfies the governing principle.", correct: true },
        { id: "B", text: "Violates the core relationship.", correct: false }
      ]
    };

    const diagnosis = misconceptionDetector.diagnoseAnswer(questionObj, answer, concept || questionObj.concept);

    if (!diagnosis.correct && diagnosis.misconception) {
      await Misconception.create({
        userId,
        lessonId,
        concept: diagnosis.misconception.concept,
        misconception: diagnosis.misconception.misconception,
        severity: diagnosis.misconception.severity,
        explanationStrategy: diagnosis.misconception.explanationStrategy,
        resolved: false
      });
    }

    res.json({
      success: true,
      evaluation: diagnosis
    });
  } catch (error) {
    console.error('[answerQuestion]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adaptTeaching = async (req, res) => {
  try {
    const { action, language, style, concept = 'this topic' } = req.body;
    let note = "Teaching adapted dynamically to student learning pace.";

    if (action === 'switch_language') {
      note = `Teacher switched language to ${language || 'English'} seamlessly.`;
    } else if (action === 'simplify') {
      note = `ARIA simplified ${concept} with a foundational intuitive breakdown.`;
    } else if (action === 'example') {
      note = `ARIA provided a step-by-step real-world application of ${concept}.`;
    } else if (action === 'analogy') {
      note = `ARIA deployed a memorable cognitive analogy for ${concept}.`;
    }

    res.json({
      success: true,
      adaptiveNote: note,
      style: style || 'analogy',
      language: language || 'English'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
