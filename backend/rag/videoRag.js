const aiService = require('../services/aiService');
const vectorStore = require('./vectorStore');

class VideoRAG {
  async buildVideoPrompt(question, videoData = {}) {
    const transcript = videoData.transcript || [];
    const cleanQ = (question || '').toLowerCase();

    if (transcript.length === 0) {
      return {
        grounded: false,
        contextText: `Video Title: ${videoData.title || 'Educational Video'}\nDescription: ${videoData.description || 'Concept masterclass'}`,
        timestamps: [],
        message: "AI video understanding isn't available for this video because a usable transcript could not be obtained."
      };
    }

    // Find relevant transcript segments
    const matchingSegments = transcript.filter(seg => {
      const sText = (seg.text || '').toLowerCase();
      return cleanQ.split(' ').some(w => w.length > 3 && sText.includes(w));
    });

    const relevant = matchingSegments.length > 0 ? matchingSegments.slice(0, 3) : transcript.slice(0, 3);

    const contextText = relevant.map(r => `[Timestamp: ${r.timestamp}] ${r.text}`).join('\n');
    const timestamps = relevant.map(r => ({
      time: r.timestamp,
      seconds: r.seconds,
      label: r.text.slice(0, 50) + '...'
    }));

    return {
      grounded: true,
      contextText,
      timestamps,
      message: null
    };
  }

  async answerQuestion(videoId, question, videoData = {}) {
    const videoCtx = await this.buildVideoPrompt(question, videoData);
    const title = videoData.title || 'Educational Video';

    const prompt = `Student asked question about YouTube lecture "${title}":
"${question}"

Available Video Transcript & Context:
${videoCtx.contextText}

Provide an accurate, grounded answer citing specific video timestamps (e.g. [03:45]) where relevant:`;

    const answer = await aiService.generateText(prompt, 'You are an elite video learning assistant explaining concepts based on lecture videos.');

    return {
      answer,
      grounded: videoCtx.grounded,
      timestamps: videoCtx.timestamps,
      sources: videoCtx.timestamps.map(t => ({ timestamp: t.time, snippet: t.label }))
    };
  }
}

module.exports = new VideoRAG();
