const { Material, DocumentChunk, Lesson } = require('../models');
const ragPipeline = require('../rag/ragPipeline');
const aiService = require('../services/aiService');

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    const metadata = {
      level: req.body.level || 'High School',
      knowledgeLevel: req.body.knowledgeLevel || 'Beginner',
      language: req.body.language || 'English'
    };

    const result = await ragPipeline.processDocument(
      req.file.path,
      req.file.originalname,
      userId,
      metadata
    );

    res.status(201).json({
      success: true,
      message: 'Document analyzed, chunked, and vector embeddings generated.',
      material: result
    });
  } catch (error) {
    console.error('[uploadMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const DEMO_MATERIALS = [
  {
    _id: 'mat_trigonometry_demo',
    userId: 'user_pranjal_demo',
    filename: 'Trigonometry_Master_Identities_and_Formulas.pdf',
    fileType: 'PDF',
    size: 245800,
    pageCount: 14,
    level: 'Class 11 & 12 / JEE',
    language: 'English',
    status: 'ready',
    textContent: `TRIGONOMETRY MASTER STUDY NOTES & IDENTITIES
1. Fundamental Definitions:
In a right-angled triangle: sin(θ) = Opposite/Hypotenuse, cos(θ) = Adjacent/Hypotenuse, tan(θ) = Opposite/Adjacent.
Reciprocal identities: cosec(θ) = 1/sin(θ), sec(θ) = 1/cos(θ), cot(θ) = 1/tan(θ).

2. Core Pythagorean Identities:
- sin²(θ) + cos²(θ) = 1
- 1 + tan²(θ) = sec²(θ)
- 1 + cot²(θ) = cosec²(θ)

3. Compound Angle Formulas:
- sin(A ± B) = sin(A)cos(B) ± cos(A)sin(B)
- cos(A ± B) = cos(A)cos(B) ∓ sin(A)sin(B)
- tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)

4. Double and Triple Angle Formulas:
- sin(2θ) = 2 sin(θ) cos(θ) = 2 tan(θ) / (1 + tan²(θ))
- cos(2θ) = cos²(θ) - sin²(θ) = 2cos²(θ) - 1 = 1 - 2sin²(θ)
- tan(2θ) = 2tan(θ) / (1 - tan²(θ))
- sin(3θ) = 3 sin(θ) - 4 sin³(θ)
- cos(3θ) = 4 cos³(θ) - 3 cos(θ)

5. Triangle Laws & Geometry:
- Law of Sines: a / sin(A) = b / sin(B) = c / sin(C) = 2R (where R is the circumradius).
- Law of Cosines: c² = a² + b² - 2ab cos(C), cos(C) = (a² + b² - c²) / (2ab).
- Area of Triangle = (1/2) a b sin(C) = abc / (4R) = r · s (where r is inradius, s is semiperimeter).

6. Inverse Trigonometric Functions:
- sin⁻¹(x) + cos⁻¹(x) = π/2 for x ∈ [-1, 1]
- tan⁻¹(x) + cot⁻¹(x) = π/2 for x ∈ ℝ
- tan⁻¹(x) + tan⁻¹(y) = tan⁻¹((x + y)/(1 - xy)) when xy < 1.`,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mat_chemistry_demo',
    userId: 'user_pranjal_demo',
    filename: 'Physical_and_Organic_Chemistry_Core_Notes.pdf',
    fileType: 'PDF',
    size: 312400,
    pageCount: 22,
    level: 'Class 12 / NEET / JEE',
    language: 'English',
    status: 'ready',
    textContent: `PHYSICAL & ORGANIC CHEMISTRY COMPREHENSIVE REVISION NOTES
1. Electrochemistry & Thermodynamics:
- Standard Cell Potential: E°cell = E°cathode - E°anode.
- Nernst Equation at 298 K: E_cell = E°cell - (0.0591 / n) * log10(Q).
- Gibbs Free Energy & Cell EMF: ΔG° = -n F E°cell = -2.303 R T log10(K_eq).
- Faraday's 1st Law of Electrolysis: m = Z * I * t = (M / nF) * I * t, where F = 96500 C/mol.
- Kohlrausch Law of Independent Migration: Λ°m = ν+ λ°+ + ν- λ°-.

2. Chemical Kinetics & Rate Laws:
- Rate of Reaction for aA + bB -> cC: Rate = -(1/a) d[A]/dt = k [A]^x [B]^y.
- Integrated First-Order Rate Equation: k = (2.303 / t) * log10([A]0 / [A]t), Half-life t1/2 = 0.693 / k.
- Arrhenius Equation: k = A * exp(-Ea / RT), log10(k2 / k1) = (Ea / 2.303 R) * ((T2 - T1) / (T1 * T2)).

3. Chemical Bonding & Organic Reaction Mechanisms:
- Hybridization and Geometry: sp (Linear 180°), sp² (Trigonal planar 120°), sp³ (Tetrahedral 109.5°), sp³d (Trigonal bipyramidal), sp³d² (Octahedral).
- SN1 Mechanism: Two-step substitution via carbocation intermediate; racemization occurs; rate = k[Substrate]; favored by 3° alkyl halides and polar protic solvents.
- SN2 Mechanism: One-step concerted substitution with simultaneous nucleophilic attack and leaving group departure; Walden inversion (100% stereochemical inversion); rate = k[Substrate][Nucleophile]; favored by 1° alkyl halides and polar aprotic solvents (e.g., DMSO, acetone).
- Markovnikov's Rule: In the electrophilic addition of HX to unsymmetrical alkenes, hydrogen attaches to the carbon with more hydrogen atoms; Peroxide Effect (Kharasch) causes Anti-Markovnikov addition exclusively for HBr via free radical intermediate.`,
    createdAt: new Date().toISOString()
  }
];

exports.getMaterials = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    let materials = await Material.find({ userId });
    
    // Auto-seed demo documents if missing
    if (!materials || materials.length < 2) {
      for (const demo of DEMO_MATERIALS) {
        const exists = materials ? materials.find(m => m._id === demo._id || m.filename === demo.filename) : null;
        if (!exists) {
          const created = await Material.create({
            ...demo,
            userId
          });
          // Also create initial DocumentChunk for RAG
          await DocumentChunk.create({
            materialId: created._id,
            chunkIndex: 0,
            content: demo.textContent,
            metadata: { filename: demo.filename, level: demo.level }
          });
          if (!materials) materials = [];
          materials.push(created);
        }
      }
    }
    
    res.json({ success: true, count: materials.length, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    const chunks = await DocumentChunk.find({ materialId: req.params.id });
    res.json({ success: true, material, chunkCount: chunks.length, chunks: chunks.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    await DocumentChunk.deleteOne({ materialId: req.params.id });
    res.json({ success: true, message: 'Material and vectorized chunks deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.askMaterial = async (req, res) => {
  try {
    const { question, language = 'English' } = req.body;
    const materialId = req.params.id;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const grounded = await ragPipeline.buildGroundedPrompt(question, materialId);
    const material = await Material.findById(materialId);
    const title = material ? material.filename : 'Document Material';

    const systemPrompt = `You are ARIA, an expert AI tutor answering questions strictly based on the student's uploaded study material.
Cite specific source snippets where applicable.
If the material does not cover the answer, state that clearly and provide a concise, accurate explanation.`;

    const prompt = `Student Question: "${question}"
Material Title: "${title}"
Language: ${language}
${grounded.groundedContext}

Provide a clear, pedagogical answer with key takeaways and citation notes:`;

    const answer = await aiService.generateText(prompt, systemPrompt);

    res.json({
      success: true,
      question,
      answer,
      sources: grounded.sources,
      hasContext: grounded.hasContext
    });
  } catch (error) {
    console.error('[askMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.summarizeMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const chunks = await DocumentChunk.find({ materialId });
    if (!chunks || chunks.length === 0) {
      return res.status(404).json({ success: false, message: 'No chunks found for this material' });
    }

    const fullText = chunks.map(c => c.content).join('\n\n');
    const summary = await aiService.generateSummary(fullText);

    res.json({
      success: true,
      materialId,
      summary
    });
  } catch (error) {
    console.error('[summarizeMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateLessonFromMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    const chunks = await DocumentChunk.find({ materialId });
    const fullText = chunks.slice(0, 5).map(c => c.content).join('\n\n');

    const topic = material.filename.replace(/\.[^/.]+$/, "");
    const ragContext = {
      hasContext: true,
      groundedContext: fullText
    };

    const lessonData = await aiService.generateLesson(topic, {
      subject: req.body.subject || 'Uploaded Material Study',
      level: material.level || req.body.level || 'High School',
      language: material.language || req.body.language || 'English',
      duration: req.body.duration || 20
    }, ragContext);

    const savedLesson = await Lesson.create({
      ...lessonData,
      userId,
      materialId,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Grounded lesson generated successfully from material.',
      lesson: savedLesson
    });
  } catch (error) {
    console.error('[generateLessonFromMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateFlashcardsFromMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    const chunks = await DocumentChunk.find({ materialId });
    const fullText = chunks.map(c => c.content).join('\n\n') || material.textContent || '';

    const topic = material.filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');

    const flashcardsData = await aiService.generateFlashcards({
      topic,
      subject: material.level || 'STEM Notes',
      materialText: fullText,
      count: 5
    });

    const savedCards = [];
    const { Flashcard } = require('../models');
    for (const item of flashcardsData) {
      const card = await Flashcard.create({
        userId: userId.toString(),
        subject: material.level || 'STEM Notes',
        concept: item.concept || topic,
        front: item.front,
        back: item.back,
        hints: item.hints || [],
        source: 'material',
        sourceId: materialId,
        difficulty: 'medium',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
        lastReviewedAt: null
      });
      savedCards.push(card);
    }

    res.status(201).json({
      success: true,
      count: savedCards.length,
      flashcards: savedCards
    });
  } catch (error) {
    console.error('[generateFlashcardsFromMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateQuizFromMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    const chunks = await DocumentChunk.find({ materialId });
    const fullText = chunks.map(c => c.content).join('\n\n') || material.textContent || '';

    const topic = material.filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');

    const questions = await aiService.generateQuizQuestions({
      topic,
      subject: material.level || 'STEM Notes',
      difficulty: 'medium',
      questionCount: 5,
      language: 'English',
      ragContext: { hasContext: true, groundedContext: fullText }
    });

    const { Quiz } = require('../models');
    const quiz = await Quiz.create({
      userId,
      title: `${topic} Document Quiz`,
      topic,
      subject: material.level || 'Grounded Notes',
      description: `Grounded adaptive quiz generated directly from ${material.filename}.`,
      sourceType: 'material',
      sourceId: materialId,
      difficulty: 'medium',
      questionCount: questions.length,
      timeLimit: questions.length * 60,
      language: 'English',
      questions,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        topic: quiz.topic,
        questionCount: quiz.questionCount,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type || 'mcq',
          concept: q.concept || topic,
          options: q.options ? q.options.map(opt => ({ id: opt.id, text: opt.text })) : undefined
        }))
      }
    });
  } catch (error) {
    console.error('[generateQuizFromMaterial]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
