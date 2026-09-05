/**
 * Robust JSON extraction and validation for AI responses
 */

function extractJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty AI response received.');
  }

  let text = rawText.trim();

  // Strip markdown code fences (```json ... ``` or ``` ...)
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // If text contains JSON within other text, locate the first { or [ and matching last } or ]
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = text.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = text.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    text = text.slice(startIdx, endIdx + 1);
  }

  // Attempt initial parse
  try {
    return JSON.parse(text);
  } catch (err) {
    // Clean trailing commas in arrays/objects
    const sanitized = text
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/[\u0000-\u001F]+/g, ' '); // Strip control characters

    try {
      return JSON.parse(sanitized);
    } catch (finalErr) {
      throw new Error(`JSON parsing failed: ${finalErr.message}`);
    }
  }
}

function validateLessonSchema(data, fallbackTopic = 'General Science') {
  if (!data || typeof data !== 'object') {
    throw new Error('Lesson data must be a valid JSON object.');
  }

  const title = data.title || `${fallbackTopic} Mastery Lesson`;
  const topic = data.topic || fallbackTopic;
  const subject = data.subject || 'General Education';
  const level = data.level || 'Beginner';
  const objectives = Array.isArray(data.objectives) && data.objectives.length > 0
    ? data.objectives
    : [`Understand foundational principles of ${topic}`, `Apply ${topic} to practical problem solving`];

  let rawSections = Array.isArray(data.sections) && data.sections.length > 0
    ? data.sections
    : [];

  if (rawSections.length === 0) {
    rawSections = [
      {
        title: `Introduction to ${topic}`,
        concept: `${topic} Foundations`,
        explanation: `Let's explore the core concepts governing ${topic}.`,
        speechScript: `Welcome to our session on ${topic}. Let's break down the main ideas step by step.`,
        example: `Practical application of ${topic} in real-world contexts.`,
        teachingStrategy: 'direct_explanation',
        question: {
          id: 'q1',
          question: `What is the primary governing idea in ${topic}?`,
          options: [
            { id: 'A', text: `It explains core mechanisms in ${topic}.`, correct: true },
            { id: 'B', text: 'It has no practical relevance.', correct: false }
          ]
        }
      }
    ];
  }

  const sections = rawSections.map((sec, idx) => ({
    title: sec.title || `Section ${idx + 1}: ${topic}`,
    concept: sec.concept || sec.title || `${topic} Key Rule`,
    explanation: sec.explanation || `Key theoretical breakdown of ${topic}.`,
    speechScript: sec.speechScript || sec.explanation || `Let's analyze this concept in detail.`,
    example: sec.example || `Real-world example illustrating this principle.`,
    teachingStrategy: sec.teachingStrategy || 'step_by_step',
    visualData: sec.visualData || {
      type: 'concept_card',
      title: sec.title || topic,
      elements: [sec.concept || topic]
    },
    question: sec.question && typeof sec.question === 'object'
      ? {
          id: sec.question.id || `q_${idx + 1}`,
          concept: sec.concept || topic,
          question: sec.question.question || `How does this principle apply to ${topic}?`,
          options: Array.isArray(sec.question.options) && sec.question.options.length > 1
            ? sec.question.options
            : [
                { id: 'A', text: 'It governs system behavior correctly.', correct: true },
                { id: 'B', text: 'It has no effect.', correct: false }
              ]
        }
      : {
          id: `q_${idx + 1}`,
          concept: sec.concept || topic,
          question: `Which statement accurately describes ${sec.concept || topic}?`,
          options: [
            { id: 'A', text: 'It correctly represents the primary mechanism.', correct: true },
            { id: 'B', text: 'It contradicts the fundamental rule.', correct: false }
          ]
        }
  }));

  return {
    title,
    topic,
    subject,
    level,
    objectives,
    sections,
    summary: data.summary || `Comprehensive overview and mastery takeaways for ${topic}.`,
    homework: Array.isArray(data.homework) ? data.homework : [`Review 3 real-world problems in ${topic}`],
    revisionPoints: Array.isArray(data.revisionPoints) ? data.revisionPoints : [`Key formula and principle of ${topic}`]
  };
}

module.exports = {
  extractJSON,
  validateLessonSchema
};
