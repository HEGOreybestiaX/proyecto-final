'use client';

export const PLAYER_STORAGE_KEY = 'nexus_player_data';

const LEGACY_STORAGE_KEYS = [
  'nexus_xp',
  'nexus_progress',
  'nexus_streak',
  'nexus_completed_lessons',
];

export interface PlayerProfile {
  name: string;
  avatar: string;
  avatarEmoji: string;
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  registeredAt: string;
  lastActiveAt: string;
  email?: string;
}

export interface LevelStats {
  level: number;
  currentLevelXP: number;
  xpForNextLevel: number;
  progressPercent: number;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function isBrowser() {
  return typeof window !== 'undefined';
}

function getLevelRequirement(level: number) {
  return 300 + Math.max(0, level - 1) * 150;
}

function toDayNumber(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / DAY_IN_MS);
}

function getNextStreak(previousStreak: number, lastActiveAt?: string) {
  const lastDay = toDayNumber(lastActiveAt);
  const today = toDayNumber(new Date().toISOString());

  if (lastDay === null || today === null) {
    return Math.max(previousStreak, 1);
  }

  if (lastDay === today) {
    return Math.max(previousStreak, 1);
  }

  if (lastDay === today - 1) {
    return Math.max(previousStreak + 1, 1);
  }

  return 1;
}

export function getLevelStats(totalXP: number): LevelStats {
  let level = 1;
  let xpRemaining = Math.max(0, totalXP);
  let xpForNextLevel = getLevelRequirement(level);

  while (xpRemaining >= xpForNextLevel) {
    xpRemaining -= xpForNextLevel;
    level += 1;
    xpForNextLevel = getLevelRequirement(level);
  }

  return {
    level,
    currentLevelXP: xpRemaining,
    xpForNextLevel,
    progressPercent: xpForNextLevel > 0 ? Math.round((xpRemaining / xpForNextLevel) * 100) : 0,
  };
}

export function createLessonCompletionKey(kingdomId: string, lessonId: string) {
  return `${kingdomId}:${lessonId}`;
}

function normalizeProfile(raw?: Partial<PlayerProfile> | null): PlayerProfile {
  const xp = Math.max(0, raw?.xp ?? 0);
  const levelStats = getLevelStats(xp);
  const now = new Date().toISOString();

  return {
    name: raw?.name?.trim() || 'Guerrero Cósmico',
    avatar: raw?.avatar || 'avatar-sol',
    avatarEmoji: raw?.avatarEmoji || '⚡',
    xp,
    level: levelStats.level,
    streak: Math.max(0, raw?.streak ?? 0),
    completedLessons: Array.isArray(raw?.completedLessons) ? [...new Set(raw.completedLessons)] : [],
    registeredAt: raw?.registeredAt || now,
    lastActiveAt: raw?.lastActiveAt || raw?.registeredAt || now,
    email: raw?.email,
  };
}

export function clearLegacyProgress() {
  if (!isBrowser()) return;

  LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

export function readPlayerProfile() {
  if (!isBrowser()) return null;

  try {
    const stored = window.localStorage.getItem(PLAYER_STORAGE_KEY);
    if (!stored) return null;

    return normalizeProfile(JSON.parse(stored) as Partial<PlayerProfile>);
  } catch {
    return null;
  }
}

export function savePlayerProfile(profile: Partial<PlayerProfile>) {
  if (!isBrowser()) {
    return normalizeProfile(profile);
  }

  const nextProfile = normalizeProfile(profile);
  window.localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(nextProfile));

  return nextProfile;
}

export function upsertPlayerProfile(updates: Partial<PlayerProfile>) {
  const current = readPlayerProfile();
  return savePlayerProfile({ ...current, ...updates });
}

export function createInitialPlayerProfile(input: {
  name: string;
  avatar: string;
  avatarEmoji: string;
  email?: string;
  xp?: number;
  streak?: number;
  completedLessons?: string[];
}) {
  const now = new Date().toISOString();

  return normalizeProfile({
    name: input.name,
    avatar: input.avatar,
    avatarEmoji: input.avatarEmoji,
    email: input.email,
    xp: input.xp ?? 0,
    streak: input.streak ?? 0,
    completedLessons: input.completedLessons ?? [],
    registeredAt: now,
    lastActiveAt: now,
  });
}

export function ensurePlayerProfile(fallback?: Partial<PlayerProfile>) {
  const current = readPlayerProfile();
  if (current) return current;

  return savePlayerProfile(
    normalizeProfile({
      ...fallback,
      name: fallback?.name || 'Guerrero Cósmico',
      avatar: fallback?.avatar || 'avatar-sol',
      avatarEmoji: fallback?.avatarEmoji || '⚡',
    })
  );
}

export function getTotalCompletedLessons(profile: PlayerProfile | null) {
  return profile?.completedLessons.length ?? 0;
}

export function hasCompletedLesson(profile: PlayerProfile | null, kingdomId: string, lessonId: string) {
  if (!profile) return false;
  return profile.completedLessons.includes(createLessonCompletionKey(kingdomId, lessonId));
}

export function completeLesson(profile: PlayerProfile, kingdomId: string, lessonId: string) {
  const lessonKey = createLessonCompletionKey(kingdomId, lessonId);
  const alreadyCompleted = profile.completedLessons.includes(lessonKey);
  const now = new Date().toISOString();

  return savePlayerProfile({
    ...profile,
    completedLessons: alreadyCompleted ? profile.completedLessons : [...profile.completedLessons, lessonKey],
    streak: getNextStreak(profile.streak, profile.lastActiveAt),
    lastActiveAt: now,
  });
}

export function getKingdomProgress(profile: PlayerProfile | null, kingdomId: string, totalLessons: number) {
  const completedLessons = profile?.completedLessons.filter((entry) =>
    entry.startsWith(`${kingdomId}:`)
  ).length ?? 0;
  const safeTotalLessons = Math.max(totalLessons, completedLessons);
  const progress = safeTotalLessons > 0 ? Math.round((completedLessons / safeTotalLessons) * 100) : 0;

  return {
    completedLessons,
    totalLessons: safeTotalLessons,
    progress,
  };
}
