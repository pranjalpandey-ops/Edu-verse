class AdaptiveTeacher {
  adaptSession(currentSession, recentResult) {
    const updated = { ...currentSession };
    
    if (recentResult.correct) {
      updated.consecutiveCorrect = (updated.consecutiveCorrect || 0) + 1;
      updated.consecutiveMistakes = 0;
      updated.mastery = Math.min(100, (updated.mastery || 50) + (recentResult.masteryDelta || 12));
      
      // If student is doing great, increase difficulty
      if (updated.consecutiveCorrect >= 2 && updated.difficulty === 'Beginner') {
        updated.difficulty = 'Intermediate';
        updated.adaptiveNote = "Great comprehension! Elevating challenge to Intermediate level.";
      } else if (updated.consecutiveCorrect >= 3 && updated.difficulty === 'Intermediate') {
        updated.difficulty = 'Advanced';
        updated.adaptiveNote = "Mastery demonstrated. Unlocking advanced problem scenarios.";
      }
    } else {
      updated.consecutiveMistakes = (updated.consecutiveMistakes || 0) + 1;
      updated.consecutiveCorrect = 0;
      updated.mastery = Math.max(10, (updated.mastery || 50) + (recentResult.masteryDelta || -8));

      // If student is struggling, adapt teaching style
      if (updated.consecutiveMistakes === 1) {
        updated.explanationStyle = 'analogy';
        updated.adaptiveNote = "Switching to relatable real-world analogy to solidify mental model.";
      } else if (updated.consecutiveMistakes >= 2) {
        updated.difficulty = 'Beginner';
        updated.explanationStyle = 'visual';
        updated.adaptiveNote = "Simplifying to foundational visual breakdown with animated diagrams.";
      }
    }

    return updated;
  }

  switchLanguage(currentSession, newLanguage) {
    return {
      ...currentSession,
      language: newLanguage,
      adaptiveNote: `Teaching language switched seamlessly to ${newLanguage} while preserving all progress and concept mastery.`
    };
  }
}

module.exports = new AdaptiveTeacher();
