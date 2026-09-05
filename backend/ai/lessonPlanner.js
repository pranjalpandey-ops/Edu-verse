const aiService = require('../services/aiService');

class LessonPlanner {
  async generateLessonPlan({ topic, documentId, level = 'High School', knowledgeLevel = 'Beginner', language = 'English', time = 20, goal = 'Exam Preparation & Mastery', style = 'Interactive Analogies & Math', depth = 'Standard', ragContext = null }) {
    const durationMins = parseInt(time) || 20;
    const cleanTopic = topic || 'Foundational Principles';

    const lesson = await aiService.generateLesson(cleanTopic, {
      subject: 'Academic Foundations',
      level,
      knowledgeLevel,
      language,
      duration: durationMins,
      goal,
      teachingStyle: style,
      depth
    }, ragContext);

    return {
      ...lesson,
      level,
      knowledgeLevel,
      language,
      duration: durationMins,
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = new LessonPlanner();
