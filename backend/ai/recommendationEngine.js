const { ConceptMastery, LearningEvent, ReviewItem, LearningProfile, LessonSession, StudyPlan } = require('../models');
const masteryService = require('../services/masteryService');

class RecommendationEngine {
  /**
   * Generates prioritized recommendations with real causal reasoning
   */
  async getRecommendations(userId) {
    if (!userId) return [];
    const uId = userId.toString();

    const [profile, masteries, recentEvents, dueReviews, activeStudyPlan, unfinishedSessions] = await Promise.all([
      LearningProfile.findOne({ userId: uId }),
      ConceptMastery.find({ userId: uId }),
      LearningEvent.find({ userId: uId }),
      masteryService.getDueReviews(uId),
      StudyPlan.findOne({ userId: uId, status: 'active' }),
      LessonSession.find({ userId: uId, status: 'in_progress' })
    ]);

    const recommendations = [];

    // 1. Spaced Repetition Due Reviews
    if (dueReviews && dueReviews.length > 0) {
      const topReview = dueReviews[0];
      recommendations.push({
        id: 'rec_revision_' + (topReview._id || 'due'),
        type: 'revision',
        title: `Revise ${topReview.concept}`,
        subtitle: 'Spaced repetition interval due for optimal retention',
        reason: `SM-2 memory retention interval elapsed. Reviewing now prevents forgetting curve degradation.`,
        actionText: 'Start Spaced Revision',
        actionUrl: '/revision',
        priority: 'high',
        badge: 'FLASHCARD DUE',
        estimatedMinutes: 5,
        concept: topReview.concept
      });
    }

    // 2. Weak Concept Practice
    const weakConcepts = masteries
      .filter(m => m.masteryScore < 60 || m.status === 'weak')
      .sort((a, b) => (a.masteryScore || 0) - (b.masteryScore || 0));

    if (weakConcepts.length > 0) {
      const worst = weakConcepts[0];
      const incorrectCount = worst.incorrectAttempts || 1;
      const totalAttempts = worst.attempts || 1;

      recommendations.push({
        id: 'rec_weak_' + (worst._id || '1'),
        type: 'practice',
        title: `Reinforce ${worst.concept}`,
        subtitle: `Current Mastery: ${worst.masteryScore || 40}%`,
        reason: `You answered ${incorrectCount} of your last ${totalAttempts} questions incorrectly in this area.`,
        actionText: 'Practice Weak Area with ARIA',
        actionUrl: `/teacher?topic=${encodeURIComponent(worst.concept)}`,
        priority: 'high',
        badge: 'WEAK AREA',
        estimatedMinutes: 12,
        concept: worst.concept
      });

      if (weakConcepts.length > 1) {
        const secondWorst = weakConcepts[1];
        recommendations.push({
          id: 'rec_quiz_' + (secondWorst._id || '2'),
          type: 'quiz',
          title: `Targeted Quiz: ${secondWorst.concept}`,
          subtitle: 'Diagnostic check to rebuild mastery',
          reason: `Mastery score is at ${secondWorst.masteryScore || 50}%. A quick 5-question check will boost confidence.`,
          actionText: 'Launch Diagnostic Quiz',
          actionUrl: `/quiz?topic=${encodeURIComponent(secondWorst.concept)}`,
          priority: 'medium',
          badge: 'RECOMMENDED QUIZ',
          estimatedMinutes: 8,
          concept: secondWorst.concept
        });
      }
    }

    // 3. Unfinished Lesson Session
    if (unfinishedSessions && unfinishedSessions.length > 0) {
      const activeSession = unfinishedSessions[0];
      recommendations.push({
        id: 'rec_session_' + (activeSession._id || 'sess'),
        type: 'continue_lesson',
        title: `Continue: ${activeSession.topic || 'Interactive Lesson'}`,
        subtitle: 'Resume interactive learning session',
        reason: `You have an active session in progress. Complete it to unlock new mastery levels.`,
        actionText: 'Resume Lesson',
        actionUrl: `/classroom/${activeSession.lessonId || activeSession._id}`,
        priority: 'high',
        badge: 'IN PROGRESS',
        estimatedMinutes: 15,
        concept: activeSession.topic
      });
    }

    // 4. Preferred Learning Style Video / Interactive recommendation
    const preferredStyle = profile?.preferredExplanationStyle || 'visual';
    const favoriteSubject = (profile?.subjects && profile.subjects[0]) || 'Science';
    const topConcept = (masteries[0]?.concept) || (profile?.interests && profile.interests[0]) || 'Key Scientific Concepts';

    if (preferredStyle === 'visual' || preferredStyle === 'example_based') {
      recommendations.push({
        id: 'rec_video_visual',
        type: 'video',
        title: `Watch Visual Breakdown on ${topConcept}`,
        subtitle: 'YouTube grounded deep-dive with transcript timestamps',
        reason: `Your learning profile favors ${preferredStyle} explanations. Video analysis provides intuitive grounding.`,
        actionText: 'Explore YouTube Videos',
        actionUrl: `/youtube?q=${encodeURIComponent(topConcept)}`,
        priority: 'medium',
        badge: 'LEARNING STYLE MATCH',
        estimatedMinutes: 10,
        concept: topConcept
      });
    }

    // 5. Study Plan Task
    if (activeStudyPlan?.tasks) {
      const pendingTask = activeStudyPlan.tasks.find(t => !t.completed);
      if (pendingTask) {
        recommendations.push({
          id: 'rec_plan_task_' + (pendingTask.id || 'task'),
          type: 'study_plan',
          title: `Today's Goal: ${pendingTask.concept}`,
          subtitle: `Activity: ${pendingTask.activityType} (${pendingTask.estimatedMinutes}m)`,
          reason: `Scheduled in your active study plan for ${activeStudyPlan.title || 'Exams'}.`,
          actionText: 'Execute Task',
          actionUrl: pendingTask.activityType === 'quiz' ? `/quiz?topic=${encodeURIComponent(pendingTask.concept)}` : `/search?q=${encodeURIComponent(pendingTask.concept)}`,
          priority: 'medium',
          badge: 'SCHEDULED GOAL',
          estimatedMinutes: pendingTask.estimatedMinutes || 20,
          concept: pendingTask.concept
        });
      }
    }

    // Fallback dynamic general recommendation if learner has zero history
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'rec_intro_diagnostic',
        type: 'diagnostic',
        title: 'Complete Your Learning Profile & Diagnostic',
        subtitle: 'Calibrate ARIA to your current skill level',
        reason: 'Welcome to EduVerse! Establish your baseline mastery with an introductory diagnostic.',
        actionText: 'Start Diagnostic Quiz',
        actionUrl: '/create-quiz',
        priority: 'high',
        badge: 'GET STARTED',
        estimatedMinutes: 5,
        concept: 'Diagnostic Baseline'
      });
    }

    return recommendations;
  }
}

module.exports = new RecommendationEngine();
