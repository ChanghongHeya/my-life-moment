import { isStrictAppState } from '@/lib/app-state';
import type { AppStateV2, SyncPackageV1, SyncPreview } from '@/types';

const SYNC_PACKAGE_SCHEMA_VERSION = 1;
const PBKDF2_ITERATIONS = 250_000;
const KEY_LENGTH = 256;
const AES_GCM_IV_BYTES = 12;
const SALT_BYTES = 16;
const REQUIRED_SYNC_KEYS = ['schemaVersion', 'exportedAt', 'deviceName', 'salt', 'iv', 'ciphertext'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(record: Record<string, unknown>, requiredKeys: readonly string[]): boolean {
  const keys = Object.keys(record);
  return keys.length === requiredKeys.length && requiredKeys.every((key) => key in record);
}

type BufferLike = {
  from(input: ArrayBuffer | Uint8Array | string, encoding?: string): { toString(encoding: string): string };
};

function getBuffer(): BufferLike | undefined {
  return (globalThis as { Buffer?: BufferLike }).Buffer;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function encodeBase64(bytes: Uint8Array): string {
  const buffer = getBuffer();
  if (buffer) {
    return buffer.from(toArrayBuffer(bytes)).toString('base64');
  }

  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const buffer = getBuffer();
  if (buffer) {
    const decoded = buffer.from(value, 'base64').toString('binary');
    return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  }

  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function sanitizeDeviceName(deviceName: string): string {
  return deviceName.trim().slice(0, 60) || 'This device';
}

function sanitizePassword(password: string): string {
  return password.trim();
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      iterations: PBKDF2_ITERATIONS,
    },
    passwordKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt'],
  );
}

function assertValidPassword(password: string): string {
  const normalized = sanitizePassword(password);
  if (normalized.length < 8) {
    throw new Error('同步口令至少需要 8 个字符。');
  }
  return normalized;
}

export function buildSyncPreview(state: AppStateV2): SyncPreview {
  return {
    displayName: state.profile.displayName,
    eventCount: state.personal.events.length,
    favoriteCount: state.academic.favorites.length,
    reminderDays: state.settings.reminderDays,
    theme: state.settings.theme,
  };
}

export function createSyncFileName(deviceName: string, exportedAt: string): string {
  const safeDevice = sanitizeDeviceName(deviceName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'device';
  const safeTimestamp = exportedAt.replace(/[:.]/g, '-');
  return `life-moment-${safeDevice}-${safeTimestamp}.lmsync`;
}

export async function createSyncPackage(state: AppStateV2, password: string, deviceName: string): Promise<SyncPackageV1> {
  const normalizedPassword = assertValidPassword(password);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_BYTES));
  const key = await deriveKey(normalizedPassword, salt);
  const exportedAt = new Date().toISOString();
  const plaintext = new TextEncoder().encode(JSON.stringify(state));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: toArrayBuffer(iv) }, key, plaintext);

  return {
    schemaVersion: SYNC_PACKAGE_SCHEMA_VERSION,
    exportedAt,
    deviceName: sanitizeDeviceName(deviceName),
    salt: encodeBase64(salt),
    iv: encodeBase64(iv),
    ciphertext: encodeBase64(new Uint8Array(ciphertext)),
  };
}

export function parseSyncPackageText(text: string): SyncPackageV1 {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('同步文件不是有效的 JSON。');
  }

  if (!isRecord(parsed) || !hasExactKeys(parsed, REQUIRED_SYNC_KEYS)) {
    throw new Error('同步文件结构不受支持。');
  }

  if (parsed.schemaVersion !== SYNC_PACKAGE_SCHEMA_VERSION) {
    throw new Error('同步文件版本不兼容。');
  }

  if (
    typeof parsed.exportedAt !== 'string'
    || Number.isNaN(new Date(parsed.exportedAt).getTime())
    || typeof parsed.deviceName !== 'string'
    || typeof parsed.salt !== 'string'
    || typeof parsed.iv !== 'string'
    || typeof parsed.ciphertext !== 'string'
  ) {
    throw new Error('同步文件字段格式无效。');
  }

  return {
    schemaVersion: parsed.schemaVersion,
    exportedAt: parsed.exportedAt,
    deviceName: parsed.deviceName,
    salt: parsed.salt,
    iv: parsed.iv,
    ciphertext: parsed.ciphertext,
  };
}

export async function decryptSyncPackage(syncPackage: SyncPackageV1, password: string): Promise<{ state: AppStateV2; preview: SyncPreview }> {
  const normalizedPassword = assertValidPassword(password);

  try {
    const salt = decodeBase64(syncPackage.salt);
    const iv = decodeBase64(syncPackage.iv);
    const ciphertext = decodeBase64(syncPackage.ciphertext);
    const key = await deriveKey(normalizedPassword, salt);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(iv) },
      key,
      toArrayBuffer(ciphertext),
    );
    const decoded = new TextDecoder().decode(plaintext);
    const parsed: unknown = JSON.parse(decoded);

    if (!isStrictAppState(parsed)) {
      throw new Error('同步数据字段异常。');
    }

    return {
      state: parsed,
      preview: buildSyncPreview(parsed),
    };
  } catch (error) {
    if (error instanceof Error && error.message === '同步数据字段异常。') {
      throw error;
    }

    throw new Error('口令错误，或者同步文件已损坏。');
  }
}
