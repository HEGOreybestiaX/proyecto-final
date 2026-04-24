'use client';
import React, { useEffect, useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

interface NexusPanelProps {
  message: string;
  mood: 'neutral' | 'correct' | 'incorrect' | 'teaching' | 'challenge';
  fact?: string;
}

const moodConfig = {
  neutral: { color: '#00d4aa', glow: 'rgba(0,212,170,0.3)', emoji: '🌌', label: 'NEXUS' },
  correct: { color: '#2ecc8b', glow: 'rgba(46,204,139,0.4)', emoji: '⚡', label: '¡CORRECTO!' },
  incorrect: { color: '#e85d2f', glow: 'rgba(232,93,47,0.3)', emoji: '🔥', label: 'INTÉNTALO' },
  teaching: { color: '#f5c842', glow: 'rgba(245,200,66,0.3)', emoji: '📚', label: 'NEXUS EXPLICA' },
  challenge: { color: '#7c3aed', glow: 'rgba(124,58,237,0.4)', emoji: '⚔️', label: '¡RETO!' },
};

// Pre-computed ray endpoints to avoid SSR/client hydration mismatch
const NEXUS_PANEL_RAYS = [0, 60, 120, 180, 240, 300].map((angle) => ({
  x2: parseFloat((40 + 28 * Math.cos((angle * Math.PI) / 180)).toFixed(6)),
  y2: parseFloat((40 + 28 * Math.sin((angle * Math.PI) / 180)).toFixed(6)),
}));

export default function NexusPanel({ message, mood, fact }: NexusPanelProps) {
  const [displayedMsg, setDisplayedMsg] = useState('');
  const [displayedFact, setDisplayedFact] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const config = moodConfig[mood];
  const { speak, stop } = useSpeech({ rate: 0.88, pitch: 0.78, volume: 1 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDisplayedMsg('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedMsg(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);

    // Speak the message automatically
    setIsSpeaking(true);
    speak(message);
    const speakTimer = setTimeout(() => setIsSpeaking(false), message.length * 60 + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(speakTimer);
      stop();
    };
  }, [message]); // intentionally omit speak/stop to avoid infinite loop

  useEffect(() => {
    if (!fact) return;
    setDisplayedFact('');
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fact.length) {
          setDisplayedFact(fact.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }, message.length * 22 + 300);
    return () => clearTimeout(delay);
  }, [fact, message.length]);

  return (
    <div className="space-y-4">
      {/* NEXUS Avatar */}
      <div className="flex flex-col items-center">
        <div
          className="relative w-20 h-20 transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 20px ${config.glow})`,
          }}
        >
          {/* Outer ring */}
          <svg className="absolute inset-0 animate-spin-slow" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke={config.color} strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
          </svg>

          {/* Glyph rays */}
          <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80" fill="none">
            {NEXUS_PANEL_RAYS.map((ray, idx) => (
              <line
                key={`nexus-ray-${idx}`}
                x1="40" y1="40"
                x2={ray.x2}
                y2={ray.y2}
                stroke="#f5c842"
                strokeWidth="1"
                opacity="0.4"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Core */}
          <div
            className="absolute rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              inset: '16px',
              background: `radial-gradient(circle at 40% 35%, #00ffcc 0%, ${config.color} 40%, #003333 100%)`,
              boxShadow: `0 0 20px ${config.glow}, inset 0 0 10px rgba(0,255,200,0.2)`,
              animation: isSpeaking ? 'pulse 0.6s ease-in-out infinite alternate' : undefined,
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 10,
                height: 14,
                background: 'radial-gradient(ellipse, #ffffff 0%, #00ffcc 50%, #003333 100%)',
              }}
            />
          </div>

          {/* Mood indicator */}
          <div
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{
              background: config.color,
              boxShadow: `0 0 12px ${config.glow}`,
            }}
          >
            {config.emoji}
          </div>
        </div>

        <div className="mt-2 text-center flex items-center gap-2 justify-center">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ color: config.color }}
          >
            {config.label}
          </p>
          {/* Speaker toggle button */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stop();
                setIsSpeaking(false);
              } else {
                setIsSpeaking(true);
                speak(message + (fact ? '. Dato curioso: ' + fact : ''));
                setTimeout(() => setIsSpeaking(false), (message.length + (fact?.length || 0)) * 60 + 500);
              }
            }}
            className="text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200"
            style={{
              background: isSpeaking ? config.color : 'rgba(255,255,255,0.08)',
              color: isSpeaking ? '#0a0a1a' : config.color,
              border: `1px solid ${config.color}`,
              fontSize: 10,
            }}
            title={isSpeaking ? 'Silenciar NEXUS' : 'Escuchar NEXUS'}
          >
            {isSpeaking ? '🔊' : '🔈'}
          </button>
        </div>
      </div>

      {/* Dialogue */}
      <div
        className="rounded-2xl p-4 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, rgba(${config.color === '#00d4aa' ? '0,212,170' : config.color === '#2ecc8b' ? '46,204,139' : config.color === '#e85d2f' ? '232,93,47' : config.color === '#f5c842' ? '245,200,66' : '124,58,237'},0.08) 0%, rgba(17,17,40,0.95) 100%)`,
          border: `1px solid rgba(${config.color === '#00d4aa' ? '0,212,170' : config.color === '#2ecc8b' ? '46,204,139' : config.color === '#e85d2f' ? '232,93,47' : config.color === '#f5c842' ? '245,200,66' : '124,58,237'},0.3)`,
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee', minHeight: 60 }}>
          {displayedMsg}
          {displayedMsg.length < message.length && (
            <span style={{ color: config.color }}>|</span>
          )}
        </p>
      </div>

      {/* Curiosity fact */}
      {fact && displayedFact && (
        <div
          className="rounded-xl p-3 animate-fade-in"
          style={{
            background: 'rgba(245,200,66,0.06)',
            border: '1px solid rgba(245,200,66,0.2)',
          }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: '#f5c842' }}>
            💡 Dato curioso
          </p>
          <p className="text-xs leading-relaxed" style={{ color: '#a0a0cc' }}>
            {displayedFact}
          </p>
        </div>
      )}
    </div>
  );
}