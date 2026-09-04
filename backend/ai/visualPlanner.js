class VisualPlanner {
  planVisual(topic, concept, sectionTitle = '') {
    const text = `${topic} ${concept} ${sectionTitle}`.toLowerCase();

    if (text.includes('ohm') || text.includes('circuit') || text.includes('current') || text.includes('electric') || text.includes('resistance')) {
      return {
        visualType: "circuit",
        title: "OHM'S LAW: V = IR",
        formula: "V = I \times R",
        explanation: "Circuit Diagram with Voltage source (V), Current flow (A), and Resistance (Ω)",
        elements: [
          { label: "Voltage (V)", detail: "Potential Difference across terminals" },
          { label: "Current (I)", detail: "Rate of flow of electric charges (Amperes)" },
          { label: "Resistance (R)", detail: "Opposition to current flow (Ohms)" }
        ]
      };
    }

    if (text.includes('math') || text.includes('equation') || text.includes('calculus') || text.includes('algebra')) {
      return {
        visualType: "equation",
        title: "Mathematical Formulation",
        formula: "f(x) = \int_{a}^{b} \psi(t) dt",
        explanation: "Step-by-step mathematical derivation"
      };
    }

    if (text.includes('biology') || text.includes('cell') || text.includes('heart') || text.includes('dna')) {
      return {
        visualType: "diagram",
        title: "Biological Structure & Function",
        elements: ["Membrane", "Nucleus", "Mitochondria (Energy Production)", "Ribosomes"]
      };
    }

    if (text.includes('data') || text.includes('growth') || text.includes('graph') || text.includes('history')) {
      return {
        visualType: "graph",
        title: "Concept Trend & Proportions",
        points: [{ x: "Step 1", y: 20 }, { x: "Step 2", y: 45 }, { x: "Step 3", y: 80 }, { x: "Step 4", y: 95 }]
      };
    }

    return {
      visualType: "flowchart",
      title: `${concept || topic} Breakdown`,
      elements: ["1. Foundation", "2. Core Mechanism", "3. Practical Application", "4. Mastery Check"]
    };
  }
}

module.exports = new VisualPlanner();
