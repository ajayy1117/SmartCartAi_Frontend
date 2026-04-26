import React, { useState, useEffect } from 'react';

export default function VoiceSearch({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const Recognition = window.webkitSpeechRecognition || window.speechRecognition;
    const recognition = new Recognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <>
      <button 
        type="button"
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={startListening}
        title="Search by voice"
      >
        <span className="voice-icon">{isListening ? '🛑' : '🎙️'}</span>
        {isListening && <div className="pulse-ring"></div>}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .voice-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          color: var(--text);
        }
        .voice-btn:hover {
          background: rgba(255,255,255,0.05);
          transform: scale(1.1);
        }
        .voice-btn.listening {
          color: var(--red);
        }
        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--red);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}} />
    </>
  );
}
