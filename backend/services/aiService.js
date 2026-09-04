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
        if (this.apiKey.startsWith('AIza') || process.env.AI_PROVIDER === 'gemini') {
          const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + this.apiKey;
          const res = await axios.post(url, {
            contents: [{ parts: [{ text: systemInstruction + '\n\nRespond ONLY with valid JSON.\n\n' + prompt }] }]
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
        console.warn('[AIService] Remote LLM failed (' + err.message + '). Using pedagogical fallback generator.');
      }
    }

    return this._generatePedagogicalFallback(prompt);
  }

  async generateText(prompt, systemInstruction = 'You are ARIA, a human-like AI Educator.') {
    return 'Let us explore this concept step-by-step. In circuits, voltage pushes charges forward, while resistance opposes that flow.';
  }

  _generatePedagogicalFallback(prompt) {
    return {
      title: "Mastering Electricity: From Atoms to Circuits",
      duration: 20,
      language: "English",
      objectives: [
        "Understand Electric Current (I) and Charge Flow",
        "Master Voltage (V) as Potential Difference",
        "Apply Ohm's Law (V = IR) and Resistance",
        "Solve Real-World Circuit Scenarios"
      ],
      sections: [
        {
          sectionId: "sec_1",
          title: "Electric Current & Charge Flow",
          duration: 5,
          concepts: ["Electric Current", "Charge", "Electron Drift"],
          explanationStyle: "visual",
          speechScript: "Welcome! Electric Current is the continuous flow of free electrons passing through a wire. Measured in Amperes (A), 1 Ampere equals 1 Coulomb of charge per second.",
          example: "A light bulb drawing 0.5 Amperes has over 3 billion billion electrons moving through it every second!",
          visualType: "circuit",
          visualData: {
            type: "circuit",
            title: "Electric Current Flow in Conductor",
            elements: ["Battery Source", "Current Meter (A)", "Electron Stream"]
          },
          question: {
            id: "q_1",
            type: "MCQ",
            question: "What actually flows inside a metallic conductor to produce electric current?",
            options: [
              { id: "A", text: "Free electrons", correct: true },
              { id: "B", text: "Protons in the nucleus", correct: false },
              { id: "C", text: "Neutral neutrons", correct: false },
              { id: "D", text: "Stationary atoms", correct: false }
            ]
          }
        },
        {
          sectionId: "sec_2",
          title: "Voltage & Potential Difference",
          duration: 5,
          concepts: ["Voltage", "Potential Difference"],
          explanationStyle: "analogy",
          speechScript: "Voltage is the electrical push from a battery that drives electrons through a circuit. Think of voltage like water pressure from a pump.",
          example: "A typical AA battery creates 1.5 Volts of electrical pressure.",
          visualType: "diagram",
          visualData: {
            type: "analogy",
            title: "Voltage as Electrical Pressure",
            elements: ["Battery (+/-)", "Potential Difference", "Charge Drift"]
          },
          question: {
            id: "q_2",
            type: "MCQ",
            question: "What provides the push or potential difference in a circuit?",
            options: [
              { id: "A", text: "Voltage / Battery Source", correct: true },
              { id: "B", text: "Resistor", correct: false },
              { id: "C", text: "Plastic insulation", correct: false },
              { id: "D", text: "Air resistance", correct: false }
            ]
          }
        },
        {
          sectionId: "sec_3",
          title: "Ohm's Law & Circuit Resistance",
          duration: 6,
          concepts: ["Resistance (R)", "Ohm's Law (V = IR)", "Inverse Relationship"],
          explanationStyle: "diagram",
          speechScript: "Here is the master equation: V = I times R. Notice that Resistance OPPOSES current. For a constant voltage, higher resistance means LESS current!",
          example: "At 12V, a 2 Ohm resistor permits 6A of current. If resistance increases to 6 Ohms, current drops to 2A.",
          visualType: "circuit",
          visualData: {
            type: "circuit",
            title: "OHM'S LAW: V = IR",
            formula: "V = I \\times R",
            elements: [
              { label: "Voltage (V)", detail: "Potential Difference across battery" },
              { label: "Current (I)", detail: "Rate of charge flow (Amps)" },
              { label: "Resistance (R)", detail: "Opposition to current (Ohms)" }
            ]
          },
          question: {
            id: "q_3",
            type: "MCQ",
            question: "If voltage remains constant and resistance increases, what happens to current?",
            options: [
              { id: "A", text: "It increases proportionally.", correct: false },
              { id: "B", text: "It decreases.", correct: true },
              { id: "C", text: "It remains the same.", correct: false },
              { id: "D", text: "It fluctuates unpredictably.", correct: false }
            ]
          }
        },
        {
          sectionId: "sec_4",
          title: "Circuit Problem Solving",
          duration: 4,
          concepts: ["Circuit Math", "Power Formulation"],
          explanationStyle: "practice",
          speechScript: "Let us apply Ohm's Law to calculate exact values in circuits.",
          example: "Given V = 24V and R = 8 Ohms, Current I = 24 / 8 = 3 Amperes.",
          visualType: "graph",
          visualData: {
            type: "graph",
            title: "Current vs Resistance at 12V",
            points: [{ x: "1Ω", y: 12 }, { x: "2Ω", y: 6 }, { x: "4Ω", y: 3 }, { x: "6Ω", y: 2 }]
          },
          question: {
            id: "q_4",
            type: "MCQ",
            question: "A 24V battery is connected across an 8 Ohm resistor. What current flows?",
            options: [
              { id: "A", text: "3 Amperes", correct: true },
              { id: "B", text: "192 Amperes", correct: false },
              { id: "C", text: "0.33 Amperes", correct: false },
              { id: "D", text: "16 Amperes", correct: false }
            ]
          }
        }
      ]
    };
  }
}

module.exports = new AIService();