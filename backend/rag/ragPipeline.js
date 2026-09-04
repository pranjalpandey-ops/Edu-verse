const { extractText } = require('./extractText');
const { chunkText } = require('./chunkText');
const vectorStore = require('./vectorStore');
const { Material } = require('../models');

class RAGPipeline {
  async processDocument(filePath, originalFilename, userId, metadata = {}) {
    console.log(`[RAGPipeline] Processing document: ${originalFilename}`);
    
    // 1. Extract Text
    const extracted = await extractText(filePath, originalFilename);

    // 2. Chunk Content
    const chunks = chunkText(extracted.text, { chunkSize: 700, chunkOverlap: 140 });

    // 3. Create Material record
    const material = await Material.create({
      userId,
      filename: originalFilename,
      filePath,
      fileType: originalFilename.split('.').pop().toUpperCase(),
      pages: extracted.pages,
      sections: Array.from(new Set(chunks.map(c => c.section))),
      chunkCount: chunks.length,
      extractedPreview: extracted.text.slice(0, 400),
      status: 'processed',
      level: metadata.level || 'High School',
      knowledgeLevel: metadata.knowledgeLevel || 'Beginner',
      language: metadata.language || 'English'
    });

    // 4. Generate Embeddings & Store in Vector Store
    await vectorStore.storeChunks(material._id, chunks, userId);

    return {
      materialId: material._id,
      filename: originalFilename,
      pages: extracted.pages,
      sections: material.sections,
      chunks: chunks.length,
      status: 'processed'
    };
  }

  async buildGroundedPrompt(userQuery, materialId, maxTokens = 1500) {
    const relevantChunks = await vectorStore.retrieveRelevantChunks(userQuery, materialId, 3);
    
    if (relevantChunks.length === 0) {
      return {
        hasContext: false,
        groundedContext: '',
        sources: []
      };
    }

    const contextText = relevantChunks.map((c, i) => '[Source ' + (i + 1) + ' | Section: ' + c.section + ']\n' + c.content).join('\n\n');
    const sources = relevantChunks.map((c, i) => ({
      sourceId: i + 1,
      section: c.section,
      snippet: c.content.slice(0, 140) + '...'
    }));

    return {
      hasContext: true,
      groundedContext: 'RELEVANT COURSE MATERIAL:\n' + contextText + '\n\nINSTRUCTION: Base your teaching strictly on the verified course material above. If the material does not cover a specific detail, explain logically without hallucinating.',
      sources
    };
  }
}

module.exports = new RAGPipeline();