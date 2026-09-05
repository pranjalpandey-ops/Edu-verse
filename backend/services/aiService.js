const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'gemini-1.5-pro';
    this.provider = process.env.AI_PROVIDER || (this.apiKey ? 'remote' : 'demo');
  }

  async generateJSON(prompt, systemInstruction = 'You are EduVerse AI, an expert adaptive teacher.') {
    if (this.apiKey && this.provider !== 'demo') {
      try {
        if (this.apiKey.startsWith('AIza') || this.apiKey.startsWith('AQ.') || process.env.AI_PROVIDER === 'gemini') {
          const modelName = this.model || 'gemini-3.6-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=` + this.apiKey;
          const res = await axios.post(url, {
            contents: [{ parts: [{ text: systemInstruction + '\n\nRespond ONLY with valid JSON with no markdown wrapping.\n\n' + prompt }] }]
          });
          const text = res.data.candidates[0].content.parts[0].text;
          const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleanJson);
        } else {
          const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction + ' Return valid JSON only.' },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
          }, {
            headers: { Authorization: 'Bearer ' + this.apiKey }
          });
          return JSON.parse(res.data.choices[0].message.content);
        }
      } catch (err) {
        console.warn('[AIService] Remote LLM error (' + err.message + '). Using dynamic pedagogical generator.');
      }
    }

    return this._generateDynamicTopicResponse(prompt);
  }

  async generateText(prompt, systemInstruction = 'You are ARIA, a human-like AI Educator.') {
    if (this.apiKey && this.provider !== 'demo') {
      try {
        if (this.apiKey.startsWith('AIza') || this.apiKey.startsWith('AQ.') || process.env.AI_PROVIDER === 'gemini') {
          const modelName = this.model || 'gemini-3.6-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=` + this.apiKey;
          const res = await axios.post(url, {
            contents: [{ parts: [{ text: systemInstruction + '\n\n' + prompt }] }]
          });
          return res.data.candidates[0].content.parts[0].text.trim();
        } else {
          const res = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt }
            ]
          }, {
            headers: { Authorization: 'Bearer ' + this.apiKey }
          });
          return res.data.choices[0].message.content.trim();
        }
      } catch (err) {
        console.warn('[AIService] Remote LLM error (' + err.message + '). Generating dynamic conversational response.');
      }
    }

    return this._generateDynamicTeacherSpeech(prompt);
  }

  _extractTopic(prompt) {
    const topicMatch = prompt.match(/lesson on\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/Topic:\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/topic\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/about\s*["']?([^"\n\r,]+)["']?/i) ||
      prompt.match(/for\s*["']?([^"\n\r,]+)["']?/i);
    if (topicMatch && topicMatch[1] && topicMatch[1].trim().length > 1) {
      return topicMatch[1].trim().replace(/[^\w\s\-:.]/g, '');
    }
    const cleaned = prompt.replace(/(student|asked|in|create|lesson|plan|interactive|expert|teacher|explain|quiz|questions|test|format|json|provide|warm|clear|pedagogically|sound|human|response|under|sentences)/gi, '').trim();
    const firstLine = cleaned.split('\n')[0].replace(/["':]/g, '').trim();
    return firstLine.length > 2 ? firstLine.slice(0, 40) : 'Universal Science & Computing';
  }

  _generateDynamicTopicResponse(prompt) {
    const topic = this._extractTopic(prompt);
    const lowerTopic = topic.toLowerCase();

    // Determine domain
    let domain = 'general';
    if (lowerTopic.includes('photo') || lowerTopic.includes('cell') || lowerTopic.includes('dna') || lowerTopic.includes('bio') || lowerTopic.includes('gene') || lowerTopic.includes('organ') || lowerTopic.includes('heart') || lowerTopic.includes('brain')) {
      domain = 'biology';
    } else if (lowerTopic.includes('binary') || lowerTopic.includes('search') || lowerTopic.includes('sort') || lowerTopic.includes('tree') || lowerTopic.includes('graph') || lowerTopic.includes('algorithm') || lowerTopic.includes('code') || lowerTopic.includes('python') || lowerTopic.includes('data structure') || lowerTopic.includes('react') || lowerTopic.includes('javascript')) {
      domain = 'computerscience';
    } else if (lowerTopic.includes('math') || lowerTopic.includes('calculus') || lowerTopic.includes('derivative') || lowerTopic.includes('integral') || lowerTopic.includes('algebra') || lowerTopic.includes('matrix') || lowerTopic.includes('vector') || lowerTopic.includes('geometry') || lowerTopic.includes('trigonometry')) {
      domain = 'mathematics';
    } else if (lowerTopic.includes('gravity') || lowerTopic.includes('quantum') || lowerTopic.includes('thermodynamics') || lowerTopic.includes('newton') || lowerTopic.includes('force') || lowerTopic.includes('optics') || lowerTopic.includes('wave') || lowerTopic.includes('relativity') || lowerTopic.includes('circuit') || lowerTopic.includes('electric') || lowerTopic.includes('ohm') || lowerTopic.includes('physics')) {
      domain = 'physics';
    } else if (lowerTopic.includes('history') || lowerTopic.includes('war') || lowerTopic.includes('revolution') || lowerTopic.includes('civil') || lowerTopic.includes('empire') || lowerTopic.includes('ancient') || lowerTopic.includes('republic')) {
      domain = 'history';
    } else if (lowerTopic.includes('chem') || lowerTopic.includes('reaction') || lowerTopic.includes('atom') || lowerTopic.includes('periodic') || lowerTopic.includes('bond') || lowerTopic.includes('acid') || lowerTopic.includes('organic')) {
      domain = 'chemistry';
    }

    const title = topic.charAt(0).toUpperCase() + topic.slice(1);

    // Dynamic section generation based on topic
    return {
      title: `Mastering ${title}: Core Principles & Mastery`,
      topic: title,
      domain: domain,
      duration: 20,
      language: "English",
      objectives: [
        `Understand the foundational principles of ${title}`,
        `Explore the underlying mechanisms and real-world interactions of ${title}`,
        `Analyze key equations, models, and structural logic of ${title}`,
        `Solve practical, multi-step problem scenarios on ${title}`
      ],
      sections: [
        {
          sectionId: "sec_1",
          title: `Foundations of ${title}`,
          duration: 5,
          concepts: [`Introduction to ${title}`, "Fundamental Definitions", "First Principles"],
          explanationStyle: "visual",
          speechScript: `Welcome to this exploration of ${title}. At its core, ${title} is governed by foundational building blocks that dictate how components interact and behave. Understanding these core definitions gives you the mental model to master advanced applications.`,
          example: `Consider how ${title} manifests in everyday systems and modern technology, where every complex outcome stems from simple initial rules.`,
          visualType: domain === 'physics' ? 'circuit' : domain === 'mathematics' ? 'equation' : domain === 'biology' ? 'diagram' : domain === 'computerscience' ? 'flowchart' : 'diagram',
          visualData: {
            type: domain === 'mathematics' ? 'equation' : 'diagram',
            title: `Structural Model of ${title}`,
            formula: domain === 'mathematics' ? '\\sum_{i=1}^n f(x_i) = \\Delta \\Phi' : domain === 'physics' ? 'F = m \\cdot a' : undefined,
            elements: [`Core Input: ${title}`, "Transformative Mechanism", "Measured Output / Effect"]
          },
          question: {
            id: "q_1",
            type: "MCQ",
            concept: `Foundations of ${title}`,
            question: `Which fundamental principle directly defines the core behavior of ${title}?`,
            options: [
              { id: "A", text: `The systematic interaction between inputs, transformations, and governed rules of ${title}.`, correct: true },
              { id: "B", text: `A completely random and unpredictable reaction with no physical or mathematical constraints.`, correct: false },
              { id: "C", text: `An isolated event that cannot be measured or observed.`, correct: false },
              { id: "D", text: `A static property that never influences surrounding variables.`, correct: false }
            ],
            explanation: `The foundational rule of ${title} guarantees consistent, predictable outcomes based on defined inputs and governing laws.`
          }
        },
        {
          sectionId: "sec_2",
          title: `Mechanisms & Key Relationships in ${title}`,
          duration: 5,
          concepts: ["Variable Dynamics", "Direct & Inverse Relations", "Dynamic Balance"],
          explanationStyle: "analogy",
          speechScript: `Now let us examine how changing one factor in ${title} affects the whole system. When one key variable increases, the responding parameter adapts according to governing laws. Let us break this down with an intuitive analogy.`,
          example: `Think of a balanced system: if you amplify the driving force while maintaining system constraints, the total throughput shifts proportionally.`,
          visualType: "analogy",
          visualData: {
            type: "analogy",
            title: `${title} Dynamic Balance Model`,
            elements: ["Driving Force / Stimulus", "Constraint / Resistance", "Equilibrium Response"]
          },
          question: {
            id: "q_2",
            type: "MCQ",
            concept: `Dynamic Dynamics in ${title}`,
            question: `In the context of ${title}, if the primary constraint or opposition increases while the driving force remains constant, what happens to the net throughput?`,
            options: [
              { id: "A", text: `It decreases, because higher resistance or constraints restrict net flow.`, correct: true },
              { id: "B", text: `It increases exponentially without any additional energy.`, correct: false },
              { id: "C", text: `It remains identical regardless of opposing constraints.`, correct: false },
              { id: "D", text: `It reverses direction instantly.`, correct: false }
            ],
            explanation: `Opposition and resistance inherently reduce flow when driving potential remains fixed.`
          }
        },
        {
          sectionId: "sec_3",
          title: `Formulas, Logic & Deep Analysis of ${title}`,
          duration: 6,
          concepts: ["Mathematical Modeling", "Core Theorem / Law", "Algorithmic Precision"],
          explanationStyle: "diagram",
          speechScript: `Here is the analytical framework that formalizes ${title}. Notice how each component represents an observable quantity. Precision here allows scientists and engineers to predict results with 100% accuracy.`,
          example: `By substituting exact empirical values into our model for ${title}, we can compute the ideal operating parameters.`,
          visualType: domain === 'mathematics' ? 'equation' : domain === 'computerscience' ? 'flowchart' : 'graph',
          visualData: {
            type: domain === 'computerscience' ? 'flowchart' : 'graph',
            title: `${title} Analytical Behavior`,
            points: [{ x: "State 1", y: 15 }, { x: "State 2", y: 40 }, { x: "State 3", y: 75 }, { x: "State 4", y: 98 }],
            elements: domain === 'computerscience' ? ["Input Data", "Process Step", "Condition Branch", "Optimized Result"] : undefined
          },
          question: {
            id: "q_3",
            type: "MCQ",
            concept: `Analytical Modeling of ${title}`,
            question: `How does deep analytical modeling help us master ${title}?`,
            options: [
              { id: "A", text: `It allows exact prediction and optimization of system performance.`, correct: true },
              { id: "B", text: `It eliminates the need for foundational observations.`, correct: false },
              { id: "C", text: `It makes the subject purely theoretical with no practical value.`, correct: false },
              { id: "D", text: `It is only applicable in laboratory conditions.`, correct: false }
            ],
            explanation: `Formal models enable predictive analysis and real-world system optimization.`
          }
        },
        {
          sectionId: "sec_4",
          title: `Real-World Application & Problem Solving`,
          duration: 4,
          concepts: ["Engineering Practice", "Edge Cases", "Mastery Synthesis"],
          explanationStyle: "practice",
          speechScript: `Let us apply everything we have learned about ${title} to a real-world problem. Synthesizing concepts into solutions is where true mastery happens!`,
          example: `In cutting-edge industrial systems, ${title} is utilized to streamline operations, maximize energy efficiency, and build resilient structures.`,
          visualType: "flowchart",
          visualData: {
            type: "flowchart",
            title: `Engineering Pipeline for ${title}`,
            elements: ["Problem Statement", "Parameter Isolation", "Equation / Rule Application", "Validated Solution"]
          },
          question: {
            id: "q_4",
            type: "MCQ",
            concept: `Application of ${title}`,
            question: `When deploying solutions based on ${title} in practical environments, what is the most critical first step?`,
            options: [
              { id: "A", text: `Accurately isolating parameters and defining governing constraints.`, correct: true },
              { id: "B", text: `Guessing the final outcome before gathering data.`, correct: false },
              { id: "C", text: `Ignoring edge cases and external factors.`, correct: false },
              { id: "D", text: `Relying solely on intuition without validation.`, correct: false }
            ],
            explanation: `Parameter isolation and constraint definition ensure accurate, safe, and reproducible results.`
          }
        }
      ]
    };
  }

  _generateDynamicTeacherSpeech(prompt) {
    const topic = this._extractTopic(prompt);
    return `That is an insightful question about ${topic}. Let us look at the underlying logic: when you examine ${topic} through first principles, each step naturally builds upon the last. Would you like me to illustrate this with a visual diagram or test your understanding with a quick checkpoint?`;
  }
}

module.exports = new AIService();