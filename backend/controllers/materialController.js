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

exports.getMaterials = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : 'user_pranjal_demo';
    const materials = await Material.find({ userId });
    res.json({ success: true, materials });
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
