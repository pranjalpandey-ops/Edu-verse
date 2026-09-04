const axios = require('axios');

class EmbeddingService {
  constructor() {
    this.apiKey = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY;
    this.dimension = 64;
  }

  async createEmbedding(text) {
    if (this.apiKey && process.env.USE_REMOTE_EMBEDDING === 'true') {
      try {
        const res = await axios.post('https://api.openai.com/v1/embeddings', {
          input: text.slice(0, 2000),
          model: 'text-embedding-3-small'
        }, {
          headers: { Authorization: `Bearer ${this.apiKey}` }
        });
        return res.data.data[0].embedding;
      } catch (err) {
        console.warn('[EmbeddingService] Remote embedding fallback to local vectorizer.');
      }
    }

    return this._localSemanticEmbedding(text);
  }

  _localSemanticEmbedding(text) {
    const vector = new Array(this.dimension).fill(0);
    const cleanText = (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(Boolean);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (charCode * 31 + j * 17 + i * 13) % this.dimension;
        vector[idx] += 1 / (1 + j);
      }
    }

    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vector.map(v => Number((v / norm).toFixed(6)));
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

module.exports = new EmbeddingService();