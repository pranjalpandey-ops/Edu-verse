const aiService = require('../services/aiService');

class YouTubeController {
  async search(req, res) {
    try {
      const query = req.query.q || req.body.query || 'Physics';
      const cleanTopic = query.replace(/[^\w\s\-:.]/g, '');
      const topicTitle = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);

      const videos = [
        {
          videoId: 'vid_yt_1',
          title: `Mastering ${topicTitle} from First Principles`,
          channelTitle: 'EduVerse Academy',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
          duration: '18:40',
          views: '420K views',
          difficulty: 'Beginner Friendly',
          badge: 'Top Pick for Concept Clarity',
          matchScore: 99,
          whyRecommended: `Outstanding visual animations breaking down ${topicTitle} step-by-step with real-world demos.`
        },
        {
          videoId: 'vid_yt_2',
          title: `${topicTitle}: Complete Visual Derivations & Logic`,
          channelTitle: 'Visual Learning Lab',
          thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
          duration: '22:15',
          views: '1.1M views',
          difficulty: 'Intermediate',
          badge: 'Deep Dive',
          matchScore: 94,
          whyRecommended: `Detailed structural breakdown and intuitive formulas for mastering complex scenarios.`
        },
        {
          videoId: 'vid_yt_3',
          title: `${topicTitle} - Exam Revision & High-Yield Questions`,
          channelTitle: 'PrepSprint AI',
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
          duration: '12:50',
          views: '670K views',
          difficulty: 'Revision',
          badge: 'Fast Review',
          matchScore: 91,
          whyRecommended: `Quick-paced summary of key formulas, high-frequency test questions, and pitfall warnings.`
        }
      ];

      return res.json({ success: true, videos, query });
    } catch (error) {
      console.error('[YouTubeController] search error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getVideoDetails(req, res) {
    try {
      const { videoId } = req.params;
      const topic = req.query.topic || 'Core Concept';
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      const videoData = {
        videoId,
        title: `Comprehensive Guide to ${cleanTopic}`,
        channel: 'EduVerse AI Educator',
        views: '540,210',
        publishedAt: '2026',
        durationSeconds: 1120,
        formattedDuration: '18:40',
        description: `An in-depth, intuitive exploration of ${cleanTopic}. Learn the foundational laws, observe interactive visual models, and master practical problem-solving.`,
        chapters: [
          { timestamp: '00:00', seconds: 0, title: `Introduction & Real-World Motivation for ${cleanTopic}` },
          { timestamp: '03:45', seconds: 225, title: 'First Principles & Core Terminology' },
          { timestamp: '08:20', seconds: 500, title: 'Governing Equations & Key Variables' },
          { timestamp: '12:50', seconds: 770, title: 'Step-by-Step Problem Solving & Edge Cases' },
          { timestamp: '16:10', seconds: 970, title: 'Key Takeaways & High-Yield Exam Summary' }
        ],
        transcript: [
          { timestamp: '00:15', seconds: 15, text: `Welcome to EduVerse! Today we are exploring ${cleanTopic}. Have you ever wondered how complex systems maintain balance under changing conditions?` },
          { timestamp: '03:50', seconds: 230, text: `To understand ${cleanTopic}, we must isolate the fundamental variables: the driving potential, the system constraints, and the resulting throughput.` },
          { timestamp: '08:25', seconds: 505, text: `When we look at the mathematical model, notice that the relationship is strictly governed by fundamental laws. If opposition increases, flow decreases proportionally.` },
          { timestamp: '13:00', seconds: 780, text: `Let us work through a concrete calculation. Notice how isolating the known values prevents confusion in multi-step questions.` },
          { timestamp: '16:15', seconds: 975, text: `In summary, mastering ${cleanTopic} comes down to identifying boundary conditions and applying the direct rules with confidence.` }
        ],
        keyTakeaways: [
          `${cleanTopic} is governed by predictable input-output relationships.`,
          `Increasing internal resistance or system constraints inherently reduces net output when driving force is constant.`,
          `Always write down known variables and unit conversions before solving calculation problems.`,
          `Real-world applications rely on balancing efficiency against physical constraints.`
        ]
      };

      return res.json({ success: true, video: videoData });
    } catch (error) {
      console.error('[YouTubeController] getVideoDetails error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async askQuestion(req, res) {
    try {
      const { videoId, question, topic } = req.body;
      const cleanTopic = (topic || 'this topic').charAt(0).toUpperCase() + (topic || 'this topic').slice(1);

      const response = {
        answer: `According to the video at [08:25], ${cleanTopic} operates on the principle that throughput depends directly on driving potential and inversely on internal opposition. The instructor emphasizes that whenever resistance increases under constant driving force, output decreases accordingly.`,
        timestamps: [
          { time: '08:25', seconds: 505, label: 'Concept Explanation' },
          { time: '13:00', seconds: 780, label: 'Worked Example' }
        ],
        suggestedFollowUps: [
          `What happens if driving potential increases while resistance is constant?`,
          `How is this applied in real-world systems?`,
          `Can you give me a practice quiz question on this?`
        ]
      };

      return res.json({ success: true, ...response });
    } catch (error) {
      console.error('[YouTubeController] askQuestion error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateQuiz(req, res) {
    try {
      const { videoId, topic } = req.body;
      const cleanTopic = (topic || 'the video concept').charAt(0).toUpperCase() + (topic || 'the video concept').slice(1);

      const quiz = {
        title: `Video Mastery Check: ${cleanTopic}`,
        questions: [
          {
            id: 'vq_1',
            question: `In the video at [03:45], what are identified as the primary building blocks of ${cleanTopic}?`,
            options: [
              { id: 'A', text: 'Driving potential, system constraints, and resulting throughput', correct: true },
              { id: 'B', text: 'Random fluctuations and uncontrollable noise', correct: false },
              { id: 'C', text: 'Purely static non-interacting constants', correct: false },
              { id: 'D', text: 'Unrelated external temperature changes', correct: false }
            ],
            timestamp: '03:45',
            explanation: 'The video establishes these three core components as the foundation for the entire model.'
          },
          {
            id: 'vq_2',
            question: `According to the derivation at [08:25], what is the relationship between system constraint and net throughput?`,
            options: [
              { id: 'A', text: 'Inverse: as constraints increase, throughput decreases', correct: true },
              { id: 'B', text: 'Direct: higher constraints multiply throughput', correct: false },
              { id: 'C', text: 'Independent: constraints have no effect', correct: false },
              { id: 'D', text: 'Exponential growth under all conditions', correct: false }
            ],
            timestamp: '08:25',
            explanation: 'Opposition acts as a limiter on flow rate.'
          },
          {
            id: 'vq_3',
            question: `In the step-by-step example at [13:00], what is recommended as the first action when solving a problem?`,
            options: [
              { id: 'A', text: 'Isolate known variables and check boundary conditions', correct: true },
              { id: 'B', text: 'Guess the final number without calculation', correct: false },
              { id: 'C', text: 'Skip straight to the conclusion', correct: false },
              { id: 'D', text: 'Change the units arbitrarily', correct: false }
            ],
            timestamp: '13:00',
            explanation: 'Isolating variables prevents calculation errors.'
          }
        ]
      };

      return res.json({ success: true, quiz });
    } catch (error) {
      console.error('[YouTubeController] generateQuiz error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateNotes(req, res) {
    try {
      const { videoId, topic } = req.body;
      const cleanTopic = (topic || 'Video Learning').charAt(0).toUpperCase() + (topic || 'Video Learning').slice(1);

      const notes = {
        title: `Comprehensive Video Notes: ${cleanTopic}`,
        summary: `Structured summary synthesized from the video masterclass on ${cleanTopic}. Covers definitions, governing laws, worked mathematical derivations, and exam preparation tips.`,
        sections: [
          {
            heading: '1. First Principles & Motivation',
            content: `${cleanTopic} describes how physical or computational systems transform inputs into governed outputs under defined constraints.`
          },
          {
            heading: '2. Core Governing Model',
            content: 'Throughput is directly proportional to driving stimulus and inversely proportional to opposition friction.'
          },
          {
            heading: '3. Problem Solving Strategy',
            content: 'Always list known values, ensure standard units, and substitute into the governing formula before evaluating edge cases.'
          }
        ],
        tags: [cleanTopic, 'Video Summary', 'EduVerse AI', 'High-Yield']
      };

      return res.json({ success: true, notes });
    } catch (error) {
      console.error('[YouTubeController] generateNotes error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new YouTubeController();
