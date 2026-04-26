import { describe, expect, it } from 'vitest';
import { createDefaultAppState, isStrictAppState, migrateLegacyStorage, sanitizeAppState } from '@/lib/app-state';

describe('app state migration', () => {
  it('migrates legacy localStorage records into AppStateV2', () => {
    const migrated = migrateLegacyStorage({
      legacyAppData: JSON.stringify({
        events: [
          {
            id: 'legacy-1',
            title: '博士毕业',
            date: '2024-06-30',
            type: 'elapsed',
            icon: '🎓',
            color: '#0ea5e9',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        settings: {
          theme: 'dark',
          syncEnabled: true,
        },
      }),
      legacyFavorites: JSON.stringify(['cvpr', 'icml', 'cvpr']),
      legacyCurrentUser: JSON.stringify({
        id: 'default',
        name: 'He',
      }),
    }, { deviceName: 'My Mac' });

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.profile.displayName).toBe('He');
    expect(migrated.profile.deviceName).toBe('My Mac');
    expect(migrated.personal.events).toHaveLength(1);
    expect(migrated.academic.favorites).toEqual(['cvpr', 'icml']);
    expect(migrated.settings.theme).toBe('dark');
    expect(migrated.settings.syncMode).toBe('manual-icloud');
  });

  it('sanitizes malformed app state back to safe defaults', () => {
    const sanitized = sanitizeAppState({
      schemaVersion: 99,
      profile: {
        displayName: '',
        deviceName: '',
      },
      personal: {
        events: [{ title: 'broken' }],
      },
      academic: {
        favorites: ['cvpr', '', 'cvpr'],
      },
      settings: {
        theme: 'neon',
        reminderDays: 999,
        syncMode: 'mystery',
      },
      syncMeta: {
        lastImportedAt: 'invalid',
      },
    }, {
      displayName: 'Fallback',
      deviceName: 'Fallback Device',
    });

    expect(sanitized.profile.displayName).toBe('Fallback');
    expect(sanitized.profile.deviceName).toBe('Fallback Device');
    expect(sanitized.personal.events.length).toBeGreaterThan(0);
    expect(sanitized.academic.favorites).toEqual(['cvpr']);
    expect(sanitized.settings.theme).toBe('auto');
    expect(sanitized.settings.reminderDays).toBe(30);
    expect(sanitized.settings.syncMode).toBe('manual-icloud');
  });

  it('recognizes strict app state payloads and rejects extra fields', () => {
    const strictState = createDefaultAppState({ displayName: 'Tester', deviceName: 'My iPhone' });
    expect(isStrictAppState(strictState)).toBe(true);
    expect(isStrictAppState({
      ...strictState,
      profile: {
        ...strictState.profile,
        extra: 'field',
      },
    })).toBe(false);
  });
});
