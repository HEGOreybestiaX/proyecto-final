import type { PlayerProfile } from '@/lib/nexus-progress';
import { getKingdomProgress, getLevelStats, getTotalCompletedLessons } from '@/lib/nexus-progress';

export interface AvatarOption {
  id: string;
  name: string;
  skinTone: string;
  armorColor: string;
  accessory: string;
  emoji: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'avatar-sol', name: 'Guardián del Sol', skinTone: '#c68642', armorColor: '#f5c842', accessory: '☀️', emoji: '⚡' },
  { id: 'avatar-luna', name: 'Señora de la Luna', skinTone: '#a0522d', armorColor: '#00d4aa', accessory: '🌙', emoji: '✨' },
  { id: 'avatar-cosmos', name: 'Viajero Cósmico', skinTone: '#8d5524', armorColor: '#7c3aed', accessory: '🌌', emoji: '🚀' },
  { id: 'avatar-jade', name: 'Sacerdote Jade', skinTone: '#d2a679', armorColor: '#2ecc8b', accessory: '🌿', emoji: '🔮' },
  { id: 'avatar-fuego', name: 'Espíritu de Fuego', skinTone: '#c68642', armorColor: '#e85d2f', accessory: '🔥', emoji: '💥' },
  { id: 'avatar-tiempo', name: 'Guardián del Tiempo', skinTone: '#a0522d', armorColor: '#f5c842', accessory: '⏳', emoji: '🌀' },
];

export interface KingdomDefinition {
  id: string;
  name: string;
  subtitle: string;
  subject: string;
  icon: string;
  color: string;
  colorRgb: string;
  secondaryColor: string;
  totalLessons: number;
  xpAvailable: number;
  description: string;
  glyphs: string[];
  unlockRule?:
    | {
        type: 'kingdom-progress';
        kingdomId: string;
        minPercent: number;
        reason: string;
      }
    | {
        type: 'all-core';
        reason: string;
      };
}

export const KINGDOMS: KingdomDefinition[] = [
  {
    id: 'reino-tiempo',
    name: 'Reino del Tiempo',
    subtitle: 'Dominio de la Historia',
    subject: 'Historia',
    icon: '⏳',
    color: '#f5c842',
    colorRgb: '245,200,66',
    secondaryColor: '#e85d2f',
    totalLessons: 2,
    xpAvailable: 420,
    description: 'Viaja por las civilizaciones mesoamericanas, la conquista y la independencia de México.',
    glyphs: ['🏛️', '⚔️', '🌽', '📜'],
  },
  {
    id: 'reino-logica',
    name: 'Reino de la Lógica',
    subtitle: 'Dominio de las Matemáticas',
    subject: 'Matemáticas',
    icon: '🔢',
    color: '#00d4aa',
    colorRgb: '0,212,170',
    secondaryColor: '#2ecc8b',
    totalLessons: 1,
    xpAvailable: 310,
    description: 'Descifra los patrones del cosmos: álgebra, geometría y números que rigen el universo.',
    glyphs: ['∑', 'π', '∞', '√'],
  },
  {
    id: 'reino-vida',
    name: 'Reino de la Vida',
    subtitle: 'Dominio de las Ciencias',
    subject: 'Biología',
    icon: '🧬',
    color: '#2ecc8b',
    colorRgb: '46,204,139',
    secondaryColor: '#00d4aa',
    totalLessons: 3,
    xpAvailable: 480,
    description: 'Explora los secretos de la vida, desde las células hasta los ecosistemas.',
    glyphs: ['🌿', '🦋', '🔬', '🌊'],
    unlockRule: {
      type: 'kingdom-progress',
      kingdomId: 'reino-tiempo',
      minPercent: 50,
      reason: 'Completa al menos 50% del Reino del Tiempo para desbloquearlo.',
    },
  },
  {
    id: 'reino-palabras',
    name: 'Reino de las Palabras',
    subtitle: 'Dominio del Lenguaje',
    subject: 'Español',
    icon: '📖',
    color: '#7c3aed',
    colorRgb: '124,58,237',
    secondaryColor: '#ec4899',
    totalLessons: 3,
    xpAvailable: 520,
    description: 'Domina el poder de las palabras: gramática, literatura y expresión en español.',
    glyphs: ['✍️', '📝', '🗣️', '📚'],
    unlockRule: {
      type: 'kingdom-progress',
      kingdomId: 'reino-logica',
      minPercent: 100,
      reason: 'Completa el Reino de la Lógica para desbloquearlo.',
    },
  },
  {
    id: 'reino-cosmos-avanzado',
    name: 'Cosmos Avanzado',
    subtitle: 'Dominio Supremo',
    subject: 'Multi-materia',
    icon: '🌌',
    color: '#ec4899',
    colorRgb: '236,72,153',
    secondaryColor: '#7c3aed',
    totalLessons: 4,
    xpAvailable: 800,
    description: 'El desafío final con conocimiento integrado de todas las materias del cosmos.',
    glyphs: ['⭐', '💫', '🏆', '👑'],
    unlockRule: {
      type: 'all-core',
      reason: 'Completa todos los reinos base para acceder al poder supremo.',
    },
  },
];

