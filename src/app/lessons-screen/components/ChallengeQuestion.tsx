'use client';

import React, { useEffect, useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

interface Option {
  id: string;
  text: string;
  emoji?: string;
}

interface ChallengeQuestionProps {
  question: string;
  options: Option[];
  correctId: string;
  onAnswer: (isCorrect: boolean, optionId: string) => void;
  answered: boolean;
  selectedId: string | null;
  hint?: string;
  kingdomColor: string;
}

export default function ChallengeQuestion({
  question,
  options,
  correctId,
  onAnswer,
  answered,
  selectedId,
  hint,
  kingdomColor,
}: ChallengeQuestionProps) {
  const [hintVisible, setHintVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stop } = useSpeech({ rate: 0.9, pitch: 0.85, lang: 'es-MX' });

  useEffect(() => {
    setHintVisible(false);
  }, [question]);

  const handleRepeatAudio = () => {
    setIsSpeaking(true);
    speak(question);
    setTimeout(() => setIsSpeaking(false), question.length * 55 + 400);
  };

  const handleSelect = (optionId: string) => {
    if (answered) return;
    stop();
    onAnswer(optionId === correctId, optionId);
  };

  const getOptionStyle = (optionId: string) => {
    if (optionId === selectedId && !answered) {
      return {
        borderColor: `rgb(${kingdomColor})`,
        background: `rgba(${kingdomColor},0.16)`,
        boxShadow: `0 0 10px rgba(${kingdomColor},0.2)`,
      };
    }
    if (!answered) return {};
    if (optionId === correctId) {
      return {
        borderColor: '#2ecc8b',
        background: 'rgba(46,204,139,0.15)',
        boxShadow: '0 0 12px rgba(46,204,139,0.3)',
      };
    }
    if (optionId === selectedId && optionId !== correctId) {
      return {
        borderColor: '#e85d2f',
        background: 'rgba(232,93,47,0.15)',
        animation: 'shake 0.5s ease-in-out',
      };
    }
    return { opacity: 0.5 };
  };

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-5"
        style={{
          background: `linear-gradient(135deg, rgba(${kingdomColor},0.06) 0%, rgba(17,17,40,0.9) 100%)`,
          border: `1px solid rgba(${kingdomColor},0.2)`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              background: `rgba(${kingdomColor},0.15)`,
              border: `1px solid rgba(${kingdomColor},0.3)`,
              color: `rgb(${kingdomColor})`,
            }}
          >
            ?
          </div>
          <p className="flex-1 text-base font-semibold leading-relaxed" style={{ color: '#f0f0ff' }}>
            {question}
          </p>

          {/* 🔊 Repeat audio button */}
          <button
            onClick={handleRepeatAudio}
            title="Repetir pregunta en voz alta"
            className="btn-cosmic flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200"
            style={{
              background: isSpeaking
                ? `rgba(${kingdomColor},0.25)`
                : `rgba(${kingdomColor},0.08)`,
              border: `1px solid rgba(${kingdomColor},0.3)`,
              color: `rgb(${kingdomColor})`,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: isSpeaking ? `0 0 12px rgba(${kingdomColor},0.4)` : 'none',
              animation: isSpeaking ? 'pulse 1s ease-in-out infinite' : 'none',
            }}
            aria-label="Escuchar pregunta"
          >
            {isSpeaking ? '🔊' : '🔈'}
          </button>
        </div>

        {hint && !answered && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(42,42,90,0.5)' }}>
            {!hintVisible ? (
              <button
                onClick={() => setHintVisible(true)}
                className="btn-cosmic rounded-lg px-3 py-1.5 text-xs"
                style={{
                  background: 'rgba(245,200,66,0.08)',
                  border: '1px solid rgba(245,200,66,0.2)',
                  color: '#f5c842',
                }}
              >
                💡 Ver pista
              </button>
            ) : (
              <div className="animate-fade-in flex items-start gap-2">
                <span className="text-xs">💡</span>
                <p className="text-xs leading-relaxed" style={{ color: '#b0b060' }}>
                  {hint}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === correctId;
          const style = getOptionStyle(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={answered}
              className={`answer-option flex w-full items-center gap-3 p-4 text-left transition-all duration-200 ${answered ? 'disabled' : ''} ${isSelected && answered && !isCorrectOption ? 'animate-shake' : ''}`}
              style={{
                ...style,
                cursor: answered ? 'not-allowed' : 'pointer',
              }}
              aria-pressed={isSelected}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: answered && isCorrectOption
                    ? '#2ecc8b'
                    : answered && isSelected && !isCorrectOption
                    ? '#e85d2f'
                    : `rgba(${kingdomColor},0.1)`,
                  border: `1px solid rgba(${kingdomColor},0.3)`,
                  color: answered && (isCorrectOption || (isSelected && !isCorrectOption))
                    ? '#0a0a1a'
                    : `rgb(${kingdomColor})`,
                }}
              >
                {answered && isCorrectOption
                  ? '✓'
                  : answered && isSelected && !isCorrectOption
                  ? '✕'
                  : option.emoji || String.fromCharCode(65 + index)}
              </div>

              <span
                className="text-sm font-medium leading-tight"
                style={{
                  color: answered && isCorrectOption
                    ? '#2ecc8b'
                    : answered && isSelected && !isCorrectOption
                    ? '#e85d2f'
                    : '#c0c0ee',
                }}
              >
                {option.text}
              </span>

              {answered && isCorrectOption && (
                <span className="ml-auto text-xs font-semibold" style={{ color: '#2ecc8b' }}>
                  ✅ Correcto
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
