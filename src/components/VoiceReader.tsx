'use client';
import { useState } from 'react';

interface VoiceReaderProps {
  text: string;
}

export default function VoiceReader({ text }: VoiceReaderProps) {
  const [isReading, setIsReading] = useState(false);

  // Leer texto con síntesis de voz
  const readText = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz');
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.onend = () => setIsReading(false);
    
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  return (
    <button
      onClick={readText}
      className={`px-4 py-2 rounded-lg font-medium ${
        isReading 
          ? 'bg-red-600 text-white' 
          : 'bg-blue-600 text-white'
      }`}
    >
      🔊 {isReading ? 'Detener Lectura' : 'Leer Pasos'}
    </button>
  );
}