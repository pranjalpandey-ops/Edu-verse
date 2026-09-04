const { Note } = require('../models');

exports.generateNotes = async (req, res) => {
  try {
    const { topic = "Physics: Electricity & Ohm's Law" } = req.body;
    const note = await Note.create({
      title: `${topic} - Master Summary`,
      topic,
      summary: "Comprehensive key concepts covering charge flow, potential difference, and Ohm's Law.",
      formulas: [
        { name: "Current Definition", formula: "I = Q / t", unit: "Amperes (A)" },
        { name: "Ohm's Law", formula: "V = I \times R", unit: "Volts (V)" },
        { name: "Resistance Formula", formula: "R = \rho \frac{L}{A}", unit: "Ohms (Ω)" },
        { name: "Electrical Power", formula: "P = V \times I = I^2 R = \frac{V^2}{R}", unit: "Watts (W)" }
      ],
      keyPoints: [
        "Current is inversely proportional to resistance for a fixed voltage.",
        "Voltage is the driving pressure (potential difference) in the circuit.",
        "Water-pipe analogy: Squeezing a pipe tighter (more R) reduces water flow rate (I)."
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
        title: "Physics: Electricity & Ohm's Law - Master Notes",
        topic: "Physics: Electricity",
        summary: "Essential reference points for exam preparation.",
        formulas: [
          { name: "Ohm's Law", formula: "V = I * R", unit: "Volts (V)" },
          { name: "Electric Current", formula: "I = Q / t", unit: "Amperes (A)" }
        ],
        keyPoints: [
          "Ohm's Law applies to metallic conductors at constant temperature.",
          "Remember: Higher resistance = Lower current when Voltage is constant!"
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
