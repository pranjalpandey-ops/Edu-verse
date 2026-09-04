const { Assessment } = require('../models');

exports.generateAssessment = async (req, res) => {
  try {
    const { lessonId, topic = 'Physics: Electricity and Magnetism' } = req.body;
    
    const assessment = await Assessment.create({
      title: `${topic} End-of-Module Assessment`,
      topic,
      lessonId,
      totalQuestions: 5,
      questions: [
        {
          id: "q1",
          concept: "Current",
          question: "What is the SI unit of Electric Current?",
          options: [
            { id: "A", text: "Ampere (A)", correct: true },
            { id: "B", text: "Volt (V)", correct: false },
            { id: "C", text: "Ohm (Ω)", correct: false },
            { id: "D", text: "Joule (J)", correct: false }
          ]
        },
        {
          id: "q2",
          concept: "Voltage",
          question: "Which component maintains potential difference across a circuit?",
          options: [
            { id: "A", text: "Battery / Electric Cell", correct: true },
            { id: "B", text: "Resistor", correct: false },
            { id: "C", text: "Connecting wire", correct: false },
            { id: "D", text: "Switch", correct: false }
          ]
        },
        {
          id: "q3",
          concept: "Resistance",
          question: "If the length of a uniform wire is doubled, what happens to its resistance?",
          options: [
            { id: "A", text: "Resistance doubles (R proportional to L)", correct: true },
            { id: "B", text: "Resistance is halved", correct: false },
            { id: "C", text: "Resistance becomes 4 times", correct: false },
            { id: "D", text: "Resistance remains constant", correct: false }
          ]
        },
        {
          id: "q4",
          concept: "Ohm's Law",
          question: "According to Ohm's Law (V = IR), if Voltage is 12V and Resistance is 4Ω, what is the Current?",
          options: [
            { id: "A", text: "3 Amperes", correct: true },
            { id: "B", text: "48 Amperes", correct: false },
            { id: "C", text: "0.33 Amperes", correct: false },
            { id: "D", text: "16 Amperes", correct: false }
          ]
        },
        {
          id: "q5",
          concept: "Ohm's Law",
          question: "For a fixed voltage supply, increasing circuit resistance causes current to:",
          options: [
            { id: "A", text: "Decrease inversely", correct: true },
            { id: "B", text: "Increase directly", correct: false },
            { id: "C", text: "Remain constant", correct: false },
            { id: "D", text: "Double immediately", correct: false }
          ]
        }
      ]
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAssessment = async (req, res) => {
  try {
    const report = {
      assessmentId: req.params.id,
      topic: "Physics: Electricity and Magnetism",
      overallScore: 82,
      conceptMastery: [
        { concept: "Current", score: 80, status: "strong" },
        { concept: "Voltage", score: 90, status: "strong" },
        { concept: "Resistance", score: 60, status: "weak" },
        { concept: "Ohm's Law", score: 50, status: "weak" }
      ],
      strongAreas: [
        { name: "Current", icon: "zap", description: "Excellent grasp of electron charge flow and unit definitions." },
        { name: "Voltage", icon: "activity", description: "Consistently accurate in identifying potential difference mechanisms." }
      ],
      weakAreas: [
        { name: "Resistance", icon: "alert-triangle", description: "Tendency to invert resistance effects during parameter changes." },
        { name: "Ohm's Law", icon: "alert-triangle", description: "Needs practice applying V=IR under varying constraints." }
      ],
      aiFeedback: "You understand the fundamentals of Current and Voltage exceptionally well. Your test scores in these areas are consistently above 85%. However, there is a clear disconnect when applying these concepts together to understand Resistance and Ohm's Law. Let's focus on bridging that gap.",
      recommendations: [
        {
          title: "Review Ohm's Law",
          duration: "15 mins",
          type: "interactive_lesson",
          description: "Interactive module on the V=IR relationship."
        },
        {
          title: "Practice 3 Problems",
          duration: "10 mins",
          type: "practice_problems",
          description: "Targeted exercises on circuit resistance calculation."
        }
      ]
    };

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = {
      topic: "Physics: Electricity and Magnetism",
      overallScore: 82,
      conceptMastery: [
        { concept: "Current", score: 80 },
        { concept: "Voltage", score: 90 },
        { concept: "Resistance", score: 60 },
        { concept: "Ohm's Law", score: 50 }
      ],
      strongAreas: ["Current", "Voltage"],
      weakAreas: ["Resistance", "Ohm's Law"],
      aiFeedback: "You understand the fundamentals of Current and Voltage exceptionally well. Your test scores in these areas are consistently above 85%. However, there is a clear disconnect when applying these concepts together to understand Resistance and Ohm's Law. Let's focus on bridging that gap.",
      recommendations: [
        { title: "Review Ohm's Law", duration: "15 mins", description: "Interactive module on the V=IR relationship." },
        { title: "Practice 3 Problems", duration: "10 mins", description: "Targeted exercises on circuit resistance calculation." }
      ]
    };
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
