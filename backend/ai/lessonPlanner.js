const aiService = require('../services/aiService');

class LessonPlanner {
  async generateLessonPlan({ topic, documentId, level = 'High School', knowledgeLevel = 'Beginner', language = 'English', time = 20, goal = 'Exam Preparation', style = 'Simple Examples', depth = 'Standard' }) {
    const durationMins = parseInt(time) || 20;

    const prompt = `Create an interactive lesson plan for:
Topic: "${topic || 'Physics: Electricity & Magnetism'}"
Level: ${level}
Knowledge: ${knowledgeLevel}
Language: ${language}
Available Time: ${durationMins} minutes
Goal: ${goal}
Style: ${style}

Structure the sections so that:
- 5 mins: Only essential core concepts.
- 20 mins: Key concepts + visual diagrams + interactive checkpoints.
- 60 mins: In-depth explanations + real-world engineering examples + interactive multi-step problems + end assessment.
Return a structured JSON with title, duration, language, objectives, sections with speechScript, visualData, and interactive questions.`;

    const plan = await aiService.generateJSON(prompt);
    return {
      ...plan,
      level,
      knowledgeLevel,
      language,
      time: durationMins,
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = new LessonPlanner();
