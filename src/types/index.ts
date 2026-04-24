export type CountdownType = 'countdown' | 'elapsed';

export interface CountdownEvent {
  id: string;
  title: string;
  date: string; // ISO 8601 date string
  type: CountdownType;
  icon: string; // Emoji or icon name
  color: string; // Hex color
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  showInMenubar: boolean;
  syncEnabled: boolean;
  iCloudPath?: string;
}

export interface AppData {
  version: number;
  events: CountdownEvent[];
  settings: AppSettings;
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

export const DEFAULT_DATA: AppData = {
  version: 1,
  events: [
    {
      id: 'default-1',
      title: '在一起',
      date: new Date(new Date().getFullYear(), 10, 16).toISOString().split('T')[0], // Nov 16
      type: 'elapsed',
      icon: '❤️',
      color: '#ff6b6b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'default-2',
      title: '人生进度',
      date: new Date(new Date().getFullYear() - 23, 0, 1).toISOString().split('T')[0],
      type: 'elapsed',
      icon: '🌱',
      color: '#10b981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  settings: {
    theme: 'auto',
    showInMenubar: true,
    syncEnabled: true,
  },
};
