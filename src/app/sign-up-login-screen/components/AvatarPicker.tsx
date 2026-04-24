'use client';

import React, { useState } from 'react';
import { AVATARS } from '@/lib/nexus-data';

interface AvatarPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium" style={{ color: '#a0a0cc' }}>
        Elige tu avatar cósmico
      </p>
      <div className="grid grid-cols-3 gap-3">
        {AVATARS.map((avatar) => {
          const isSelected = selected === avatar.id;
          const isHovered = hoveredId === avatar.id;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              onMouseEnter={() => setHoveredId(avatar.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all duration-200 btn-cosmic"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${avatar.armorColor}26 0%, rgba(17,17,40,0.9) 100%)`
                  : isHovered
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(17,17,40,0.6)',
                border: `2px solid ${isSelected ? avatar.armorColor : isHovered ? 'rgba(255,255,255,0.15)' : '#2a2a5a'}`,
                boxShadow: isSelected ? `0 0 16px ${avatar.armorColor}40` : 'none',
              }}
              aria-label={`Seleccionar avatar ${avatar.name}`}
              aria-pressed={isSelected}
            >
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                style={{
                  background: `radial-gradient(circle, ${avatar.armorColor}40 0%, ${avatar.skinTone}30 60%, transparent 100%)`,
                  border: `2px solid ${avatar.armorColor}60`,
                }}
              >
                <span>{avatar.accessory}</span>
                <span className="absolute -bottom-1 -right-1 text-xs" style={{ fontSize: 14 }}>
                  {avatar.emoji}
                </span>
              </div>

              <span
                className="text-center text-xs font-medium leading-tight"
                style={{ color: isSelected ? avatar.armorColor : '#a0a0cc' }}
              >
                {avatar.name}
              </span>

              {isSelected && (
                <div
                  className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full"
                  style={{ background: avatar.armorColor }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#0a0a1a" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
