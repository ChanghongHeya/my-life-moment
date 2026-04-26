import type {
  AppStateV2,
  CountdownEvent,
  CountdownType,
  ImportSnapshot,
  SyncMeta,
  SyncMode,
  ThemeMode,
  UserProfile,
} from '@/types';

export const APP_STATE_STORAGE_KEY = 'life-moment-state-v2';
export const IMPORT_SNAPSHOT_STORAGE_KEY = 'life-moment-import-snapshot-v1';

export const LEGACY_STORAGE_KEYS = {
  appData: 'life-moment-data',
  users: 'life-moment-users',
  currentUser: 'life-moment-current-user',
  favorites: 'life-moment-favorites',
} as const;

export interface LegacyStorageSource {
  v2State?: string | null;
  legacyAppData?: string | null;
  legacyUserAppData?: string | null;
  legacyFavorites?: string | null;
  legacyCurrentUser?: string | null;
}

const DEFAULT_DISPLAY_NAME = '我的 Life Moment';
const DEFAULT_DEVICE_NAME = 'This device';
const REQUIRED_TOP_LEVEL_KEYS = ['schemaVersion', 'profile', 'personal', 'academic', 'settings', 'syncMeta'] as const;
const REQUIRED_PROFILE_KEYS = ['displayName', 'deviceName'] as const;
const REQUIRED_SETTINGS_KEYS = ['theme', 'reminderDays', 'syncMode'] as const;
const REQUIRED_PERSONAL_KEYS = ['events'] as const;
const REQUIRED_ACADEMIC_KEYS = ['favorites'] as const;
const ALLOWED_SYNC_META_KEYS = ['lastExportedAt', 'lastImportedAt', 'lastImportedFrom', 'lastSyncFileName', 'lastSnapshotAt'] as const;
const REQUIRED_EVENT_KEYS = ['id', 'title', 'date', 'type', 'icon', 'color', 'createdAt', 'updatedAt'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(raw: string | null | undefined): unknown {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function stringOrFallback(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function createUuid(): string {
  return globalThis.crypto?.randomUUID?.() ?? `life-moment-${Date.now()}`;
}

function detectPlatformName(userAgent: string): string {
  if (/iphone/i.test(userAgent)) {
    return 'My iPhone';
  }
  if (/ipad/i.test(userAgent)) {
    return 'My iPad';
  }
  if (/mac/i.test(userAgent)) {
    return 'My Mac';
  }
  return DEFAULT_DEVICE_NAME;
}

export function detectDefaultDeviceName(): string {
  if (typeof navigator === 'undefined') {
    return DEFAULT_DEVICE_NAME;
  }

  return detectPlatformName(navigator.userAgent);
}

function normalizeTheme(value: unknown): ThemeMode {
  return value === 'light' || value === 'dark' || value === 'auto' ? value : 'auto';
}

function normalizeSyncMode(value: unknown): SyncMode {
  return value === 'local-only' ? 'local-only' : 'manual-icloud';
}

function normalizeReminderDays(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 7;
  }

  return Math.min(Math.max(Math.round(value), 1), 30);
}

function normalizeSyncMeta(value: unknown): SyncMeta {
  if (!isRecord(value)) {
    return {};
  }

  const nextMeta: SyncMeta = {};

  for (const key of ALLOWED_SYNC_META_KEYS) {
    const candidate = value[key];
    if (typeof candidate === 'string' && candidate.trim()) {
      nextMeta[key] = candidate;
    }
  }

  return nextMeta;
}

function normalizeCountdownType(value: unknown): CountdownType {
  return value === 'countdown' ? 'countdown' : 'elapsed';
}

function normalizeDate(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString().split('T')[0];
}

function normalizeEvent(value: unknown, fallbackDate: string): CountdownEvent | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = stringOrFallback(value.title, '');
  if (!title) {
    return null;
  }

  const createdAt = stringOrFallback(value.createdAt, new Date().toISOString());
  const updatedAt = stringOrFallback(value.updatedAt, createdAt);

  return {
    id: stringOrFallback(value.id, createUuid()),
    title,
    date: normalizeDate(value.date, fallbackDate),
    type: normalizeCountdownType(value.type),
    icon: stringOrFallback(value.icon, '❤️'),
    color: stringOrFallback(value.color, '#ff6b6b'),
    createdAt,
    updatedAt,
  };
}

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.trim()),
    ),
  );
}

