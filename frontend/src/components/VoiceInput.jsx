import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';

const VoiceInput = ({ onTranscript, onStateChange, disabled = false, placeholder = "Ask your teacher..." }) => {
  const [state, setState] = useState('idle'); // idle, listening, processing, error
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState('listening');
        if (onStateChange) onStateChange('listening');
      };

      recognition.onresult = (event) => {
        setState('processing');
        if (onStateChange) onStateChange('processing');
        const transcript = event.results[0][0].transcript;
        if (transcript && onTranscript) {
          onTranscript(transcript);
        }
        setState('idle');
        if (onStateChange) onStateChange('idle');
      };

      recognition.onerror = (event) => {
        console.warn('[VoiceInput] Speech error:', event.error);
        setState('error');
        setErrorMessage(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Could not recognize speech.');
        if (onStateChange) onStateChange('error');
        setTimeout(() => setState('idle'), 3000);
      };

      recognition.onend = () => {
        if (state === 'listening') {
          setState('idle');
          if (onStateChange) onStateChange('idle');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscript, onStateChange, state]);

  const toggleListening = () => {
    if (disabled) return;

    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (state === 'listening') {
      recognitionRef.current.stop();
      setState('idle');
      if (onStateChange) onStateChange('idle');
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('[VoiceInput] Start error:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
          state === 'listening'
            ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/30'
            : state === 'processing'
            ? 'bg-amber-500 text-white'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
        }`}
        title={state === 'listening' ? 'Listening... click to stop' : 'Click to speak'}
      >
        {state === 'listening' ? (
          <>
            <Mic className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Listening...</span>
          </>
        ) : state === 'processing' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Processing...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice</span>
          </>
        )}
      </button>

      {state === 'error' && (
        <span className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default VoiceInput;
