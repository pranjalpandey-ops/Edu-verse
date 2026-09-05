const axios = require('axios');
const { extractJSON, validateLessonSchema } = require('../utils/validateAIResponse');

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-3.6-flash';
    this.provider = process.env.AI_PROVIDER || (this.apiKey ? 'gemini' : 'demo');
  }

  async _callRemoteLLM(prompt, systemInstruction = '', expectJSON = false) {
    if (!this.apiKey || this.provider === 'demo') {
      throw new Error('AI API key is missing or DEMO_MODE is active.');
    }

    const isGemini = this.apiKey.startsWith('AIza') || this.apiKey.startsWith('AQ.') || this.provider === 'gemini';

    if (isGemini) {
      const modelName = this.model || 'gemini-3.6-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${systemInstruction ? systemInstruction + '\n\n' : ''}${expectJSON ? 'Respond ONLY with a valid JSON object matching the requested schema without comments.\n\n' : ''}${prompt}`
              }
            ]
          }
        ],
        ...(expectJSON ? { generationConfig: { responseMimeType: 'application/json' } } : {})
      };

      let lastErr;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await axios.post(url, payload, { timeout: 35000 });
          const candidate = res.data?.candidates?.[0];
          if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text;
          }
        } catch (err) {
          lastErr = err;
          if (attempt === 0) await new Promise(r => setTimeout(r, 1200));
        }
      }
      throw lastErr || new Error('Empty response candidate from Gemini.');
    } else {
      // OpenAI-compatible endpoint
      const res = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: this.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction + (expectJSON ? ' Return valid JSON only.' : '') },
          { role: 'user', content: prompt }
        ],
        ...(expectJSON ? { response_format: { type: 'json_object' } } : {})
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        timeout: 30000
      });
      return res.data.choices[0].message.content;
    }
  }

  async generateText(prompt, systemInstruction = 'You are EduVerse AI, an expert adaptive teacher.') {
    try {
      if (this.apiKey && this.provider !== 'demo') {
        const text = await this._callRemoteLLM(prompt, systemInstruction, false);
        return text.trim();
      }
    } catch (err) {
      console.warn(`[AIService] Remote LLM text generation fallback: ${err.message}`);
    }

    return this._generateDynamicTextFallback(prompt);
  }

  async generateStructured(prompt, systemInstruction = 'You are EduVerse AI. Return valid structured JSON.') {
    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, systemInstruction, true);
        try {
          return extractJSON(raw);
        } catch (jsonErr) {
          console.warn('[AIService] JSON extract failed, retrying once with correction prompt...');
          const retryPrompt = `Fix the following malformed JSON and return ONLY the valid JSON object:\n\n${raw}`;
          const fixedRaw = await this._callRemoteLLM(retryPrompt, 'Return clean valid JSON only.', true);
          return extractJSON(fixedRaw);
        }
      }
    } catch (err) {
      console.warn(`[AIService] Remote structured generation fallback: ${err.message}`);
    }

    return this._generateDynamicJSONFallback(prompt);
  }

  async generateLesson(topic, options = {}, ragContext = null) {
    const {
      subject = 'Academic Foundations',
      level = 'High School',
      language = 'English',
      duration = 20,
      goal = 'Exam Preparation & Mastery',
      teachingStyle = 'Intuitive Analogies & Math'
    } = options;

    let ragSection = '';
    if (ragContext && ragContext.hasContext) {
      ragSection = `\n\nCOURSE REFERENCE MATERIAL:\n${ragContext.groundedContext}\n\nSTRICT INSTRUCTION: Ground your lesson in the provided course reference material above. Cite relevant sections.`;
    }

    const prompt = `Generate a comprehensive interactive lesson plan for:
Topic: "${topic}"
Subject: "${subject}"
Education Level: ${level}
Teaching Style: ${teachingStyle}
Target Duration: ${duration} minutes
Language: ${language}
Goal: ${goal}${ragSection}

Return a valid JSON object matching this schema:
{
  "title": "${topic}: Conceptual & Practical Mastery",
  "topic": "${topic}",
  "subject": "${subject}",
  "level": "${level}",
  "objectives": ["Understand ${topic} fundamentals", "Master governing equations and mechanisms", "Apply ${topic} to problem scenarios"],
  "sections": [
    {
      "title": "1. Foundations of ${topic}",
      "concept": "${topic} Core Principles",
      "explanation": "Clear in-depth explanation in ${language}",
      "speechScript": "Conversational, human-like teacher voice explanation in ${language}",
      "example": "Real-world analogy or practical example",
      "teachingStrategy": "analogy",
      "visualData": {
        "type": "diagram",
        "title": "${topic} - Core Mechanism",
        "elements": ["Input Conditions", "Governing Rule", "Output Response"]
      },
      "question": {
        "id": "q1",
        "concept": "${topic} Foundations",
        "question": "Multiple choice question testing understanding of ${topic}",
        "options": [
          { "id": "A", "text": "Correct Option", "correct": true },
          { "id": "B", "text": "Incorrect Option", "correct": false }
        ]
      }
    }
  ],
  "summary": "Summary of core takeaways in ${language}",
  "homework": ["Practice task 1", "Practice task 2"],
  "revisionPoints": ["Key formula or principle of ${topic}"]
}`;

    try {
      const rawData = await this.generateStructured(prompt, 'You are an elite curriculum designer and educator.');
      return validateLessonSchema(rawData, topic);
    } catch (e) {
      return this._generateDynamicJSONFallback(prompt, topic);
    }
  }

  async generateTeacherResponse(context) {
    const {
      studentProfile = {},
      lessonTitle = 'Concept Study',
      currentConcept = 'Core Principle',
      studentMessage = '',
      mode = 'normal',
      language = 'English',
      ragContext = null
    } = context;

    let modeInstruction = '';
    if (mode === 'simplify') {
      modeInstruction = 'Explain this concept much more simply, using an intuitive everyday analogy.';
    } else if (mode === 'example') {
      modeInstruction = 'Provide a concrete, step-by-step practical real-world example.';
    } else if (mode === 'analogy') {
      modeInstruction = 'Give an engaging, memorable metaphor/analogy to clear up any confusion.';
    } else if (mode === 'hindi' || language.toLowerCase().includes('hindi')) {
      modeInstruction = 'Explain in natural, warm Hindi/Hinglish with clear educational terminology.';
    } else if (mode === 'quiz') {
      modeInstruction = 'Ask an active recall multiple-choice question to test the student on this specific concept.';
    } else if (mode === 'deeper') {
      modeInstruction = 'Provide a deep mathematical or mechanistic derivation of this concept.';
    }

    let ragPrompt = '';
    if (ragContext && ragContext.hasContext) {
      ragPrompt = `\n\nReference Material Grounding:\n${ragContext.groundedContext}\nUse this verified material to provide an accurate answer.`;
    }

    const prompt = `Student asked in lesson "${lessonTitle}" on concept "${currentConcept}":
"${studentMessage}"

Student Level: ${studentProfile.level || 'High School'}
Preferred Language: ${language}
Teaching Mode: ${mode}
${modeInstruction}${ragPrompt}

Respond in structured JSON:
{
  "reply": "Warm, encouraging, human-like voice response under 4 sentences in ${language}",
  "language": "${language}",
  "concept": "${currentConcept}",
  "teachingStrategy": "${mode}",
  "visual": {
    "type": "diagram",
    "title": "${currentConcept} Visual Breakdown",
    "formula": null,
    "elements": ["Key Point 1", "Key Point 2"]
  },
  "followUpQuestion": null,
  "sources": []
}`;

    try {
      const response = await this.generateStructured(prompt, 'You are ARIA, an empathetic, brilliant AI educator.');
      if (response && response.reply) return response;
    } catch (e) {
      console.warn('[AIService] generateTeacherResponse fallback:', e.message);
    }

    return {
      reply: `Let's look closely at ${currentConcept}: every governing condition has a clear cause and effect. What specific part would you like to explore next?`,
      language: language || 'English',
      concept: currentConcept,
      teachingStrategy: mode || 'direct_explanation',
      visual: {
        type: 'diagram',
        title: `${currentConcept} - Core Mechanism`,
        elements: ['1. Input Condition', '2. Governing Law', '3. Output Response']
      },
      followUpQuestion: null,
      sources: []
    };
  }

  async generateQuestions(topic, count = 3, level = 'Intermediate') {
    return this.generateQuizQuestions({ topic, questionCount: count, difficulty: level });
  }

  async generateQuizQuestions(options = {}) {
    const {
      topic = 'Academic Subject',
      subject = 'General Studies',
      difficulty = 'medium',
      questionCount = 5,
      language = 'English',
      questionTypes = ['mcq', 'true_false', 'short_answer'],
      ragContext = null
    } = options;

    let ragSection = '';
    if (ragContext && ragContext.hasContext) {
      ragSection = `\n\nCOURSE REFERENCE MATERIAL:\n${ragContext.groundedContext}\n\nSTRICT INSTRUCTION: Ground questions strictly in the verified course material above. Avoid inventing non-existent details.`;
    }

    const prompt = `Generate ${questionCount} high-quality diagnostic quiz questions testing "${topic}" (${subject}).
Difficulty: ${difficulty}
Language: ${language}
Allowed Question Types: ${questionTypes.join(', ')}
${ragSection}

Rules:
- Questions must test deep conceptual understanding, causal reasoning, and problem-solving, not just rote memorization.
- For MCQ and True/False, only ONE clearly correct answer. Distractors must be plausible common misconceptions.
- For Short Answer questions, provide clear expectedAnswer and keyConceptPoints.
- Provide a clear, pedagogical explanation for every question.
- Tag each question with a specific sub-concept.

Return a valid JSON object matching:
{
  "title": "${topic} Mastery Quiz",
  "topic": "${topic}",
  "subject": "${subject}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text testing understanding in ${language}",
      "type": "mcq",
      "concept": "Specific Sub-Concept",
      "difficulty": "${difficulty}",
      "options": [
        { "id": "A", "text": "Correct option text", "correct": true },
        { "id": "B", "text": "Plausible distractor text", "correct": false },
        { "id": "C", "text": "Plausible distractor text", "correct": false },
        { "id": "D", "text": "Plausible distractor text", "correct": false }
      ],
      "correctAnswer": "A",
      "explanation": "Why the correct answer is right and why others are incorrect in ${language}"
    },
    {
      "id": "q2",
      "question": "True or false statement testing ${topic} in ${language}",
      "type": "true_false",
      "concept": "Boundary Conditions",
      "difficulty": "${difficulty}",
      "options": [
        { "id": "A", "text": "True", "correct": true },
        { "id": "B", "text": "False", "correct": false }
      ],
      "correctAnswer": "A",
      "explanation": "Explanation of the physical/logical truth value in ${language}"
    },
    {
      "id": "q3",
      "question": "Open-ended prompt asking student to explain or derive ${topic} mechanism in ${language}",
      "type": "short_answer",
      "concept": "Applied Mechanism",
      "difficulty": "${difficulty}",
      "expectedAnswer": "Concise standard model answer",
      "keyConceptPoints": ["Key Principle 1", "Key Principle 2"],
      "explanation": "Full model explanation"
    }
  ]
}`;

    try {
      const res = await this.generateStructured(prompt, 'You are an expert psychometric assessment designer and academic educator.');
      if (res && Array.isArray(res.questions) && res.questions.length > 0) {
        return res.questions.slice(0, questionCount);
      }
    } catch (err) {
      console.warn('[AIService] generateQuizQuestions remote failed:', err.message);
    }

    // Dynamic fallback for any topic
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
      const type = i % 3 === 1 ? 'mcq' : i % 3 === 2 ? 'true_false' : 'short_answer';
      if (type === 'mcq') {
        questions.push({
          id: `q${i}`,
          question: `In ${topic}, what is the direct consequence of increasing system constraints or friction under constant driving energy?`,
          type: 'mcq',
          concept: `${topic} - Dynamic Equilibrium`,
          difficulty,
          options: [
            { id: 'A', text: `Net throughput decreases proportionally to maintain balance.`, correct: true },
            { id: 'B', text: `Net throughput multiplies exponentially without limit.`, correct: false },
            { id: 'C', text: `System behaves completely randomly with no governing rule.`, correct: false },
            { id: 'D', text: `No change occurs regardless of constraint magnitude.`, correct: false }
          ],
          correctAnswer: 'A',
          explanation: `Opposition acts as a rate limiter; in ${topic}, increasing constraints always reduces throughput under constant driving potential.`
        });
      } else if (type === 'true_false') {
        questions.push({
          id: `q${i}`,
          question: `True or False: In ${topic}, conservation laws and boundary conditions dictate how variables adjust over time.`,
          type: 'true_false',
          concept: `${topic} - Conservation Laws`,
          difficulty,
          options: [
            { id: 'A', text: 'True', correct: true },
            { id: 'B', text: 'False', correct: false }
          ],
          correctAnswer: 'A',
          explanation: `Fundamental governing rules in ${topic} preserve system invariants under standard physical/computational constraints.`
        });
      } else {
        questions.push({
          id: `q${i}`,
          question: `Explain how the primary driving force in ${topic} interacts with system resistance to reach steady state.`,
          type: 'short_answer',
          concept: `${topic} - Steady State Analysis`,
          difficulty,
          expectedAnswer: `The driving force pushes the system forward while internal resistance opposes change until dynamic equilibrium is established.`,
          keyConceptPoints: ['Driving force initiation', 'Resistance moderation', 'Equilibrium state'],
          explanation: `Systems in ${topic} reach steady state when forward driving stimuli equal opposing friction/losses.`
        });
      }
    }
    return questions;
  }

  async evaluateOpenEndedAnswer({ question, studentAnswer, concept, expectedAnswer }) {
    const prompt = `Evaluate the student's answer to this open-ended academic question:
Question: "${question}"
Concept: "${concept}"
Expected Answer/Rubric: "${expectedAnswer || 'Clear understanding of core principles'}"
Student Answer: "${studentAnswer}"

Return a valid JSON object:
{
  "score": 0.85, // Float between 0.0 and 1.0
  "correct": true, // true if score >= 0.7
  "feedback": "Encouraging, precise pedagogical feedback in 2 sentences.",
  "missingConcepts": ["Any critical concept omitted, or empty array"],
  "misconception": null // string describing misconception if detected, else null
}`;

    try {
      const res = await this.generateStructured(prompt, 'You are an objective academic evaluator.');
      if (res && typeof res.score === 'number') {
        return {
          score: Math.min(1.0, Math.max(0.0, res.score)),
          correct: res.score >= 0.7,
          feedback: res.feedback || 'Good effort in addressing the core concept.',
          missingConcepts: Array.isArray(res.missingConcepts) ? res.missingConcepts : [],
          misconception: res.misconception || null
        };
      }
    } catch (err) {
      console.warn('[AIService] evaluateOpenEndedAnswer fallback:', err.message);
    }

    const cleanAns = (studentAnswer || '').toLowerCase();
    const hasLength = cleanAns.length > 15;
    return {
      score: hasLength ? 0.8 : 0.4,
      correct: hasLength,
      feedback: hasLength ? 'Good explanation! You correctly identified the core principle.' : 'Consider expanding your answer to include governing mechanisms.',
      missingConcepts: hasLength ? [] : ['Detailed mechanism explanation'],
      misconception: null
    };
  }

  async generateSummary(content, options = {}) {
    const prompt = `Summarize the following educational content into Key Concepts, Important Formulas/Definitions, and Exam Points:
${content.slice(0, 4000)}

Return JSON:
{
  "overview": "Summary overview paragraph",
  "keyConcepts": ["Concept 1", "Concept 2"],
  "definitions": [{ "term": "Term", "definition": "Definition" }],
  "formulas": ["Formula 1", "Formula 2"],
  "examPoints": ["Crucial Exam Point 1", "Crucial Exam Point 2"]
}`;

    return await this.generateStructured(prompt);
  }

  _generateDynamicTextFallback(prompt) {
    const topic = this._extractTopic(prompt);
    return `Let's break down ${topic}: every principle has a foundational relationship that determines how the system behaves under different conditions.`;
  }

  _generateDynamicJSONFallback(prompt, explicitTopic = null) {
    const topic = explicitTopic || this._extractTopic(prompt);
    return {
      title: `${topic}: Conceptual & Practical Mastery`,
      topic: topic,
      subject: 'Academic Foundations',
      level: 'All Levels',
      objectives: [
        `Understand the fundamental definition of ${topic}`,
        `Analyze governing mechanisms and relationships in ${topic}`,
        `Apply ${topic} principles to practical problem solving`
      ],
      sections: [
        {
          title: `1. Foundations of ${topic}`,
          concept: `${topic} Core Mechanism`,
          explanation: `In ${topic}, governing factors maintain equilibrium across inputs and system responses.`,
          speechScript: `Welcome to our session on ${topic}. Let's examine the foundational principles together on the blackboard.`,
          example: `Everyday example of ${topic} in real systems.`,
          teachingStrategy: 'analogy',
          visualData: {
            type: 'diagram',
            title: `${topic} - Foundational Structure`,
            elements: ['1. Initial State', '2. Transformation Process', '3. Final Equilibrium']
          },
          question: {
            id: 'q1',
            concept: `${topic} Foundations`,
            question: `When system constraints in ${topic} change, what happens to the output response?`,
            options: [
              { id: 'A', text: 'The system response adjusts in accordance with governing conservation laws.', correct: true },
              { id: 'B', text: 'The system fluctuates randomly without any governing rule.', correct: false }
            ]
          }
        },
        {
          title: `2. Applied Problem Solving in ${topic}`,
          concept: `${topic} Quantitative Rules`,
          explanation: `Applying the mathematical or mechanistic relationships of ${topic} to predict outcomes.`,
          speechScript: `Now let's apply our understanding of ${topic} to analyze real problems step by step.`,
          example: `Step-by-step calculation or mechanistic walkthrough for ${topic}.`,
          teachingStrategy: 'step_by_step',
          visualData: {
            type: 'flowchart',
            title: `${topic} Step-by-Step Analysis`,
            elements: ['Step 1: Identify Boundaries', 'Step 2: Apply Governing Rule', 'Step 3: Verify Output']
          },
          question: {
            id: 'q2',
            concept: `${topic} Problem Solving`,
            question: `Which factor is most critical when verifying predictions in ${topic}?`,
            options: [
              { id: 'A', text: 'Validating boundary conditions and input assumptions.', correct: true },
              { id: 'B', text: 'Ignoring opposing forces or constraints.', correct: false }
            ]
          }
        }
      ],
      summary: `Mastery overview and key takeaways for ${topic}.`,
      homework: [`Solve 2 practice problems on ${topic}`, `Review the visual blackboard derivations`],
      revisionPoints: [`Key rule of ${topic}`, `Constraint balancing mechanism`]
    };
  }

  _extractTopic(prompt) {
    const topicMatch = prompt.match(/Topic:\s*["']([^"'\n\r]+)["']/i) ||
      prompt.match(/topic:?\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/lesson (?:plan )?for:?\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/lesson on\s*["']?([^"\n\r,]+)["']?/i);
    if (topicMatch && topicMatch[1] && topicMatch[1].trim().length > 1) {
      const extracted = topicMatch[1].trim().replace(/^topic:\s*/i, '');
      if (extracted.length > 1) return extracted;
    }
    const cleaned = prompt.replace(/(student|asked|in|create|lesson|plan|interactive|expert|teacher|explain|quiz|questions|test|format|json|provide|warm|clear|pedagogically|sound|human|response|under|sentences)/gi, '').trim();
    const firstLine = cleaned.split('\n')[0].replace(/["':]/g, '').trim();
    return firstLine.length > 2 ? firstLine.slice(0, 45) : 'Academic Mastery Topic';
  }


  /**
   * Generates AI Flashcards from materials, weak concepts, or topic
   */
  async generateFlashcards({ topic = 'Core Concepts', subject = 'General', materialText = '', count = 5, difficulty = 'medium', weakConcepts = [] }) {
    const prompt = `
You are an expert AI tutor. Generate ${count} high-yield study flashcards for:
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
${weakConcepts.length > 0 ? `Target Weak Areas: ${weakConcepts.join(', ')}` : ''}
${materialText ? `Grounded Material Source:\n${materialText.slice(0, 3000)}` : ''}

For each flashcard, formulate:
1. "concept": Precise sub-concept name
2. "front": Engaging, clear prompt or challenge question (not just definition lookup)
3. "back": Concise, high-retention explanation, key formula or principle
4. "hints": Array with 1-2 helpful mnemonic or reasoning clues

Return ONLY a JSON array of objects:
[
  {
    "concept": "...",
    "front": "...",
    "back": "...",
    "hints": ["..."]
  }
]
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are an educational flashcard generator. Output JSON only.', true);
        const parsed = extractJSON(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        if (parsed?.flashcards && Array.isArray(parsed.flashcards)) return parsed.flashcards;
      }
    } catch (err) {
      console.warn(`[AIService] generateFlashcards remote fallback: ${err.message}`);
    }

    return [
      {
        concept: topic + ' Core Principle',
        front: `What is the foundational law/mechanism governing ${topic}?`,
        back: `The primary mechanism states that system behavior is determined by input constraints and energy/information conservation.`,
        hints: [`Recall the initial boundary conditions of ${topic}.`]
      },
      {
        concept: topic + ' Problem Solving',
        front: `How do you verify whether a solution in ${topic} is physically or logically valid?`,
        back: `Check boundary limits, dimensional consistency, and confirm conservation criteria.`,
        hints: [`Test edge cases where values approach zero or infinity.`]
      },
      {
        concept: topic + ' Common Misconception',
        front: `What mistake do students commonly make when applying ${topic}?`,
        back: `Confusing net overall effect with local instantaneous values or ignoring frame of reference.`,
        hints: [`Always define positive vs negative coordinate directions.`]
      }
    ];
  }

  /**
   * Generates a Personalized Study Plan prioritizing weak concepts
   */
  async generateStudyPlan({ goal, examDate, dailyMinutes = 45, weakConcepts = [], strongConcepts = [], subjects = ['Science', 'Math'], learningStyle = 'visual' }) {
    const prompt = `
You are an AI learning strategist. Create a personalized, adaptive study plan for:
Goal: "${goal || 'High Mastery & Exam Preparation'}"
Exam / Target Date: "${examDate || 'In 30 days'}"
Available Daily Study Time: ${dailyMinutes} minutes
Weak Concepts (HIGH PRIORITY): ${weakConcepts.length ? weakConcepts.join(', ') : 'Needs baseline reinforcement'}
Strong Concepts (Lower frequency revision): ${strongConcepts.length ? strongConcepts.join(', ') : 'None yet'}
Subjects: ${subjects.join(', ')}
Preferred Learning Style: ${learningStyle}

Plan Requirements:
- Prioritize weak concepts with more dedicated practice and teacher reviews
- Distribute varied activity types: "learn", "practice", "quiz", "revision", "video", "flashcards", "assessment"
- Schedule realistic daily task chunks fitting within the ${dailyMinutes} minutes limit
- Generate 7 distinct daily milestone tasks starting from today

Return JSON object:
{
  "title": "...",
  "summary": "...",
  "dailyMinutes": ${dailyMinutes},
  "tasks": [
    {
      "id": "t1",
      "dayOffset": 0,
      "subject": "...",
      "concept": "...",
      "activityType": "learn",
      "estimatedMinutes": 20,
      "priority": "high",
      "reason": "..."
    }
  ]
}
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are an expert study planner. Output JSON only.', true);
        const parsed = extractJSON(raw);
        if (parsed?.tasks && Array.isArray(parsed.tasks)) return parsed;
      }
    } catch (err) {
      console.warn(`[AIService] generateStudyPlan remote fallback: ${err.message}`);
    }

    const targetConcept = weakConcepts[0] || 'Core Mechanics';
    return {
      title: `Adaptive Roadmap for ${goal || 'Target Mastery'}`,
      summary: `Allocated focused time for ${targetConcept} with periodic spaced reviews.`,
      dailyMinutes,
      tasks: [
        {
          id: 't1',
          dayOffset: 0,
          subject: subjects[0] || 'Core',
          concept: targetConcept,
          activityType: 'learn',
          estimatedMinutes: Math.min(25, dailyMinutes),
          priority: 'high',
          reason: 'Address primary weak area with interactive AI teacher breakdown'
        },
        {
          id: 't2',
          dayOffset: 1,
          subject: subjects[0] || 'Core',
          concept: targetConcept,
          activityType: 'practice',
          estimatedMinutes: Math.min(20, dailyMinutes),
          priority: 'high',
          reason: 'Solve focused step-by-step practice problems'
        },
        {
          id: 't3',
          dayOffset: 2,
          subject: subjects[0] || 'Core',
          concept: weakConcepts[1] || 'Applied Systems',
          activityType: 'quiz',
          estimatedMinutes: 15,
          priority: 'medium',
          reason: 'Diagnostic quiz to evaluate retention'
        },
        {
          id: 't4',
          dayOffset: 3,
          subject: subjects[0] || 'Core',
          concept: targetConcept,
          activityType: 'revision',
          estimatedMinutes: 15,
          priority: 'medium',
          reason: 'SM-2 spaced repetition review'
        }
      ]
    };
  }

  /**
   * Generates Daily AI Challenge tailored to student gap
   */
  async generateDailyChallenge({ weakConcept, currentLevel = 'Intermediate', subject = 'Science', difficulty = 'medium' }) {
    const topic = weakConcept || 'Critical Reasoning & Problem Solving';
    const prompt = `
You are EduVerse AI. Generate a single, high-impact "Daily AI Challenge" question for:
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
Target: Challenge the student to think deeply about a nuanced scenario.

Return JSON:
{
  "topic": "${topic}",
  "subject": "${subject}",
  "difficulty": "${difficulty}",
  "type": "mcq",
  "question": "A concrete scenario or calculation asking the student to deduce the correct outcome...",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." },
    { "id": "D", "text": "..." }
  ],
  "correctAnswer": "A",
  "explanation": "Detailed explanation of why this choice is logically and scientifically sound.",
  "masteryXp": 50
}
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are a daily challenge creator. Return JSON only.', true);
        const parsed = extractJSON(raw);
        if (parsed?.question && parsed?.options) return parsed;
      }
    } catch (err) {
      console.warn(`[AIService] generateDailyChallenge remote fallback: ${err.message}`);
    }

    return {
      topic,
      subject,
      difficulty,
      type: 'mcq',
      question: `In ${topic}, when primary boundary parameters double while volume remains constant, how does net throughput respond?`,
      options: [
        { id: 'A', text: 'Increases quadratically according to governing rate rules.' },
        { id: 'B', text: 'Decreases linearly due to internal resistance.' },
        { id: 'C', text: 'Remains invariant because equilibrium is preserved.' },
        { id: 'D', text: 'Drops to zero immediately.' }
      ],
      correctAnswer: 'A',
      explanation: `Throughput scales quadratically in ${topic} under fixed volume constraints.`,
      masteryXp: 50
    };
  }

  /**
   * Generates Multi-Format Homework Assignment
   */
  async generateHomework({ topic, subject = 'General', difficulty = 'medium', questionCount = 4, types = ['mcq', 'short_answer', 'numerical', 'conceptual'] }) {
    const prompt = `
Generate a comprehensive homework assignment for:
Topic: "${topic}"
Subject: "${subject}"
Difficulty: "${difficulty}"
Question Count: ${questionCount}
Include formats from: ${types.join(', ')}

Return JSON:
{
  "title": "Homework: ${topic}",
  "instructions": "Answer all questions clearly. Partial credit is awarded for logical reasoning.",
  "questions": [
    {
      "id": "hw_1",
      "type": "mcq",
      "question": "...",
      "options": [
        { "id": "A", "text": "..." },
        { "id": "B", "text": "..." },
        { "id": "C", "text": "..." },
        { "id": "D", "text": "..." }
      ],
      "correctAnswer": "A",
      "rubric": "...",
      "points": 5
    },
    {
      "id": "hw_2",
      "type": "short_answer",
      "question": "...",
      "rubric": "...",
      "points": 10
    }
  ]
}
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are an educational assignment creator. Output JSON only.', true);
        const parsed = extractJSON(raw);
        if (parsed?.questions && Array.isArray(parsed.questions)) return parsed;
      }
    } catch (err) {
      console.warn(`[AIService] generateHomework remote fallback: ${err.message}`);
    }

    return {
      title: `Homework Assignment: ${topic}`,
      instructions: 'Complete all questions. Explain steps thoroughly for calculation and open response prompts.',
      questions: [
        {
          id: 'hw_1',
          type: 'mcq',
          question: `Which statement accurately reflects the fundamental premise of ${topic}?`,
          options: [
            { id: 'A', text: `Governing dynamics depend directly on initial system states.` },
            { id: 'B', text: `External factors have zero impact on system states.` },
            { id: 'C', text: `Conservation laws do not apply to ${topic}.` },
            { id: 'D', text: `All states decay instantaneously without resistance.` }
          ],
          correctAnswer: 'A',
          rubric: 'Must identify initial condition dependency.',
          points: 5
        },
        {
          id: 'hw_2',
          type: 'short_answer',
          question: `Explain how you would troubleshoot a calculation error when solving problems in ${topic}.`,
          rubric: 'Must state unit checking, sign convention inspection, and boundary validation.',
          points: 10
        }
      ]
    };
  }

  /**
   * Evaluates Student Homework Answer
   */
  async evaluateHomeworkAnswer({ question, type, studentAnswer, rubric = '', correctAnswer = '' }) {
    if (type === 'mcq') {
      const isCorrect = String(studentAnswer).trim().toUpperCase() === String(correctAnswer).trim().toUpperCase();
      return {
        score: isCorrect ? 1.0 : 0.0,
        correct: isCorrect,
        feedback: isCorrect ? 'Correct! Selected the optimal choice.' : `Incorrect. The correct choice is ${correctAnswer}.`,
        mistakeExplanation: isCorrect ? null : 'Choice did not align with governing criteria.'
      };
    }

    const prompt = `
You are an expert AI grader. Evaluate this student homework response:
Question: "${question}"
Expected Rubric / Criteria: "${rubric}"
Student Response: "${studentAnswer}"

Evaluate fairly, granting partial credit (0.0 to 1.0) for logical steps:
Return JSON:
{
  "score": 0.85,
  "correct": true,
  "feedback": "Encouraging, constructive feedback explaining strengths and areas for refinement...",
  "mistakeExplanation": "Clear explanation of any misconception or omission (or null if perfect)",
  "missingConcepts": ["..."]
}
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are an automated homework evaluator. Output JSON only.', true);
        const parsed = extractJSON(raw);
        if (typeof parsed?.score === 'number') return parsed;
      }
    } catch (err) {
      console.warn(`[AIService] evaluateHomeworkAnswer remote fallback: ${err.message}`);
    }

    const hasContent = studentAnswer && studentAnswer.trim().length > 15;
    return {
      score: hasContent ? 0.8 : 0.4,
      correct: hasContent,
      feedback: hasContent ? 'Good conceptual formulation. Keep showing intermediate derivation steps.' : 'Response needs more elaboration on underlying mechanisms.',
      mistakeExplanation: hasContent ? null : 'Missing step-by-step justification.',
      missingConcepts: []
    };
  }

  /**
   * Identifies Prerequisite and Related Concepts for Knowledge Graph
   */
  async extractConceptRelations({ topic, subject = 'General' }) {
    const prompt = `
Identify the knowledge graph relationships for the concept: "${topic}" (Subject: "${subject}").
Determine:
1. Prerequisites (concepts student must know before learning ${topic})
2. Related concepts (neighboring concepts)
3. Advanced versions (topics built directly on ${topic})

Return JSON array:
[
  {
    "concept": "${topic}",
    "relatedConcept": "...",
    "relationType": "prerequisite" | "related" | "advanced_version"
  }
]
`;

    try {
      if (this.apiKey && this.provider !== 'demo') {
        const raw = await this._callRemoteLLM(prompt, 'You are a knowledge graph builder. Output JSON only.', true);
        const parsed = extractJSON(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn(`[AIService] extractConceptRelations remote fallback: ${err.message}`);
    }

    return [
      { concept: topic, relatedConcept: `Foundations of ${subject}`, relationType: 'prerequisite' },
      { concept: topic, relatedConcept: `Applied ${topic} Analysis`, relationType: 'advanced_version' }
    ];
  }

}

module.exports = new AIService();