export function createDefaultEvents(referenceDate = new Date()): CountdownEvent[] {
  const nowIso = referenceDate.toISOString();
  const currentYear = referenceDate.getFullYear();

  return [
    {
      id: createUuid(),
      title: '在一起',
      date: new Date(currentYear, 0, 1).toISOString().split('T')[0],
      type: 'elapsed',
      icon: '❤️',
      color: '#ff6b6b',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createUuid(),
      title: '人生进度',
      date: new Date(currentYear - 23, 0, 1).toISOString().split('T')[0],
      type: 'elapsed',
      icon: '🌱',
      color: '#10b981',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];
}

export function createDefaultProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    displayName: stringOrFallback(overrides.displayName, DEFAULT_DISPLAY_NAME),
    deviceName: stringOrFallback(overrides.deviceName, detectDefaultDeviceName()),
  };
}

export function createDefaultAppState(overrides: Partial<UserProfile> = {}): AppStateV2 {
  return {
    schemaVersion: 2,
    profile: createDefaultProfile(overrides),
    personal: {
      events: createDefaultEvents(),
    },
    academic: {
      favorites: [],
    },
    settings: {
      theme: 'auto',
      reminderDays: 7,
      syncMode: 'manual-icloud',
    },
    syncMeta: {},
  };
}

function normalizeStateWithFallback(input: unknown, fallbackProfile: Partial<UserProfile>): AppStateV2 {
  const defaults = createDefaultAppState(fallbackProfile);
  const fallbackDate = new Date().toISOString().split('T')[0];

  if (!isRecord(input)) {
    return defaults;
  }

  const eventsSource = isRecord(input.personal) ? input.personal.events : undefined;
  const normalizedEvents = Array.isArray(eventsSource)
    ? eventsSource
        .map((event) => normalizeEvent(event, fallbackDate))
        .filter((event): event is CountdownEvent => event !== null)
    : defaults.personal.events;

  return {
    schemaVersion: 2,
    profile: {
      displayName: stringOrFallback(isRecord(input.profile) ? input.profile.displayName : undefined, defaults.profile.displayName),
      deviceName: stringOrFallback(isRecord(input.profile) ? input.profile.deviceName : undefined, defaults.profile.deviceName),
    },
    personal: {
      events: normalizedEvents.length > 0 ? normalizedEvents : defaults.personal.events,
    },
    academic: {
      favorites: uniqueStrings(isRecord(input.academic) ? input.academic.favorites : undefined),
    },
    settings: {
      theme: normalizeTheme(isRecord(input.settings) ? input.settings.theme : undefined),
      reminderDays: normalizeReminderDays(isRecord(input.settings) ? input.settings.reminderDays : undefined),
      syncMode: normalizeSyncMode(isRecord(input.settings) ? input.settings.syncMode : undefined),
    },
    syncMeta: normalizeSyncMeta(input.syncMeta),
  };
}

export function sanitizeAppState(input: unknown, fallbackProfile: Partial<UserProfile> = {}): AppStateV2 {
  return normalizeStateWithFallback(input, fallbackProfile);
}

export function migrateLegacyStorage(source: LegacyStorageSource, fallbackProfile: Partial<UserProfile> = {}): AppStateV2 {
  const currentUser = parseJson(source.legacyCurrentUser);
  const profileFallback = {
    ...fallbackProfile,
    displayName: stringOrFallback(isRecord(currentUser) ? currentUser.name : undefined, fallbackProfile.displayName ?? DEFAULT_DISPLAY_NAME),
    deviceName: stringOrFallback(fallbackProfile.deviceName, detectDefaultDeviceName()),
  };

  if (source.v2State) {
    return sanitizeAppState(parseJson(source.v2State), profileFallback);
  }

  const defaults = createDefaultAppState(profileFallback);
  const legacyData = parseJson(source.legacyUserAppData ?? source.legacyAppData);
  const fallbackDate = new Date().toISOString().split('T')[0];
  const legacyEvents = isRecord(legacyData) && Array.isArray(legacyData.events)
    ? legacyData.events
        .map((event) => normalizeEvent(event, fallbackDate))
        .filter((event): event is CountdownEvent => event !== null)
    : defaults.personal.events;

  const settingsSource = isRecord(legacyData) && isRecord(legacyData.settings) ? legacyData.settings : null;
  const favorites = uniqueStrings(parseJson(source.legacyFavorites));

  return {
    schemaVersion: 2,
    profile: defaults.profile,
    personal: {
      events: legacyEvents.length > 0 ? legacyEvents : defaults.personal.events,
    },
    academic: {
      favorites,
    },
    settings: {
      theme: normalizeTheme(settingsSource?.theme),
      reminderDays: 7,
      syncMode: settingsSource?.syncEnabled === false ? 'local-only' : 'manual-icloud',
    },
    syncMeta: {},
  };
}

