const { LearningPath } = require('../models');

exports.getLearningPath = async (req, res) => {
  try {
    const topic = req.params.topic || req.query.topic || 'Physics';
    let path = await LearningPath.findOne({ topic: { $regex: new RegExp(topic, 'i') } });
    
    if (!path) {
      path = {
        topic: "Physics & Electrical Engineering",
        nodes: [
          { id: "n1", title: "1. Electrostatics & Charge", status: "completed", score: 95, icon: "check" },
          { id: "n2", title: "2. Electric Current & Drift", status: "completed", score: 85, icon: "check" },
          { id: "n3", title: "3. Voltage & Potential", status: "completed", score: 90, icon: "check" },
          { id: "n4", title: "4. Ohm's Law & Resistance", status: "in_progress", score: 65, active: true },
          { id: "n5", title: "5. Kirchhoff's Laws", status: "locked", score: 0 },
          { id: "n6", title: "6. Magnetic Induction", status: "locked", score: 0 },
          { id: "n7", title: "7. Alternating Current (AC)", status: "locked", score: 0 },
          { id: "n8", title: "8. Semiconductor Physics", status: "locked", score: 0 }
        ]
      };
    }
    res.json({ success: true, learningPath: path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateLearningPath = async (req, res) => {
  try {
    const { topic = "Machine Learning" } = req.body;
    const newPath = await LearningPath.create({
      topic,
      nodes: [
        { id: "ml1", title: "1. Python Fundamentals", status: "completed", score: 92 },
        { id: "ml2", title: "2. Linear Algebra & Calculus", status: "completed", score: 88 },
        { id: "ml3", title: "3. Data Preprocessing", status: "in_progress", score: 70 },
        { id: "ml4", title: "4. Supervised Learning", status: "locked", score: 0 },
        { id: "ml5", title: "5. Unsupervised Learning", status: "locked", score: 0 },
        { id: "ml6", title: "6. Model Evaluation", status: "locked", score: 0 },
        { id: "ml7", title: "7. Neural Networks", status: "locked", score: 0 },
        { id: "ml8", title: "8. Transformers & LLMs", status: "locked", score: 0 }
      ]
    });
    res.status(201).json({ success: true, learningPath: newPath });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
