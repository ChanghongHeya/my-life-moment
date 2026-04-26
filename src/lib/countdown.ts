import type { CountdownEvent, CountdownType } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(input: string | Date): Date {
  const value = typeof input === 'string' ? new Date(input) : new Date(input.getTime());
  value.setHours(0, 0, 0, 0);
  return value;
}

function diffInDays(targetDate: string): number {
  const today = startOfDay(new Date());
  const target = startOfDay(targetDate);
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function calculateDays(dateStr: string, type: CountdownType): number {
  const delta = diffInDays(dateStr);
  return type === 'countdown' ? Math.max(delta, 0) : Math.max(-delta, 0);
}

export function formatDays(days: number): string {
  return `${days}`;
}

export function getDaysLabel(): string {
  return '天';
}

export function formatEventDate(dateStr: string): string {
  return startOfDay(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getEventSecondaryInfo(event: CountdownEvent): string {
  const days = calculateDays(event.date, event.type);
  const formattedDate = formatEventDate(event.date);

  if (event.type === 'elapsed') {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;

    if (years > 0) {
      return `${years} 年 ${remainingDays} 天 · 从 ${formattedDate} 开始`;
    }

    return `${days} 天 · 从 ${formattedDate} 开始`;
  }

  return `${formattedDate} · 还有 ${days} 天`;
}

export function isLifeProgressEvent(event: CountdownEvent): boolean {
  return event.title.trim() === '人生进度';
}
