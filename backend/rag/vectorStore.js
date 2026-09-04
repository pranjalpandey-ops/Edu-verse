const { DocumentChunk } = require('../models');
const embeddingService = require('./embeddingService');

class VectorStore {
  async storeChunks(materialId, chunks, userId) {
    const chunkDocs = [];
    for (const chunk of chunks) {
      const embedding = await embeddingService.createEmbedding(chunk.content);
      const doc = {
        materialId,
        userId,
        chunkIndex: chunk.index,
        section: chunk.section,
        content: chunk.content,
        tokenEstimate: chunk.tokenEstimate,
        embedding: embedding
      };
      chunkDocs.push(doc);
    }
    return await DocumentChunk.insertMany(chunkDocs);
  }

  async retrieveRelevantChunks(query, materialId = null, topK = 4) {
    const queryEmbedding = await embeddingService.createEmbedding(query);
    const filter = materialId ? { materialId } : {};
    const allChunks = await DocumentChunk.find(filter);

    if (!allChunks || allChunks.length === 0) return [];

    const scored = allChunks.map(chunk => {
      const sim = chunk.embedding 
        ? embeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
        : 0.5;
      return {
        ...chunk,
        similarity: sim
      };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }
}

module.exports = new VectorStore();
