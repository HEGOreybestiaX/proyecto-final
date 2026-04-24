'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'incorrect' | 'levelup' | 'click' | 'complete';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const play = useCallback((type: SoundType) => {
    try {
      const ctx = getCtx();

      const playTone = (freq: number, startTime: number, duration: number, gain = 0.18, wave: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(gain, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      if (type === 'correct') {
        // Ascending pleasant chord
        playTone(523, now, 0.12);        // C5
        playTone(659, now + 0.08, 0.14); // E5
        playTone(784, now + 0.16, 0.18); // G5
      } else if (type === 'incorrect') {
        // Descending flat tone
        playTone(220, now, 0.1, 0.15, 'sawtooth');
        playTone(180, now + 0.1, 0.15, 0.12, 'sawtooth');
      } else if (type === 'levelup') {
        // Fanfare ascending
        [523, 659, 784, 1047].forEach((f, i) => playTone(f, now + i * 0.1, 0.2, 0.2));
      } else if (type === 'click') {
        playTone(880, now, 0.04, 0.08);
      } else if (type === 'complete') {
        // Victory jingle
        [523, 659, 784, 659, 1047].forEach((f, i) => playTone(f, now + i * 0.12, 0.16, 0.18));
      }
    } catch {
      // AudioContext not available (SSR, blocked by browser policy, etc.)
    }
  }, []);

  return { play };
}
