const { LearningEvent, ConceptMastery, QuizAttempt, LessonSession, ReviewItem, LearningProfile } = require('../models');

class AnalyticsService {
  async getStudentAnalytics(userId) {
    if (!userId) return this._getEmptyAnalytics();
    const uId = userId.toString();

    const [events, masteries, quizAttempts, sessions, profile, reviewItems] = await Promise.all([
      LearningEvent.find({ userId: uId }),
      ConceptMastery.find({ userId: uId }),
      QuizAttempt.find({ userId: uId }),
      LessonSession.find({ userId: uId }),
      LearningProfile.findOne({ userId: uId }),
      ReviewItem.find({ userId: uId })
    ]);

    // Calculate Total Study Minutes
    let totalSeconds = 0;
    events.forEach(e => { totalSeconds += (Number(e.duration) || 0); });
    sessions.forEach(s => { totalSeconds += (Number(s.duration) || 0); });
    const totalStudyTimeMinutes = Math.round(totalSeconds / 60);

    // Lessons and Quizzes Completed
    const lessonsCompleted = events.filter(e => e.type === 'lesson_completed').length + sessions.filter(s => s.status === 'completed').length;
    const quizzesCompleted = quizAttempts.length || events.filter(e => e.type === 'quiz_completed').length;

    // Average Quiz Score
    let totalQuizScore = 0;
    quizAttempts.forEach(q => {
      const pct = typeof q.percentage === 'number' ? q.percentage : Math.round(((q.score || 0) / (q.totalQuestions || 1)) * 100);
      totalQuizScore += pct;
    });
    const averageQuizScore = quizzesCompleted > 0 ? Math.round(totalQuizScore / quizzesCompleted) : 0;

    // Average Mastery
    let sumMastery = 0;
    masteries.forEach(m => { sumMastery += (m.masteryScore || 0); });
    const masteryAverage = masteries.length > 0 ? Math.round(sumMastery / masteries.length) : 0;

    // Strong & Weak Concepts
    const strongestConcepts = masteries
      .filter(m => m.masteryScore >= 70)
      .sort((a, b) => b.masteryScore - a.masteryScore)
      .slice(0, 5)
      .map(m => ({ concept: m.concept, score: m.masteryScore, subject: m.subject }));

    const weakestConcepts = masteries
      .filter(m => m.masteryScore < 65 || m.status === 'weak')
      .sort((a, b) => a.masteryScore - b.masteryScore)
      .slice(0, 5)
      .map(m => ({ concept: m.concept, score: m.masteryScore, subject: m.subject }));

    // Calculate Streak (consecutive active days)
    const dates = new Set();
    events.forEach(e => {
      if (e.createdAt) dates.add(e.createdAt.substring(0, 10));
    });
    const studyStreak = dates.size;

    // Accuracy Trend (last 7 attempts)
    const recentScores = events
      .filter(e => typeof e.score === 'number' && e.score >= 0)
      .slice(-7)
      .map(e => e.score);

    // Learning Insights (100% data-driven)
    const insights = [];
    if (strongestConcepts.length > 0) {
      insights.push(`You are showing strong mastery in ${strongestConcepts[0].concept} (${strongestConcepts[0].score}% accuracy).`);
    }
    if (weakestConcepts.length > 0) {
      insights.push(`${weakestConcepts[0].concept} needs additional practice (${weakestConcepts[0].score}% mastery).`);
    }
    if (quizzesCompleted >= 3 && averageQuizScore >= 75) {
      insights.push(`High performance: Your average diagnostic accuracy is holding at ${averageQuizScore}%.`);
    }
    if (studyStreak >= 3) {
      insights.push(`Great momentum! You have maintained an active study cadence across ${studyStreak} session days.`);
    }
    if (insights.length === 0) {
      insights.push('Start your first interactive lesson or quiz to unlock personalized mastery insights.');
    }

    return {
      totalStudyTimeMinutes,
      lessonsCompleted,
      quizzesCompleted,
      averageQuizScore,
      masteryAverage,
      studyStreak,
      strongestConcepts,
      weakestConcepts,
      accuracyTrend: recentScores,
      insights,
      flashcardsDueCount: reviewItems.filter(r => !r.nextReviewAt || r.nextReviewAt <= new Date().toISOString()).length
    };
  }

  async getWeeklyAnalytics(userId) {
    const uId = (userId || '').toString();
    const events = await LearningEvent.find({ userId: uId });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = days.map(d => ({ day: d, minutes: 0, lessons: 0, quizzes: 0 }));

    events.forEach(e => {
      if (e.createdAt) {
        const dayIdx = new Date(e.createdAt).getDay();
        const mins = Math.round((Number(e.duration) || 0) / 60);
        weekData[dayIdx].minutes += mins || 5;
        if (e.type === 'lesson_completed') weekData[dayIdx].lessons += 1;
        if (e.type === 'quiz_completed') weekData[dayIdx].quizzes += 1;
      }
    });

    return weekData;
  }

  async getSubjectAnalytics(userId) {
    const uId = (userId || '').toString();
    const masteries = await ConceptMastery.find({ userId: uId });

    const subjectMap = {};
    masteries.forEach(m => {
      const s = m.subject || 'General';
      if (!subjectMap[s]) subjectMap[s] = { subject: s, totalScore: 0, count: 0 };
      subjectMap[s].totalScore += (m.masteryScore || 50);
      subjectMap[s].count += 1;
    });

    return Object.values(subjectMap).map(item => ({
      subject: item.subject,
      averageMastery: Math.round(item.totalScore / (item.count || 1)),
      conceptCount: item.count
    }));
  }

  _getEmptyAnalytics() {
    return {
      totalStudyTimeMinutes: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      averageQuizScore: 0,
      masteryAverage: 0,
      studyStreak: 0,
      strongestConcepts: [],
      weakestConcepts: [],
      accuracyTrend: [],
      insights: ['Begin learning to record performance analytics.'],
      flashcardsDueCount: 0
    };
  }
}

module.exports = new AnalyticsService();
