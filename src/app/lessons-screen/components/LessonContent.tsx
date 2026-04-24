'use client';
import React from 'react';

interface ContentBlock {
  type: 'text' | 'highlight' | 'timeline' | 'fact';
  content: string;
  label?: string;
  year?: string;
  color?: string;
}

interface LessonContentProps {
  title: string;
  subtitle: string;
  blocks: ContentBlock[];
  kingdomColor: string;
}

export default function LessonContent({ title, subtitle, blocks, kingdomColor }: LessonContentProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: `linear-gradient(135deg, rgba(${kingdomColor},0.1) 0%, rgba(17,17,40,0.95) 100%)`,
          border: `1px solid rgba(${kingdomColor},0.3)`,
        }}
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: `rgb(${kingdomColor})` }}>
          📖 Lección
        </p>
        <h2 className="text-xl font-bold" style={{ color: '#f0f0ff' }}>{title}</h2>
        <p className="text-sm mt-1" style={{ color: '#8080bb' }}>{subtitle}</p>
      </div>

      {/* Content blocks */}
      <div className="space-y-3">
        {blocks.map((block, idx) => {
          if (block.type === 'text') {
            return (
              <div
                key={`block-text-${idx}`}
                className="rounded-xl p-4"
                style={{ background: 'rgba(17,17,40,0.7)', border: '1px solid #1e1e40' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee' }}>
                  {block.content}
                </p>
              </div>
            );
          }

          if (block.type === 'highlight') {
            return (
              <div
                key={`block-highlight-${idx}`}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  background: `rgba(${block.color || kingdomColor},0.08)`,
                  border: `1px solid rgba(${block.color || kingdomColor},0.25)`,
                }}
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ background: `rgb(${block.color || kingdomColor})` }}
                />
                <div>
                  {block.label && (
                    <p className="text-xs font-bold mb-1" style={{ color: `rgb(${block.color || kingdomColor})` }}>
                      {block.label}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed font-medium" style={{ color: '#d0d0ee' }}>
                    {block.content}
                  </p>
                </div>
              </div>
            );
          }

          if (block.type === 'timeline') {
            return (
              <div
                key={`block-timeline-${idx}`}
                className="rounded-xl p-4 flex items-start gap-4"
                style={{ background: 'rgba(17,17,40,0.7)', border: '1px solid #1e1e40' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold xp-font flex-shrink-0"
                    style={{
                      background: `rgba(${kingdomColor},0.15)`,
                      border: `1px solid rgba(${kingdomColor},0.4)`,
                      color: `rgb(${kingdomColor})`,
                    }}
                  >
                    {block.year}
                  </div>
                  <div
                    className="w-0.5 h-4 rounded-full"
                    style={{ background: `rgba(${kingdomColor},0.2)` }}
                  />
                </div>
                <div className="pt-1">
                  {block.label && (
                    <p className="text-xs font-bold mb-1" style={{ color: `rgb(${kingdomColor})` }}>
                      {block.label}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee' }}>
                    {block.content}
                  </p>
                </div>
              </div>
            );
          }

          if (block.type === 'fact') {
            return (
              <div
                key={`block-fact-${idx}`}
                className="rounded-xl p-4"
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.25)',
                }}
              >
                <p className="text-xs font-bold mb-1.5" style={{ color: '#7c3aed' }}>
                  🌌 Dato Cósmico
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#c0c0ee' }}>
                  {block.content}
                </p>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}