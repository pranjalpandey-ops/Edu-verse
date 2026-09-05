const { Note } = require('../models');
const aiService = require('../services/aiService');

const SAMPLE_NOTES = [
  {
    title: "Wave Optics: Interference & Young's Double Slit Experiment",
    topic: "Wave Optics",
    subject: "Physics",
    summary: "Wave nature of light explaining coherent superposition, constructive and destructive interference fringes, and intensity distribution on screen.",
    formulas: [
      { name: "Fringe Width (β)", formula: "\\beta = \\frac{\\lambda D}{d}", unit: "Meters (m)" },
      { name: "Constructive Path Difference", formula: "\\Delta x = n \\lambda \\quad (n = 0, 1, 2...)", unit: "Meters (m)" },
      { name: "Destructive Path Difference", formula: "\\Delta x = (2n - 1) \\frac{\\lambda}{2}", unit: "Meters (m)" },
      { name: "Resultant Intensity", formula: "I = 4 I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right)", unit: "Watts/m²" }
    ],
    keyPoints: [
      "Coherent sources maintain a constant phase difference over time.",
      "Fringe width β is directly proportional to screen distance D and wavelength λ, but inversely proportional to slit separation d.",
      "If the entire apparatus is immersed in water (refractive index μ), fringe width decreases by a factor of μ."
    ]
  },
  {
    title: "Differential Calculus: Derivatives, Tangents & Extreme Values",
    topic: "Differential Calculus",
    subject: "Mathematics",
    summary: "Foundational calculus principles covering instantaneous rates of change, product and chain rules, and optimization using first and second derivatives.",
    formulas: [
      { name: "Derivative Definition", formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}", unit: "Dimensionless" },
      { name: "Chain Rule", formula: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}", unit: "Dimensionless" },
      { name: "Product Rule", formula: "\\frac{d}{dx}[u \\cdot v] = u'v + uv'", unit: "Dimensionless" },
      { name: "Second Derivative Test", formula: "f''(x) > 0 \\implies \\text{Local Minima}, \\quad f''(x) < 0 \\implies \\text{Local Maxima}", unit: "Curvature" }
    ],
    keyPoints: [
      "The first derivative represents the instantaneous rate of change and geometric slope of the tangent line.",
      "Critical points occur where f'(x) = 0 or where f'(x) is undefined.",
      "L'Hôpital's rule allows evaluating 0/0 and ∞/∞ indeterminate limits by differentiating numerator and denominator."
    ]
  },
  {
    title: "Electrochemistry: Electrode Potentials & Nernst Equation",
    topic: "Electrochemistry",
    subject: "Chemistry",
    summary: "Thermodynamics of galvanic and electrolytic cells, standard reduction potentials, and calculation of cell EMF under non-standard concentrations.",
    formulas: [
      { name: "Nernst Equation (298 K)", formula: "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q", unit: "Volts (V)" },
      { name: "Gibbs Free Energy & EMF", formula: "\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}", unit: "Joules (J)" },
      { name: "Standard Cell Potential", formula: "E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}", unit: "Volts (V)" },
      { name: "Faraday's Law of Electrolysis", formula: "m = Z \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n \\cdot F}", unit: "Grams (g)" }
    ],
    keyPoints: [
      "Electrons always flow spontaneously from anode (oxidation) to cathode (reduction) in galvanic cells.",
      "A positive E_cell indicates a thermodynamically spontaneous reaction (ΔG < 0).",
      "At equilibrium, E_cell = 0 and the reaction quotient Q equals the equilibrium constant K_eq."
    ]
  },
  {
    title: "Photosynthesis: Light Reactions, Z-Scheme & Calvin Cycle",
    topic: "Photosynthesis",
    subject: "Biology",
    summary: "Biochemical conversion of solar energy into chemical energy within thylakoid membranes and stromal enzymatic carbon fixation.",
    formulas: [
      { name: "Overall Photosynthetic Equation", formula: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} + h\\nu \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2", unit: "Biochemical Mass Balance" },
      { name: "Water Photolysis", formula: "2\\text{H}_2\\text{O} \\longrightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2", unit: "Thylakoid Lumen Reaction" },
      { name: "ATP Synthesis (Chemiosmosis)", formula: "\\text{ADP} + \\text{P}_i + \\text{H}^+_{\\text{gradient}} \\xrightarrow{\\text{ATP Synthase}} \\text{ATP}", unit: "Energy Carrier" }
    ],
    keyPoints: [
      "Light-dependent reactions in thylakoids produce ATP and NADPH while photolyzing water into oxygen.",
      "RuBisCO is the primary carboxylating enzyme in the Calvin cycle fixing atmospheric CO2 into 3-PGA.",
      "C4 plants utilize spatial separation (mesophyll and bundle sheath cells) to eliminate photorespiration."
    ]
  },
  {
    title: "Algorithms: Asymptotic Complexity & Graph Search (BFS / DFS)",
    topic: "Graph Algorithms",
    subject: "Computer Science",
    summary: "Graph representations, topological sort, shortest path dynamics, and Big-O time and space complexity bounds.",
    formulas: [
      { name: "BFS / DFS Time Complexity", formula: "T(V, E) = O(V + E)", unit: "Operations" },
      { name: "Dijkstra with Min-Heap", formula: "T(V, E) = O((V + E) \\log V)", unit: "Operations" },
      { name: "Master Theorem", formula: "T(n) = a T(n/b) + O(n^d) \\implies \\text{Compare } \\log_b a \\text{ with } d", unit: "Recurrence Relation" }
    ],
    keyPoints: [
      "BFS uses a FIFO queue and finds the shortest path in unweighted graphs.",
      "DFS uses recursion or a LIFO stack, ideal for cycle detection and topological sorting in DAGs.",
      "Adjacency lists use O(V + E) space, whereas adjacency matrices require O(V²) space."
    ]
  }
];

exports.generateNotes = async (req, res) => {
  try {
    const { topic = "Core Academic Principles", subject = "General" } = req.body;
    
    let summaryData = null;
    try {
      summaryData = await aiService.generateSummary(topic);
    } catch (e) {
      console.warn('[Notes] Fallback for:', topic);
    }

    const note = await Note.create({
      title: `${topic} - Master Study Notes`,
      topic,
      subject: subject || 'General',
      summary: summaryData?.overview || `Comprehensive summary and study notes covering foundational mechanisms, formulas, and key insights for ${topic}.`,
      formulas: summaryData?.formulas?.map(f => ({ 
        name: typeof f === 'string' ? f : f.name, 
        formula: typeof f === 'string' ? f : f.formula,
        unit: f.unit || 'Standard SI'
      })) || [
        { name: "Governing Law", formula: "\\text{Output} = f(\\text{Input}, \\text{Constraints})", unit: "SI Units" }
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
    if (!notes || notes.length < 3) {
      for (const sample of SAMPLE_NOTES) {
        const exists = notes ? notes.find(n => n.title === sample.title) : null;
        if (!exists) {
          const created = await Note.create(sample);
          if (!notes) notes = [];
          notes.push(created);
        }
      }
    }
    res.json({ success: true, count: notes.length, notes });
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

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
