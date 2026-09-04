class MisconceptionDetector {
  diagnoseAnswer(question, studentAnswer, concept) {
    const isCorrect = this._checkAnswer(question, studentAnswer);
    
    if (isCorrect) {
      return {
        correct: true,
        score: 1.0,
        concept: concept || question.concept || "Ohm's Law",
        misconception: null,
        feedback: "Spot on! You have correctly understood the fundamental inverse relationship.",
        nextAction: "continue",
        masteryDelta: +15
      };
    }

    // Critical Hackathon Misconception Diagnosis Logic
    const qText = (question.question || '').toLowerCase();
    const ansText = (typeof studentAnswer === 'string' ? studentAnswer : (studentAnswer.text || '')).toLowerCase();
    const selectedOption = (studentAnswer.id || studentAnswer).toString().toUpperCase();

    // Specific Ohm's Law inverse relationship misconception
    if (qText.includes('resistance') && (qText.includes('current') || qText.includes('voltage'))) {
      if (selectedOption === 'A' || ansText.includes('increases') || ansText.includes('proportional')) {
        return {
          correct: false,
          score: 0.0,
          concept: "Resistance & Ohm's Law",
          misconception: {
            concept: "Resistance",
            misconception: "Student reversed the inverse relationship between current and resistance, assuming current increases when resistance increases.",
            severity: "high",
            rootCause: "Confusion between Direct Proportionality (V ~ I) and Inverse Proportionality (I ~ 1/R).",
            explanationStrategy: "analogy",
            analogyName: "Water-Pipe Resistance Analogy",
            resolved: false
          },
          remedialExplanation: {
            title: "Let us look at it with the Water-Pipe Analogy",
            teacherSpeech: "I see what happened! You might be thinking about how more Voltage gives more Current. But Resistance is the opposite—it is like a constriction or a valve in a water pipe. If you squeeze the pipe tighter (higher resistance), LESS water can pass through every second, not more!",
            analogySteps: [
              "1. Voltage (V) = Water Pump Pressure pushing water forward.",
              "2. Resistance (R) = Narrowing or clogging inside the pipe.",
              "3. Current (I) = The actual amount of water flowing per second.",
              "Conclusion: If you squeeze the pipe tighter (R increases), water flow (I) must DECREASE!"
            ]
          },
          followUpQuestion: {
            id: "q_remedial_1",
            type: "MCQ",
            question: "Imagine you are drinking a thick milkshake through a very narrow straw (high resistance) versus a wide straw (low resistance). With the same suction pressure, through which straw does less milkshake flow?",
            options: [
              { id: "A", text: "Through the narrow straw (High Resistance = Less Flow)", correct: true },
              { id: "B", text: "Through the wide straw (Low Resistance = Less Flow)", correct: false }
            ],
            explanation: "Higher resistance restricts flow, so less milkshake flows through the narrow straw."
          },
          feedback: "AI detected a common misconception: confusing direct vs inverse relationships. Let's explore the water pipe analogy!",
          nextAction: "remedial_analogy",
          masteryDelta: -10
        };
      }
    }

    // Default intelligent diagnostic
    return {
      correct: false,
      score: 0.2,
      concept: concept || "Core Concept",
      misconception: {
        concept: concept || "Core Concept",
        misconception: "Partial understanding of concept constraints.",
        severity: "medium",
        explanationStrategy: "step_by_step",
        resolved: false
      },
      remedialExplanation: {
        title: "Let's simplify this step-by-step",
        teacherSpeech: "Not quite, but you are very close! Let us review the key definition together and look at an immediate practical example.",
        analogySteps: [
          "1. Identify the input variable.",
          "2. Notice what stays constant.",
          "3. Apply the direct governing rule."
        ]
      },
      followUpQuestion: {
        id: "q_remedial_gen",
        type: "MCQ",
        question: "When resistance opposes current flow, does higher opposition make it easier or harder for charges to move?",
        options: [
          { id: "A", text: "Harder (Current decreases)", correct: true },
          { id: "B", text: "Easier (Current increases)", correct: false }
        ],
        explanation: "Opposition restricts motion, decreasing the flow."
      },
      feedback: "Let us clarify the mechanism before continuing.",
      nextAction: "remedial_analogy",
      masteryDelta: -5
    };
  }

  _checkAnswer(question, studentAnswer) {
    if (!question || !question.options) return false;
    const selected = (studentAnswer.id || studentAnswer || '').toString().trim().toUpperCase();
    const correctOpt = question.options.find(o => o.correct === true);
    if (correctOpt) {
      if (selected === correctOpt.id.toString().toUpperCase()) return true;
      if (typeof studentAnswer === 'string' && studentAnswer.toLowerCase().includes(correctOpt.text.toLowerCase())) return true;
    }
    return false;
  }
}

module.exports = new MisconceptionDetector();
