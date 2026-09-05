const aiService = require('../services/aiService');
const youtubeService = require('../services/youtubeService');
const formulaController = require('./formulaController');

class SearchController {
  async search(req, res) {
    try {
      const query = (req.query.q || req.body.query || req.body.q || '').trim();
      if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }

      const cleanTopic = query.replace(/[^\w\s\-:.]/g, '').trim();
      const topicUpper = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

      // 1. Live YouTube Video Search (Fast & grounded)
      let educationalVideos = [];
      try {
        educationalVideos = await youtubeService.searchVideos(cleanTopic, { maxResults: 3 });
      } catch (ytErr) {
        console.warn('[SearchController] YouTube search error:', ytErr.message);
      }

      // 2. Matching Formulas Search
      let matchingFormulas = [];
      try {
        const formulaMockReq = { query: { query: cleanTopic } };
        let mockResData = null;
        const formulaMockRes = {
          json: (data) => { mockResData = data; }
        };
        await formulaController.searchFormulas(formulaMockReq, formulaMockRes);
        matchingFormulas = (mockResData?.results || []).slice(0, 4);
      } catch (fErr) {
        console.warn('[SearchController] Formula search error:', fErr.message);
      }

      // 3. AI Conceptual Synthesis with 3-second timeout protection
      let aiSynthesis = null;
      try {
        const prompt = `
Synthesize a concise, high-yield educational concept breakdown for the subject/topic: "${cleanTopic}".
Respond ONLY with a valid JSON object strictly matching this schema:
{
  "topic": "${topicUpper}",
  "overview": "A clear 2-3 sentence conceptual explanation of principles and real-world importance.",
  "recommendedStudyTime": "25 mins",
  "keyConcepts": [
    "Key mechanism 1",
    "Key mechanism 2",
    "Key mechanism 3",
    "Key mechanism 4"
  ],
  "prerequisites": ["Core foundational logic"],
  "suggestedPath": [
    { "step": 1, "title": "Mental Models & Intuition", "time": "5m" },
    { "step": 2, "title": "Governing Dynamics & Derivations", "time": "10m" },
    { "step": 3, "title": "Problem Solving & Scenarios", "time": "10m" },
    { "step": 4, "title": "Diagnostic Assessment & Quiz", "time": "5m" }
  ],
  "sampleQuestions": [
    {
      "question": "Diagnostic question on ${cleanTopic}...",
      "options": ["Accurate correct answer choice", "Plausible distractor 1", "Plausible distractor 2", "Plausible distractor 3"],
      "correctIndex": 0
    },
    {
      "question": "Scenario question on ${cleanTopic}...",
      "options": ["Accurate correct answer choice", "Plausible distractor 1", "Plausible distractor 2", "Plausible distractor 3"],
      "correctIndex": 0
    }
  ],
  "relatedTopics": [
    "Advanced ${cleanTopic}",
    "Applications in Science & Engineering",
    "Problem Solving Masterclass"
  ]
}
`;
        const aiPromise = aiService.generateStructured(prompt, 'You are an educational search engine. Output valid JSON only.');
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 4000));
        aiSynthesis = await Promise.race([aiPromise, timeoutPromise]);
      } catch (aiErr) {
        console.warn('[SearchController] AI structured synthesis fallback used:', aiErr.message);
      }

      const overview = (aiSynthesis?.overview && aiSynthesis.overview.length > 20) 
        ? aiSynthesis.overview 
        : `Mastering ${topicUpper} requires understanding its fundamental laws, governing variables, and practical applications. EduVerse AI synthesizes core principles, real-time visual models, and adaptive assessments to guide you to 100% mastery.`;

      const keyConcepts = (aiSynthesis?.keyConcepts && Array.isArray(aiSynthesis.keyConcepts) && aiSynthesis.keyConcepts.length > 0)
        ? aiSynthesis.keyConcepts
        : [
          `Foundational Principles of ${topicUpper}`,
          `Governing Dynamics & Key Mechanisms`,
          `Real-World Applications & Edge Cases`,
          `Common Misconceptions & Exam Checkpoints`
        ];

      const suggestedPath = aiSynthesis?.suggestedPath || [
        { step: 1, title: 'Mental Models & Intuition', time: '5m' },
        { step: 2, title: 'Governing Dynamics & Derivations', time: '10m' },
        { step: 3, title: 'Problem Solving & Scenarios', time: '10m' },
        { step: 4, title: 'Diagnostic Assessment & Quiz', time: '5m' }
      ];

      const sampleQuestions = (aiSynthesis?.sampleQuestions && Array.isArray(aiSynthesis.sampleQuestions) && aiSynthesis.sampleQuestions.length > 0)
        ? aiSynthesis.sampleQuestions
        : [
          {
            question: `What fundamental principle primarily governs the mechanism of ${topicUpper}?`,
            options: ['Conservation laws and initial boundary constraints', 'Uncontrolled random fluctuations', 'Static non-interactive resistance', 'Undefined external noise'],
            correctIndex: 0
          },
          {
            question: `When analyzing problem scenarios in ${topicUpper}, which verification step is most critical?`,
            options: ['Checking dimensional units and boundary edge cases', 'Assuming all forces or values remain constant', 'Ignoring resistance and losses', 'Skipping intermediate derivation steps'],
            correctIndex: 0
          }
        ];

      const relatedTopics = aiSynthesis?.relatedTopics || [
        `Advanced ${topicUpper}`,
        `Applications in Science & Engineering`,
        `Problem Solving & Masterclass Problems`
      ];

      return res.json({
        success: true,
        query,
        topic: topicUpper,
        overview,
        keyConcepts,
        recommendedStudyTime: aiSynthesis?.recommendedStudyTime || '25 mins',
        prerequisites: aiSynthesis?.prerequisites || ['Fundamental scientific & mathematical logic'],
        youtubeVideos: educationalVideos,
        matchingFormulas,
        sampleQuestions,
        suggestedPath,
        relatedTopics
      });
    } catch (error) {
      console.error('[SearchController] Search error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SearchController();
