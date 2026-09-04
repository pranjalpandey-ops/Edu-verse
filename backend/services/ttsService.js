class TTSService {
  constructor() {
    this.apiKey = process.env.TTS_API_KEY;
    this.provider = process.env.TTS_PROVIDER || 'browser_web_speech';
  }

  getVoices() {
    return [
      { id: "aria_en", name: "ARIA (English - Warm & Clear)", lang: "en-US", gender: "female" },
      { id: "aria_hi", name: "ARIA (Hindi - Natural Educator)", lang: "hi-IN", gender: "female" },
      { id: "aria_hinglish", name: "ARIA (Hinglish - Interactive)", lang: "hi-IN", gender: "female" },
      { id: "aria_es", name: "ARIA (Spanish - Friendly)", lang: "es-ES", gender: "female" },
      { id: "aria_fr", name: "ARIA (French - Articulate)", lang: "fr-FR", gender: "female" }
    ];
  }

  async synthesizeSpeech(text, language = 'English') {
    return {
      text,
      language,
      provider: this.apiKey ? 'remote_neural' : 'browser_speech_synthesis',
      audioUrl: null, // Frontend will use SpeechSynthesis utterance fallback for zero latency
      fallbackInstruction: 'Use window.speechSynthesis in browser'
    };
  }
}

module.exports = new TTSService();
