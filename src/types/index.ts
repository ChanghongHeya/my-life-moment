export type CountdownType = 'countdown' | 'elapsed';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type SyncMode = 'manual-icloud' | 'local-only';

export interface CountdownEvent {
  id: string;
  title: string;
  date: string;
  type: CountdownType;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  displayName: string;
  deviceName: string;
}

export interface AppSettings {
  theme: ThemeMode;
  reminderDays: number;
  syncMode: SyncMode;
}

export interface SyncMeta {
  lastExportedAt?: string;
  lastImportedAt?: string;
  lastImportedFrom?: string;
  lastSyncFileName?: string;
  lastSnapshotAt?: string;
}

export interface AppStateV2 {
  schemaVersion: 2;
  profile: UserProfile;
  personal: {
    events: CountdownEvent[];
  };
  academic: {
    favorites: string[];
  };
  settings: AppSettings;
  syncMeta: SyncMeta;
}

export interface ImportSnapshot {
  createdAt: string;
  state: AppStateV2;
}

export interface SyncPackageV1 {
  schemaVersion: 1;
  exportedAt: string;
  deviceName: string;
  salt: string;
  iv: string;
  ciphertext: string;
}

export interface SyncPreview {
  displayName: string;
  eventCount: number;
  favoriteCount: number;
  reminderDays: number;
  theme: ThemeMode;
}

export const COLOR_THEMES = [
  { name: '玫瑰红', color: '#ff6b6b', bg: 'bg-rose-500' },
  { name: '珊瑚橙', color: '#ff8f6b', bg: 'bg-orange-500' },
  { name: '琥珀黄', color: '#f59e0b', bg: 'bg-amber-500' },
  { name: '翡翠绿', color: '#10b981', bg: 'bg-emerald-500' },
  { name: '青绿', color: '#14b8a6', bg: 'bg-teal-500' },
  { name: '天空蓝', color: '#0ea5e9', bg: 'bg-sky-500' },
  { name: '靛蓝', color: '#6366f1', bg: 'bg-indigo-500' },
  { name: '紫罗兰', color: '#8b5cf6', bg: 'bg-violet-500' },
  { name: '粉红', color: '#ec4899', bg: 'bg-pink-500' },
  { name: '石板灰', color: '#64748b', bg: 'bg-slate-500' },
] as const;

export const DEFAULT_ICONS = [
  '❤️', '💕', '💖', '🎂', '🎉', '🎊', '🎁', '🎈',
  '👶', '🤱', '👨‍👩‍👧', '🏠', '🚗', '✈️', '🎓', '💼',
  '🏃', '🎮', '📚', '💍', '🌸', '☀️', '🌙', '⭐',
  '🎵', '🎬', '📷', '✍️', '🔥', '💫', '🌈', '🍀',
] as const;
