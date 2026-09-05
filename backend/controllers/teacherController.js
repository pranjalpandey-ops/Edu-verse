const aiService = require('../services/aiService');
const misconceptionDetector = require('../ai/misconceptionDetector');
const visualPlanner = require('../ai/visualPlanner');
const ragPipeline = require('../rag/ragPipeline');
const { LearningProfile, ConceptMastery } = require('../models');
const masteryService = require('../services/masteryService');

class TeacherController {
  async chat(req, res) {
    try {
      const userId = req.user?.id || 'demo_user';
      const {
        message,
        topic = 'Academic Foundations',
        sectionTitle = 'Core Concept',
        history = [],
        mode = 'normal',
        language = 'English',
        materialId = null
      } = req.body;

      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      // Load personalized profile & mastery memory
      const [profile, masteryDoc] = await Promise.all([
        LearningProfile.findOne({ userId: userId.toString() }),
        ConceptMastery.findOne({ userId: userId.toString(), concept: cleanTopic })
      ]);

      const explanationStyle = profile?.preferredExplanationStyle || 'visual';
      const studentLevel = profile?.currentLevel || 'High School';
      const isWeak = masteryDoc?.status === 'weak' || (masteryDoc?.masteryScore || 100) < 60;

      // Emotional avatar state
      let avatarState = 'explaining';
      const lower = (message || '').toLowerCase();
      if (lower.includes('confused') || lower.includes("don't understand") || lower.includes('hard') || lower.includes('wrong') || lower.includes('stuck')) {
        avatarState = 'encouraging';
      } else if (lower.includes('why') || lower.includes('how') || lower.includes('calculate') || lower.includes('prove') || lower.includes('derive')) {
        avatarState = 'thinking';
      } else if (lower.includes('got it') || lower.includes('correct') || lower.includes('thank') || lower.includes('understand') || lower.includes('awesome')) {
        avatarState = 'celebrating';
      }

      // Check RAG context if materialId is provided
      let ragContext = null;
      if (materialId) {
        ragContext = await ragPipeline.buildGroundedPrompt(message, materialId);
      }

      // Generate teacher response with personalized profile memory
      const teacherRes = await aiService.generateTeacherResponse({
        studentProfile: {
          level: studentLevel,
          preferredExplanationStyle: explanationStyle,
          isWeakConcept: isWeak,
          weakConcepts: profile?.weakConcepts || []
        },
        lessonTitle: cleanTopic,
        currentConcept: sectionTitle,
        studentMessage: message,
        mode: mode === 'normal' ? explanationStyle : mode,
        language: profile?.preferredLanguage || language,
        ragContext
      });

      // Log teacher question/conversation event
      await masteryService.recordLearningEvent({
        userId,
        type: 'teacher_question',
        concept: cleanTopic,
        score: null,
        duration: 20,
        metadata: { messageLength: message.length, mode }
      });

      // Visual plan update
      const visualData = visualPlanner.planVisual(cleanTopic, sectionTitle, message);

      return res.json({
        success: true,
        reply: teacherRes.reply,
        avatarState,
        teachingStrategy: teacherRes.teachingStrategy || mode,
        boardUpdate: teacherRes.visual || {
          title: `${sectionTitle} - Core Breakdown`,
          visualType: visualData.visualType,
          elements: visualData.elements || ['1. Principle', '2. Mechanism', '3. Application']
        },
        followUpQuestion: teacherRes.followUpQuestion || null,
        sources: ragContext?.sources || [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[TeacherController] chat error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async speak(req, res) {
    try {
      const { text, voice = 'en-US-Neural2-F', speed = 1.0 } = req.body;
      return res.json({
        success: true,
        text: text || 'Welcome to EduVerse AI Classroom.',
        voice,
        speed,
        pitch: 1.0,
        visemes: [
          { time: 0, viseme: 'sil' },
          { time: 100, viseme: 'aa' },
          { time: 250, viseme: 'EE' },
          { time: 400, viseme: 'sil' }
        ]
      });
    } catch (error) {
      console.error('[TeacherController] speak error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async diagnose(req, res) {
    try {
      const { question, answer, topic } = req.body;
      const diagnosis = misconceptionDetector.diagnoseAnswer(question, answer, topic);
      return res.json({ success: true, diagnosis });
    } catch (error) {
      console.error('[TeacherController] diagnose error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TeacherController();