export const DAILY_CHALLENGES = [
  {
    id: 'challenge-001',
    text: '¿En qué año cayó Tenochtitlán?',
    kingdom: 'Historia',
    kingdomId: 'reino-tiempo',
    xp: 50,
    icon: '🏛️',
  },
  {
    id: 'challenge-002',
    text: 'Resuelve: 3x + 7 = 22',
    kingdom: 'Matemáticas',
    kingdomId: 'reino-logica',
    xp: 40,
    icon: '🔢',
  },
  {
    id: 'challenge-003',
    text: 'Nombra 3 culturas mesoamericanas',
    kingdom: 'Historia',
    kingdomId: 'reino-tiempo',
    xp: 60,
    icon: '🌽',
  },
];

export function getKingdomState(profile: PlayerProfile | null, kingdom: KingdomDefinition) {
  const progressState = getKingdomProgress(profile, kingdom.id, kingdom.totalLessons);

  if (!kingdom.unlockRule) {
    return {
      ...progressState,
      locked: false,
      lockedReason: undefined,
    };
  }

  if (kingdom.unlockRule.type === 'kingdom-progress') {
    const dependency = KINGDOMS.find((item) => item.id === kingdom.unlockRule?.kingdomId);
    const dependencyProgress = dependency
      ? getKingdomProgress(profile, dependency.id, dependency.totalLessons)
      : { progress: 0 };

    const locked = dependencyProgress.progress < kingdom.unlockRule.minPercent;

    return {
      ...progressState,
      locked,
      lockedReason: locked ? kingdom.unlockRule.reason : undefined,
    };
  }

  const coreKingdoms = KINGDOMS.filter((item) => !item.unlockRule);
  const allCoreCompleted = coreKingdoms.every((item) => {
    const itemProgress = getKingdomProgress(profile, item.id, item.totalLessons);
    return itemProgress.progress >= 100;
  });

  return {
    ...progressState,
    locked: !allCoreCompleted,
    lockedReason: allCoreCompleted ? undefined : kingdom.unlockRule.reason,
  };
}

export interface TeacherStudent {
  id: string;
  name: string;
  avatarEmoji: string;
  xp: number;
  level: number;
  completedLessons: number;
  streak: number;
  group: string;
  focus: string;
  accuracy: number;
  status: string;
  lastSeen: string;
}

const MOCK_STUDENTS: Omit<TeacherStudent, 'level'>[] = [
  {
    id: 'student-ana',
    name: 'Ana X.',
    avatarEmoji: '🌙',
    xp: 980,
    completedLessons: 4,
    streak: 6,
    group: '2° B',
    focus: 'Historia',
    accuracy: 91,
    status: 'Destacada',
    lastSeen: 'Hoy · 13:20',
  },
  {
    id: 'student-diego',
    name: 'Diego R.',
    avatarEmoji: '🚀',
    xp: 640,
    completedLessons: 3,
    streak: 3,
    group: '2° B',
    focus: 'Matemáticas',
    accuracy: 84,
    status: 'Constante',
    lastSeen: 'Hoy · 12:05',
  },
  {
    id: 'student-luna',
    name: 'Luna M.',
    avatarEmoji: '🔮',
    xp: 420,
    completedLessons: 2,
    streak: 1,
    group: '2° A',
    focus: 'Historia',
    accuracy: 76,
    status: 'En progreso',
    lastSeen: 'Ayer · 18:10',
  },
  {
    id: 'student-jair',
    name: 'Jair T.',
    avatarEmoji: '🔥',
    xp: 250,
    completedLessons: 1,
    streak: 0,
    group: '2° A',
    focus: 'Refuerzo',
    accuracy: 63,
    status: 'Necesita apoyo',
    lastSeen: 'Ayer · 16:45',
  },
];

export function buildTeacherRoster(activeStudent: PlayerProfile | null) {
  const mockRoster = MOCK_STUDENTS.map((student) => ({
    ...student,
    level: getLevelStats(student.xp).level,
  }));

  if (!activeStudent) {
    return mockRoster;
  }

  const liveProgress = getTotalCompletedLessons(activeStudent);
  const liveStudent: TeacherStudent = {
    id: 'student-local',
    name: activeStudent.name,
    avatarEmoji: activeStudent.avatarEmoji,
    xp: activeStudent.xp,
    level: getLevelStats(activeStudent.xp).level,
    completedLessons: liveProgress,
    streak: activeStudent.streak,
    group: 'Usuario local',
    focus: liveProgress > 0 ? 'Ruta activa' : 'Inicio',
    accuracy: liveProgress > 0 ? 88 : 0,
    status: liveProgress > 2 ? 'Destacado' : liveProgress > 0 ? 'En progreso' : 'Nuevo',
    lastSeen: 'Ahora',
  };

  return [liveStudent, ...mockRoster];
}
