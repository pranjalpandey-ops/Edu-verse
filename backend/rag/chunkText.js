function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize || 600;
  const chunkOverlap = options.chunkOverlap || 120;
  
  if (!text || typeof text !== 'string') return [];
  
  const paragraphs = text.split(/\r?\n\s*\r?\n/);
  const chunks = [];
  let currentChunk = '';
  let currentSection = 'General Overview';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (trimmed.length < 80 && (trimmed.endsWith(':') || /^[0-9]+[\.\)]|^#|^Chapter|^Section|^Topic/i.test(trimmed))) {
      currentSection = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
    }

    if ((currentChunk + '\n' + trimmed).length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        index: chunkIndex++,
        content: currentChunk.trim(),
        section: currentSection,
        characterCount: currentChunk.length,
        tokenEstimate: Math.ceil(currentChunk.length / 4)
      });
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(chunkOverlap / 6)).join(' ');
      currentChunk = overlapWords + '\n' + trimmed;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + trimmed : trimmed;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      index: chunkIndex++,
      content: currentChunk.trim(),
      section: currentSection,
      characterCount: currentChunk.length,
      tokenEstimate: Math.ceil(currentChunk.length / 4)
    });
  }

  return chunks;
}

module.exports = { chunkText };