import { webcrypto } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import { createDefaultAppState } from '@/lib/app-state';
import { createSyncPackage, decryptSyncPackage, parseSyncPackageText } from '@/lib/sync';

beforeAll(() => {
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, 'crypto', {
      value: webcrypto,
      configurable: true,
    });
  }
});

describe('sync package crypto', () => {
  it('round-trips an encrypted sync package', async () => {
    const state = createDefaultAppState({
      displayName: 'He',
      deviceName: 'My Mac',
    });
    const syncPackage = await createSyncPackage(state, 'strong-passphrase', state.profile.deviceName);
    const serialized = JSON.stringify(syncPackage);

    const parsed = parseSyncPackageText(serialized);
    const decrypted = await decryptSyncPackage(parsed, 'strong-passphrase');

    expect(decrypted.state.profile.displayName).toBe('He');
    expect(decrypted.state.profile.deviceName).toBe('My Mac');
    expect(decrypted.preview.eventCount).toBe(state.personal.events.length);
  });

  it('rejects the wrong password', async () => {
    const state = createDefaultAppState();
    const syncPackage = await createSyncPackage(state, 'strong-passphrase', state.profile.deviceName);

    await expect(decryptSyncPackage(syncPackage, 'wrong-passphrase')).rejects.toThrow(/口令错误/);
  });

  it('rejects tampered ciphertext', async () => {
    const state = createDefaultAppState();
    const syncPackage = await createSyncPackage(state, 'strong-passphrase', state.profile.deviceName);
    const tampered = {
      ...syncPackage,
      ciphertext: `${syncPackage.ciphertext.slice(0, -4)}AAAA`,
    };

    await expect(decryptSyncPackage(tampered, 'strong-passphrase')).rejects.toThrow(/损坏/);
  });
});
