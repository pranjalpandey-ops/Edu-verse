const { User, StudentProfile, Lesson, LessonSession, LearningProgress, Misconception, LearningPath, Note, Material } = require('../models');

async function seedDemoData() {
  console.log('[DemoData] Seeding startup demo data for hackathon presentation...');
  
  // 1. User
  let user = await User.findOne({ email: 'pranjal@eduverse.ai' });
  if (!user) {
    user = await User.create({
      _id: 'user_pranjal_demo',
      name: 'Pranjal',
      email: 'pranjal@eduverse.ai',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      streak: 12,
      hoursLearned: 24.5,
      overallProgress: 78,
      todayGoalMins: 60,
      todayCompletedMins: 45
    });
  }

  // 2. Student Profile
  let profile = await StudentProfile.findOne({ userId: user._id });
  if (!profile) {
    await StudentProfile.create({
      userId: user._id,
      name: 'Pranjal',
      educationLevel: 'High School',
      knowledgeLevel: 'Intermediate',
      preferredLanguage: 'English',
      learningStyle: 'Visual & Interactive',
      goals: ['Master Grade 10-12 Physics', 'Score 95%+ in Board Exam', 'Build intuition for circuits'],
      streak: 12,
      totalLearningHours: 24.5,
      overallMastery: 78,
      weakAreas: [
        { concept: "Resistance", score: 60, reason: "Reversed inverse relationship with current" },
        { concept: "Ohm's Law", score: 50, reason: "Circuit resistance calculation confusion" }
      ],
      strongAreas: [
        { concept: "Current", score: 80 },
        { concept: "Voltage", score: 90 }
      ]
    });
  }

  // 3. Current Active Lesson
  let lesson = await Lesson.findOne({ title: { $regex: /Electricity/i } }) || await Lesson.findOne({});
  if (!lesson) {
    lesson = await Lesson.create({
      _id: 'lesson_physics_electricity',
      userId: user._id,
      title: "Physics: Electricity and Magnetism",
      topic: "Electricity",
      subject: "Physics",
      duration: 20,
      language: "English",
      difficulty: "Beginner",
      progress: 65,
      currentSectionIndex: 2,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
      objectives: [
        "Master Electric Current (I) and Charge Flow",
        "Understand Potential Difference & Voltage (V)",
        "Master Ohm's Law (V = IR) and Resistance (R)",
        "Solve Practical Circuit Problems"
      ],
      sections: [
        {
          sectionId: "sec_1",
          title: "Electric Current & Charge Flow",
          duration: 5,
          concepts: ["Electric Current", "Charge (Coulomb)", "Electron Drift"],
          explanationStyle: "visual",
          speechScript: "Welcome to EduVerse AI! Electric Current is the continuous flow of electric charges—specifically free electrons—moving through a conductor. Measured in Amperes (A), 1 Ampere equals 1 Coulomb of charge passing per second.",
          example: "A typical 60W desk lamp draws around 0.5 Amperes of current.",
          visualType: "circuit",
          visualData: {
            type: "circuit",
            title: "Electric Current Flow in Conductor",
            elements: ["Battery Source", "Current Meter (A)", "Electron Stream"]
          },
          question: {
            id: "q_1",
            type: "MCQ",
            question: "What actually flows inside a metallic wire to produce an electric current?",
            options: [
              { id: "A", text: "Free electrons", correct: true },
              { id: "B", text: "Protons in atomic nucleus", correct: false },
              { id: "C", text: "Neutrons", correct: false },
              { id: "D", text: "Static atoms", correct: false }
            ]
          }
        },
        {
          sectionId: "sec_2",
          title: "Voltage & Potential Difference",
          duration: 5,
          concepts: ["Voltage (V)", "Electric Potential Difference"],
          explanationStyle: "analogy",
          speechScript: "Voltage is the electrical pressure provided by a battery or power source that pushes electrons through the circuit. Without voltage, electrons move randomly with zero net flow.",
          example: "A household AA battery has 1.5 Volts of electrical pressure.",
          visualType: "diagram",
          visualData: {
            type: "analogy",
            title: "Voltage as Electrical Pressure",
            elements: ["Battery (+) and (-)", "Potential Difference", "Directional Drift"]
          },
          question: {
            id: "q_2",
            type: "MCQ",
            question: "What provides the push or electric potential difference that drives current?",
            options: [
              { id: "A", text: "Voltage / Battery source", correct: true },
              { id: "B", text: "Resistor", correct: false },
              { id: "C", text: "Air pressure", correct: false },
              { id: "D", text: "Insulation coating", correct: false }
            ]
          }
        },
        {
          sectionId: "sec_3",
          title: "Ohm's Law & Circuit Resistance",
          duration: 6,
          concepts: ["Resistance (R)", "Ohm's Law (V = IR)", "Inverse Relationship"],
          explanationStyle: "diagram",
          speechScript: "Let us examine Ohm's Law: V = I times R. The key principle is that Resistance OPPOSES current. If voltage stays constant and resistance increases, current must decrease.",
          example: "At 12V constant, a 2 Ohm resistor allows 6A. Increasing to 6 Ohms drops current to 2A.",
          visualType: "circuit",
          visualData: {
            type: "circuit",
            title: "OHM'S LAW: V = IR",
            formula: "V = I \times R",
            elements: [
              { label: "Voltage (V)", detail: "Potential Difference across battery" },
              { label: "Current (I)", detail: "Rate of electron flow (Amps)" },
              { label: "Resistance (R)", detail: "Opposition to flow (Ohms)" }
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
          title: "Practical Circuit Calculations",
          duration: 4,
          concepts: ["Circuit Math", "Power Formulation"],
          explanationStyle: "practice",
          speechScript: "Now let us apply Ohm's Law to calculate exact values in complex circuits.",
          example: "Given V = 24V, R = 8 Ohms, Current I = 24 / 8 = 3 Amperes.",
          visualType: "graph",
          visualData: {
            type: "graph",
            title: "I vs R at Constant 12V",
            points: [{ x: "1Ω", y: 12 }, { x: "2Ω", y: 6 }, { x: "4Ω", y: 3 }, { x: "6Ω", y: 2 }]
          },
          question: {
            id: "q_4",
            type: "MCQ",
            question: "A 24V supply is connected across an 8 Ohm resistor. What is the current?",
            options: [
              { id: "A", text: "3 Amperes", correct: true },
              { id: "B", text: "192 Amperes", correct: false },
              { id: "C", text: "0.33 Amperes", correct: false },
              { id: "D", text: "16 Amperes", correct: false }
            ]
          }
        }
      ]
    });
  }

  // 4. Learning Path
  let path = await LearningPath.findOne({ topic: 'Physics' });
  if (!path) {
    await LearningPath.create({
      userId: user._id,
      topic: "Physics & Engineering",
      nodes: [
        { id: "node_1", title: "Electrostatics & Charge", status: "completed", score: 95 },
        { id: "node_2", title: "Electric Current & Drift", status: "completed", score: 85 },
        { id: "node_3", title: "Voltage & Potential", status: "completed", score: 90 },
        { id: "node_4", title: "Ohm's Law & Circuits", status: "in_progress", score: 65 },
        { id: "node_5", title: "Kirchhoff's Laws", status: "locked", score: 0 },
        { id: "node_6", title: "Magnetic Fields & Induction", status: "locked", score: 0 },
        { id: "node_7", title: "Alternating Current (AC)", status: "locked", score: 0 },
        { id: "node_8", title: "Semiconductors & Diodes", status: "locked", score: 0 }
      ]
    });
  }

  // 5. Sample Material
  let mat = await Material.findOne({});
  if (!mat) {
    await Material.create({
      userId: user._id,
      filename: "Physics_Class_10.pdf",
      filePath: "uploads/Physics_Class_10.pdf",
      fileType: "PDF",
      fileSize: "4.2 MB",
      pages: 18,
      sections: ["Chapter 12: Electricity", "12.1 Electric Current and Circuit", "12.2 Electric Potential", "12.3 Circuit Diagram", "12.4 Ohm's Law"],
      status: "processed"
    });
  }

  console.log('[DemoData] Seeding finished successfully.');
}

module.exports = { seedDemoData };
