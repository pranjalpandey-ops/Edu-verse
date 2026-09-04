const { Material } = require('../models');
const ragPipeline = require('../rag/ragPipeline');

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = req.user ? req.user._id : 'user_pranjal_demo';
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
    const materials = await Material.find();
    res.json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
    res.json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
