class MisconceptionDetector {
  diagnoseAnswer(question, studentAnswer, concept) {
    const isCorrect = this._checkAnswer(question, studentAnswer);
    const conceptName = concept || (question && question.concept) || "Core Concept";
    
    if (isCorrect) {
      return {
        correct: true,
        score: 1.0,
        concept: conceptName,
        misconception: null,
        feedback: "Spot on! You have correctly understood the fundamental relationship and principles.",
        nextAction: "continue",
        masteryDelta: +15
      };
    }

    const qText = ((question && question.question) || '').toLowerCase();
    const ansText = (typeof studentAnswer === 'string' ? studentAnswer : (studentAnswer && studentAnswer.text ? studentAnswer.text : '')).toLowerCase();
    const selectedOption = (studentAnswer && studentAnswer.id ? studentAnswer.id : studentAnswer || '').toString().toUpperCase();

    // Check for specific inverse vs direct relationship confusion
    if (qText.includes('constraint') || qText.includes('resistance') || qText.includes('opposes') || qText.includes('inverse')) {
      return {
        correct: false,
        score: 0.0,
        concept: conceptName,
        misconception: {
          concept: conceptName,
          misconception: `Student confused inverse and direct relationships in ${conceptName}.`,
          severity: "high",
          rootCause: "Assumed that increasing system constraint/resistance leads to an increase in throughput rather than a decrease.",
          explanationStrategy: "analogy",
          analogyName: "Flow & Restriction Analogy",
          resolved: false
        },
        remedialExplanation: {
          title: `Let us examine ${conceptName} with the Flow & Restriction Analogy`,
          teacherSpeech: `I see what happened! When you think about driving force, more push means more throughput. But when a constraint or resistance increases, it acts like a narrow doorway: the tighter the bottleneck, the LESS net flow can pass through every second!`,
          analogySteps: [
            "1. Driving Stimulus = Energy or pressure pushing the system forward.",
            "2. Opposition / Resistance = Friction, bottlenecks, or constraints slowing down the process.",
            "3. Net Result = The actual flow or rate of transformation.",
            "Conclusion: When resistance increases with constant driving force, net flow must DECREASE."
          ]
        },
        followUpQuestion: {
          id: "q_remedial_inverse",
          type: "MCQ",
          question: `If a bottleneck or opposing friction in ${conceptName} is doubled while maintaining constant input energy, what happens to the output rate?`,
          options: [
            { id: "A", text: "The output rate decreases (Opposition limits flow)", correct: true },
            { id: "B", text: "The output rate increases (Opposition multiplies flow)", correct: false }
          ],
          explanation: "Opposition acts as a limiter; increasing resistance always reduces throughput."
        },
        feedback: "AI detected an inverse relationship misconception. Let's review the bottleneck analogy!",
        nextAction: "remedial_analogy",
        masteryDelta: -10
      };
    }

    // Default intelligent diagnostic for any topic
    return {
      correct: false,
      score: 0.2,
      concept: conceptName,
      misconception: {
        concept: conceptName,
        misconception: `Misinterpretation of core governing condition in ${conceptName}.`,
        severity: "medium",
        explanationStrategy: "step_by_step",
        resolved: false
      },
      remedialExplanation: {
        title: `Let's break down ${conceptName} step-by-step`,
        teacherSpeech: `Not quite, but you are very close! In ${conceptName}, every rule is bounded by specific conditions. Let us isolate what stays constant and what changes.`,
        analogySteps: [
          `1. Identify the primary input variable in ${conceptName}.`,
          "2. Check what constraints or governing laws apply.",
          "3. Apply the direct rule to predict the exact outcome."
        ]
      },
      followUpQuestion: {
        id: "q_remedial_gen",
        type: "MCQ",
        question: `When analyzing a system in ${conceptName}, which factor is most crucial to evaluate first?`,
        options: [
          { id: "A", text: "The governing boundaries, inputs, and physical/mathematical laws", correct: true },
          { id: "B", text: "Assuming the answer without reviewing boundary conditions", correct: false }
        ],
        explanation: "Establishing boundary conditions and governing rules provides the accurate foundation."
      },
      feedback: "Let us review the step-by-step foundation before continuing.",
      nextAction: "remedial_analogy",
      masteryDelta: -5
    };
  }

  _checkAnswer(question, studentAnswer) {
    if (!question || !question.options) return false;
    const selected = (studentAnswer && studentAnswer.id ? studentAnswer.id : studentAnswer || '').toString().trim().toUpperCase();
    const correctOpt = question.options.find(o => o.correct === true);
    if (correctOpt) {
      if (selected === correctOpt.id.toString().toUpperCase()) return true;
      if (typeof studentAnswer === 'string' && studentAnswer.toLowerCase().includes(correctOpt.text.toLowerCase())) return true;
    }
    return false;
  }
}

module.exports = new MisconceptionDetector();
