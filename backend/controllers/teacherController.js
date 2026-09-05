const aiService = require('../services/aiService');
const misconceptionDetector = require('../ai/misconceptionDetector');
const visualPlanner = require('../ai/visualPlanner');

class TeacherController {
  async chat(req, res) {
    try {
      const { message, topic = 'General Concept', sectionTitle = '', history = [] } = req.body;
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      // Determine emotional avatar state based on query tone
      let avatarState = 'explaining';
      const lower = (message || '').toLowerCase();
      if (lower.includes('confused') || lower.includes('don\'t understand') || lower.includes('hard') || lower.includes('wrong')) {
        avatarState = 'encouraging';
      } else if (lower.includes('why') || lower.includes('how') || lower.includes('calculate') || lower.includes('prove')) {
        avatarState = 'thinking';
      } else if (lower.includes('got it') || lower.includes('correct') || lower.includes('thank') || lower.includes('understand')) {
        avatarState = 'celebrating';
      }

      // Generate dynamic response text
      const prompt = `Student asked in lesson on "${cleanTopic}" (Section: "${sectionTitle}"): "${message}". Provide a warm, clear, pedagogically sound human teacher response under 3 sentences.`;
      const responseText = await aiService.generateText(prompt);

      // Generate visual plan update for the blackboard if relevant
      const visualData = visualPlanner.planVisual(cleanTopic, sectionTitle, message);

      return res.json({
        success: true,
        reply: responseText,
        avatarState,
        boardUpdate: {
          title: `${cleanTopic} - Teacher Insight`,
          visualType: visualData.visualType,
          elements: visualData.elements || ['1. Core Principle', '2. Governing Law', '3. Application']
        },
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
      // Provide clean speech synthesis payload for browser SpeechSynthesis / Audio API
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
