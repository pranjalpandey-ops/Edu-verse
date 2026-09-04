const { Lesson, LessonSession, Misconception } = require('../models');
const lessonPlanner = require('../ai/lessonPlanner');
const misconceptionDetector = require('../ai/misconceptionDetector');
const adaptiveTeacher = require('../ai/adaptiveTeacher');
const visualPlanner = require('../ai/visualPlanner');
const ragPipeline = require('../rag/ragPipeline');

exports.generateLesson = async (req, res) => {
  try {
    const { topic, documentId, level, knowledgeLevel, language, time, goal, style, depth } = req.body;
    const userId = req.user ? req.user._id : 'user_pranjal_demo';

    let ragContext = null;
    if (documentId) {
      ragContext = await ragPipeline.buildGroundedPrompt(topic || 'core overview', documentId);
    }

    const plan = await lessonPlanner.generateLessonPlan({
      topic: topic || 'Physics: Electricity and Magnetism',
      documentId,
      level: level || 'High School',
      knowledgeLevel: knowledgeLevel || 'Beginner',
      language: language || 'English',
      time: time || 20,
      goal: goal || 'Exam Preparation',
      style: style || 'Simple Examples',
      depth: depth || 'Standard'
    });

    const lesson = await Lesson.create({
      userId,
      title: plan.title || topic,
      topic: topic || 'Electricity',
      subject: 'Physics',
      duration: plan.duration || 20,
      language: plan.language || language || 'English',
      difficulty: knowledgeLevel || 'Beginner',
      objectives: plan.objectives || [],
      sections: plan.sections || [],
      currentSectionIndex: 0,
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
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
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startLessonSession = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id) || await Lesson.findOne({});
    const userId = req.user ? req.user._id : 'user_pranjal_demo';

    const session = await LessonSession.create({
      lessonId: lesson ? lesson._id : 'lesson_physics_electricity',
      userId,
      currentSectionIndex: 2, // Default to Ohm's Law section for hackathon demo
      mastery: 70,
      difficulty: lesson ? lesson.difficulty : 'Beginner',
      language: lesson ? lesson.language : 'English',
      explanationStyle: 'diagram',
      elapsedSeconds: 360,
      totalSeconds: (lesson ? lesson.duration : 20) * 60
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
    const userId = req.user ? req.user._id : 'user_pranjal_demo';

    const questionObj = {
      id: questionId,
      question: questionText || "If voltage remains constant and resistance increases, what happens to current?",
      options: options || [
        { id: "A", text: "It increases proportionally.", correct: false },
        { id: "B", text: "It decreases.", correct: true },
        { id: "C", text: "It remains the same.", correct: false },
        { id: "D", text: "It fluctuates unpredictably.", correct: false }
      ]
    };

    const diagnosis = misconceptionDetector.diagnoseAnswer(questionObj, answer, concept || "Ohm's Law");

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
    const { action, language, style } = req.body;
    let note = "Teaching adapted.";

    if (action === 'switch_language') {
      note = `Teacher switched language to ${language} seamlessly.`;
    } else if (action === 'simplify') {
      note = "ARIA simplified the explanation with a real-world visual breakdown.";
    } else if (action === 'example') {
      note = "ARIA deployed a real-world water-pipe analogy.";
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
