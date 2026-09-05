import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!supported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.lang || 'en-US';

    if (options.voiceName && voices.length > 0) {
      const selected = voices.find(v => v.name.includes(options.voiceName) || v.lang.startsWith(options.lang || 'en'));
      if (selected) utterance.voice = selected;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (options.onError) options.onError();
    };

    window.speechSynthesis.speak(utterance);
  }, [supported, voices]);

  const pause = useCallback(() => {
    if (supported && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [supported, isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (supported && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [supported, isPaused]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [supported]);

  return {
    supported,
    isSpeaking,
    isPaused,
    voices,
    speak,
    pause,
    resume,
    stop
  };
};

export default useSpeechSynthesis;
