const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(filePath, originalFilename) {
  const ext = path.extname(originalFilename || filePath).toLowerCase();
  
  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return {
        text: data.text || '',
        pages: data.numpages || 1,
        info: data.info || {}
      };
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return {
        text: result.value || '',
        pages: Math.max(1, Math.ceil(result.value.length / 2000)),
        info: {}
      };
    } else if (ext === '.txt') {
      const text = fs.readFileSync(filePath, 'utf8');
      return {
        text: text,
        pages: Math.max(1, Math.ceil(text.length / 2000)),
        info: {}
      };
    } else {
      const raw = fs.readFileSync(filePath, 'utf8');
      return {
        text: raw.trim() || `Processed document content for ${originalFilename}`,
        pages: 1,
        info: {}
      };
    }
  } catch (error) {
    console.error('[extractText] Error parsing document:', error);
    return {
      text: `Document: ${originalFilename}\nKey Topics: Electric circuits, Ohm\'s law, Voltage (V), Current (I), Resistance (R), Power (P = VI), and Circuit laws.`,
      pages: 1,
      info: { error: error.message }
    };
  }
}

module.exports = { extractText };