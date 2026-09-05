const youtubeService = require('../services/youtubeService');
const videoRag = require('../rag/videoRag');
const aiService = require('../services/aiService');
const { Note, Quiz, VideoLearning } = require('../models');

class YouTubeController {
  async search(req, res) {
    try {
      const query = req.query.q || req.body.query || 'Physics & Computing';
      const level = req.query.level || 'High School';
      const language = req.query.language || 'English';

      const videos = await youtubeService.searchVideos(query, { level, language });
      return res.json({ success: true, videos, query });
    } catch (error) {
      console.error('[YouTubeController] search error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getVideoDetails(req, res) {
    try {
      const { videoId } = req.params;
      const topic = req.query.topic || req.query.q || 'Masterclass';

      const video = await youtubeService.getVideoDetails(videoId, topic);
      return res.json({ success: true, video });
    } catch (error) {
      console.error('[YouTubeController] getVideoDetails error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async askQuestion(req, res) {
    try {
      const { videoId = req.params.videoId, question, topic } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, message: 'Question is required' });
      }

      const videoData = await youtubeService.getVideoDetails(videoId, topic);
      const ragResult = await videoRag.answerQuestion(videoId, question, videoData);

      return res.json({
        success: true,
        answer: ragResult.answer,
        grounded: ragResult.grounded,
        timestamps: ragResult.timestamps,
        sources: ragResult.sources,
        suggestedFollowUps: [
          `Can you break down the mathematical derivation shown in this video?`,
          `How does this concept apply in real-world engineering?`,
          `Generate a quick 3-question quiz from this video.`
        ]
      });
    } catch (error) {
      console.error('[YouTubeController] askQuestion error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateSummary(req, res) {
    try {
      const { videoId = req.params.videoId, topic = 'Video Concept' } = req.body;
      const videoData = await youtubeService.getVideoDetails(videoId, topic);
      const textToSummarize = (videoData.transcript || []).map(t => t.text).join(' ') || videoData.description;

      const summary = await aiService.generateSummary(textToSummarize);
      return res.json({
        success: true,
        videoId,
        summary: {
          overview: summary.overview || `Masterclass covering ${topic}.`,
          keyConcepts: summary.keyConcepts || videoData.keyTakeaways,
          definitions: summary.definitions || [],
          formulas: summary.formulas || [],
          examPoints: summary.examPoints || [`Review key relationships established at [08:25]`]
        }
      });
    } catch (error) {
      console.error('[YouTubeController] generateSummary error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateNotes(req, res) {
    try {
      const { videoId = req.params.videoId, topic = 'Video Lecture' } = req.body;
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      const videoData = await youtubeService.getVideoDetails(videoId, cleanTopic);
      const textToSummarize = (videoData.transcript || []).map(t => t.text).join(' ') || videoData.description;
      const summary = await aiService.generateSummary(textToSummarize);

      const note = await Note.create({
        userId,
        videoId,
        title: `Video Notes: ${cleanTopic}`,
        topic: cleanTopic,
        summary: summary.overview || `Comprehensive notes generated from YouTube masterclass on ${cleanTopic}.`,
        formulas: summary.formulas || [],
        keyPoints: summary.keyConcepts || videoData.keyTakeaways,
        sections: videoData.chapters?.map(ch => ({
          heading: `${ch.timestamp} - ${ch.title}`,
          content: `Key concepts discussed at ${ch.timestamp}.`
        })) || [],
        tags: [cleanTopic, 'YouTube Lecture', 'EduVerse AI'],
        createdAt: new Date().toISOString()
      });

      // Update VideoLearning reference
      await VideoLearning.updateOne(
        { userId, videoId },
        { notesId: note._id, lastWatchedAt: new Date().toISOString() }
      );

      return res.status(201).json({ success: true, note });
    } catch (error) {
      console.error('[YouTubeController] generateNotes error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateQuiz(req, res) {
    try {
      const { videoId = req.params.videoId, topic = 'Video Concept', questionCount = 5, difficulty = 'medium' } = req.body;
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      const videoData = await youtubeService.getVideoDetails(videoId, cleanTopic);
      const ragContext = {
        hasContext: true,
        groundedContext: (videoData.transcript || []).map(t => `[${t.timestamp}] ${t.text}`).join('\n')
      };

      const questions = await aiService.generateQuizQuestions({
        topic: cleanTopic,
        subject: 'Video Study Module',
        difficulty,
        questionCount: parseInt(questionCount) || 5,
        ragContext
      });

      const quiz = await Quiz.create({
        userId,
        title: `Video Mastery Quiz: ${cleanTopic}`,
        topic: cleanTopic,
        subject: 'YouTube Learning',
        description: `Interactive assessment grounded in the video tutorial on ${cleanTopic}.`,
        sourceType: 'video',
        sourceId: videoId,
        difficulty,
        questionCount: questions.length,
        timeLimit: questions.length * 60,
        questions,
        createdAt: new Date().toISOString()
      });

      // Update VideoLearning reference
      await VideoLearning.updateOne(
        { userId, videoId },
        { quizId: quiz._id, lastWatchedAt: new Date().toISOString() }
      );

      // Sanitize safe questions
      const safeQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type || 'mcq',
        concept: q.concept || cleanTopic,
        difficulty: q.difficulty || difficulty,
        options: q.options ? q.options.map(opt => ({ id: opt.id, text: opt.text })) : undefined
      }));

      return res.status(201).json({
        success: true,
        quiz: {
          id: quiz._id,
          title: quiz.title,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          questionCount: quiz.questionCount,
          timeLimit: quiz.timeLimit,
          questions: safeQuestions
        }
      });
    } catch (error) {
      console.error('[YouTubeController] generateQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateProgress(req, res) {
    try {
      const { videoId } = req.params;
      const { title, channel, topic, progress = 0, watchedSeconds = 0, completed = false } = req.body;
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';

      const existing = await VideoLearning.findOne({ userId, videoId });
      let record;

      if (existing) {
        await VideoLearning.updateOne({ userId, videoId }, {
          progress,
          watchedSeconds,
          completed: completed || progress >= 90,
          lastWatchedAt: new Date().toISOString()
        });
        record = await VideoLearning.findOne({ userId, videoId });
      } else {
        record = await VideoLearning.create({
          userId,
          videoId,
          title: title || 'Educational Video',
          channel: channel || 'Educator',
          topic: topic || 'General Science',
          progress,
          watchedSeconds,
          completed: completed || progress >= 90,
          lastWatchedAt: new Date().toISOString()
        });
      }

      return res.json({ success: true, videoLearning: record });
    } catch (error) {
      console.error('[YouTubeController] updateProgress error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
      const history = await VideoLearning.find({ userId });
      return res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new YouTubeController();
