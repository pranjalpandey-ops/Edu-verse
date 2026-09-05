const { Note } = require('../models');
const aiService = require('../services/aiService');

exports.generateNotes = async (req, res) => {
  try {
    const { topic = "Core Academic Principles" } = req.body;
    
    let summaryData = null;
    try {
      summaryData = await aiService.generateSummary(topic);
    } catch (e) {
      console.warn('[Notes] Fallback for:', topic);
    }

    const note = await Note.create({
      title: `${topic} - Master Study Notes`,
      topic,
      summary: summaryData?.overview || `Comprehensive summary and study notes covering ${topic}.`,
      formulas: summaryData?.formulas?.map(f => ({ name: typeof f === 'string' ? f : f.name, formula: typeof f === 'string' ? f : f.formula })) || [
        { name: "Governing Law", formula: "\\text{Output} = f(\\text{Input}, \\text{Constraints})" }
      ],
      keyPoints: summaryData?.keyConcepts || [
        `1. Fundamental conservation and governing rules of ${topic}.`,
        `2. Balancing driving forces against opposing constraints.`,
        `3. Real-world application and problem-solving strategies.`
      ],
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    let notes = await Note.find();
    if (!notes || notes.length === 0) {
      const defaultNote = await Note.create({
        title: "Introduction to Natural Sciences - Master Notes",
        topic: "Foundations of Science",
        summary: "Essential reference points and formulas for exam preparation.",
        formulas: [
          { name: "Conservation Principle", formula: "E_{total} = \\text{constant}", unit: "Joules (J)" }
        ],
        keyPoints: [
          "Energy can neither be created nor destroyed.",
          "Systems tend toward equilibrium unless acted upon by external forces."
        ]
      });
      notes = [defaultNote];
    }
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, note: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