function hasExactKeys(record: Record<string, unknown>, requiredKeys: readonly string[], optionalKeys: readonly string[] = []): boolean {
  const allAllowed = new Set([...requiredKeys, ...optionalKeys]);
  const keys = Object.keys(record);

  if (keys.length < requiredKeys.length) {
    return false;
  }

  return requiredKeys.every((key) => key in record) && keys.every((key) => allAllowed.has(key));
}

function isValidDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime());
}

function isStrictEvent(value: unknown): value is CountdownEvent {
  return isRecord(value)
    && hasExactKeys(value, REQUIRED_EVENT_KEYS)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && isValidDateString(value.date)
    && (value.type === 'countdown' || value.type === 'elapsed')
    && typeof value.icon === 'string'
    && typeof value.color === 'string'
    && isValidDateString(value.createdAt)
    && isValidDateString(value.updatedAt);
}

export function isStrictAppState(input: unknown): input is AppStateV2 {
  if (!isRecord(input) || !hasExactKeys(input, REQUIRED_TOP_LEVEL_KEYS)) {
    return false;
  }

  if (input.schemaVersion !== 2) {
    return false;
  }

  if (!isRecord(input.profile) || !hasExactKeys(input.profile, REQUIRED_PROFILE_KEYS)) {
    return false;
  }

  if (typeof input.profile.displayName !== 'string' || typeof input.profile.deviceName !== 'string') {
    return false;
  }

  if (!isRecord(input.personal) || !hasExactKeys(input.personal, REQUIRED_PERSONAL_KEYS) || !Array.isArray(input.personal.events)) {
    return false;
  }

  if (!input.personal.events.every(isStrictEvent)) {
    return false;
  }

  if (!isRecord(input.academic) || !hasExactKeys(input.academic, REQUIRED_ACADEMIC_KEYS) || !Array.isArray(input.academic.favorites)) {
    return false;
  }

  if (!input.academic.favorites.every((value) => typeof value === 'string')) {
    return false;
  }

  if (!isRecord(input.settings) || !hasExactKeys(input.settings, REQUIRED_SETTINGS_KEYS)) {
    return false;
  }

  if (!['light', 'dark', 'auto'].includes(input.settings.theme as string)) {
    return false;
  }

  if (typeof input.settings.reminderDays !== 'number' || input.settings.reminderDays < 1 || input.settings.reminderDays > 30) {
    return false;
  }

  if (!['manual-icloud', 'local-only'].includes(input.settings.syncMode as string)) {
    return false;
  }

  if (!isRecord(input.syncMeta) || !hasExactKeys(input.syncMeta, [], ALLOWED_SYNC_META_KEYS)) {
    return false;
  }

  return Object.values(input.syncMeta).every((value) => value === undefined || typeof value === 'string');
}

export function readImportSnapshot(raw: string | null | undefined): ImportSnapshot | null {
  const parsed = parseJson(raw);
  if (!isRecord(parsed) || !hasExactKeys(parsed, ['createdAt', 'state'])) {
    return null;
  }

  if (!isValidDateString(parsed.createdAt) || !isStrictAppState(parsed.state)) {
    return null;
  }

  return {
    createdAt: parsed.createdAt,
    state: parsed.state,
  };
}

export function clearLegacyStorage(storage: Storage): void {
  const currentUser = parseJson(storage.getItem(LEGACY_STORAGE_KEYS.currentUser));
  const userId = isRecord(currentUser) && typeof currentUser.id === 'string' ? currentUser.id : 'default';

  storage.removeItem(LEGACY_STORAGE_KEYS.appData);
  storage.removeItem(LEGACY_STORAGE_KEYS.users);
  storage.removeItem(LEGACY_STORAGE_KEYS.currentUser);
  storage.removeItem(LEGACY_STORAGE_KEYS.favorites);
  storage.removeItem(`${LEGACY_STORAGE_KEYS.appData}-${userId}`);
  storage.removeItem(`${LEGACY_STORAGE_KEYS.favorites}-${userId}`);
}
