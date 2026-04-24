'use client';

import React, { useEffect, useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

const NEXUS_TIPS = [
  { tip: 'La historia no es aburrida: es la memoria del cosmos. Quien la conoce, no repite los errores del pasado.', icon: '🌌' },
  { tip: 'Las matemáticas son el lenguaje del universo. Cada ecuación es una ley cósmica esperando ser descubierta.', icon: '⚡' },
  { tip: 'Los guerreros más poderosos no son los más fuertes: son los más constantes. Estudia hoy, domina mañana.', icon: '🏆' },
  { tip: 'Los aztecas construyeron calendarios más precisos que muchos europeos de su época. El conocimiento siempre fue nuestro.', icon: '🗓️' },
  { tip: 'Mejorar un poco cada día crea una ventaja enorme con el tiempo. La constancia es tu mejor arma.', icon: '📈' },
];

export default function NexusTipPanel() {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [displayedTip, setDisplayedTip] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stop } = useSpeech({ rate: 0.88, pitch: 0.78, volume: 1 });

  useEffect(() => {
    const tip = NEXUS_TIPS[tipIndex]?.tip ?? '';
    setDisplayedTip('');

    let index = 0;
    const interval = setInterval(() => {
      if (index < tip.length) {
        setDisplayedTip(tip.slice(0, index + 1));
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 28);

    setIsSpeaking(true);
    speak(tip);
    const speakTimer = window.setTimeout(() => setIsSpeaking(false), tip.length * 65 + 500);

    return () => {
      clearInterval(interval);
      window.clearTimeout(speakTimer);
      stop();
    };
  }, [speak, stop, tipIndex]);

  const currentTip = NEXUS_TIPS[tipIndex];

  const nextTip = () => {
    stop();
    setIsSpeaking(false);
    setVisible(false);

    window.setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % NEXUS_TIPS.length);
      setVisible(true);
    }, 200);
  };

  return (
    <div
      className="space-y-3 rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(17,17,40,0.95) 100%)',
        border: '1px solid rgba(0,212,170,0.25)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle, #00ffcc 0%, #00d4aa 50%, #006655 100%)',
            boxShadow: isSpeaking ? '0 0 16px rgba(0,212,170,0.8)' : '0 0 10px rgba(0,212,170,0.5)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <div className="rounded-full" style={{ width: 6, height: 8, background: 'rgba(255,255,255,0.9)' }} />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: '#00d4aa' }}>NEXUS dice</p>
          <p className="text-xs" style={{ color: '#6060aa', fontSize: 10 }}>Sabiduría cósmica</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stop();
                setIsSpeaking(false);
              } else {
                setIsSpeaking(true);
                speak(currentTip?.tip ?? '');
                window.setTimeout(() => setIsSpeaking(false), (currentTip?.tip.length ?? 0) * 65 + 500);
              }
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: isSpeaking ? '#00d4aa' : 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.3)',
              fontSize: 11,
            }}
            title={isSpeaking ? 'Silenciar' : 'Escuchar'}
          >
            {isSpeaking ? '🔊' : '🔈'}
          </button>

          {NEXUS_TIPS.map((_, index) => (
            <div
              key={`dot-${index}`}
              className="rounded-full transition-all duration-200"
              style={{
                width: index === tipIndex ? 16 : 4,
                height: 4,
                background: index === tipIndex ? '#00d4aa' : '#2a2a5a',
              }}
            />
          ))}
        </div>
      </div>

      <div className="transition-opacity duration-200" style={{ opacity: visible ? 1 : 0 }}>
        <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee', minHeight: 60 }}>
          <span className="mr-1">{currentTip?.icon}</span>
          {displayedTip}
          {displayedTip.length < (currentTip?.tip.length ?? 0) && (
            <span style={{ color: '#00d4aa' }}>|</span>
          )}
        </p>
      </div>

      <button
        onClick={nextTip}
        className="btn-cosmic w-full rounded-xl py-2 text-xs font-semibold"
        style={{
          background: 'rgba(0,212,170,0.1)',
          border: '1px solid rgba(0,212,170,0.2)',
          color: '#00d4aa',
        }}
      >
        Siguiente sabiduría →
      </button>
    </div>
  );
}
