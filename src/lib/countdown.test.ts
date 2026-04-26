import { describe, expect, it } from 'vitest';
import { calculateDays } from '@/lib/countdown';

function offsetDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

describe('countdown utilities', () => {
  it('calculates future countdown days correctly', () => {
    expect(calculateDays(offsetDate(5), 'countdown')).toBe(5);
  });

  it('calculates elapsed days correctly', () => {
    expect(calculateDays(offsetDate(-8), 'elapsed')).toBe(8);
  });

  it('clamps past countdowns and future elapsed values to zero', () => {
    expect(calculateDays(offsetDate(-2), 'countdown')).toBe(0);
    expect(calculateDays(offsetDate(2), 'elapsed')).toBe(0);
  });
});
