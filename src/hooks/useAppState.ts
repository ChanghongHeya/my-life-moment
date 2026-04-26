import { useCallback, useEffect, useState } from 'react';
import {
  APP_STATE_STORAGE_KEY,
  IMPORT_SNAPSHOT_STORAGE_KEY,
  LEGACY_STORAGE_KEYS,
  clearLegacyStorage,
  createDefaultAppState,
  migrateLegacyStorage,
  readImportSnapshot,
  sanitizeAppState,
} from '@/lib/app-state';
import type { AppStateV2, CountdownEvent, ImportSnapshot, SyncMeta, UserProfile } from '@/types';

interface ApplyImportSource {
  deviceName: string;
  fileName: string;
}

function readLegacyState(): { state: AppStateV2; migrated: boolean } {
  const currentUserRaw = localStorage.getItem(LEGACY_STORAGE_KEYS.currentUser);
  let currentUser: { id?: string; name?: string } | null = null;

  if (currentUserRaw) {
    try {
      currentUser = JSON.parse(currentUserRaw) as { id?: string; name?: string };
    } catch {
      currentUser = null;
    }
  }

  const userId = typeof currentUser?.id === 'string' ? currentUser.id : 'default';

  const state = migrateLegacyStorage({
    v2State: localStorage.getItem(APP_STATE_STORAGE_KEY),
    legacyAppData: localStorage.getItem(LEGACY_STORAGE_KEYS.appData),
    legacyUserAppData: localStorage.getItem(`${LEGACY_STORAGE_KEYS.appData}-${userId}`),
    legacyFavorites: localStorage.getItem(`${LEGACY_STORAGE_KEYS.favorites}-${userId}`) ?? localStorage.getItem(LEGACY_STORAGE_KEYS.favorites),
    legacyCurrentUser: currentUserRaw,
  });

  return {
    state,
    migrated: !localStorage.getItem(APP_STATE_STORAGE_KEY),
  };
}

function updateSyncMetaValue(previous: AppStateV2, updates: SyncMeta): AppStateV2 {
  return {
    ...previous,
    syncMeta: {
      ...previous.syncMeta,
      ...updates,
    },
  };
}

export function useAppState() {
  const [state, setState] = useState<AppStateV2>(() => createDefaultAppState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [importSnapshot, setImportSnapshot] = useState<ImportSnapshot | null>(null);

  useEffect(() => {
    const { state: loadedState, migrated } = readLegacyState();
    const snapshot = readImportSnapshot(localStorage.getItem(IMPORT_SNAPSHOT_STORAGE_KEY));

    setState(loadedState);
    setImportSnapshot(snapshot);
    setIsLoaded(true);

    if (migrated) {
      clearLegacyStorage(localStorage);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  }, [isLoaded, state]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState((previous) => ({
      ...previous,
      profile: {
        displayName: typeof updates.displayName === 'string' && updates.displayName.trim()
          ? updates.displayName.trim()
          : previous.profile.displayName,
        deviceName: typeof updates.deviceName === 'string' && updates.deviceName.trim()
          ? updates.deviceName.trim()
          : previous.profile.deviceName,
      },
    }));
  }, []);

  const addEvent = useCallback((event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newEvent: CountdownEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setState((previous) => ({
      ...previous,
      personal: {
        events: [...previous.personal.events, newEvent],
      },
    }));

    return newEvent.id;
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<CountdownEvent>) => {
    setState((previous) => ({
      ...previous,
      personal: {
        events: previous.personal.events.map((event) => (
          event.id === eventId
            ? {
                ...event,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : event
        )),
      },
    }));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setState((previous) => ({
      ...previous,
      personal: {
        events: previous.personal.events.filter((event) => event.id !== eventId),
      },
    }));
  }, []);

  const toggleFavorite = useCallback((conferenceId: string) => {
    setState((previous) => {
      const alreadySaved = previous.academic.favorites.includes(conferenceId);
      return {
        ...previous,
        academic: {
          favorites: alreadySaved
            ? previous.academic.favorites.filter((favorite) => favorite !== conferenceId)
            : [...previous.academic.favorites, conferenceId],
        },
      };
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<AppStateV2['settings']>) => {
    setState((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        ...updates,
      },
    }));
  }, []);

  const recordExport = useCallback((fileName: string, exportedAt: string) => {
    setState((previous) => updateSyncMetaValue(previous, {
      lastExportedAt: exportedAt,
      lastSyncFileName: fileName,
    }));
  }, []);

  const applyImportedState = useCallback((nextState: AppStateV2, source: ApplyImportSource) => {
    const snapshot: ImportSnapshot = {
      createdAt: new Date().toISOString(),
      state,
    };

    localStorage.setItem(IMPORT_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
    setImportSnapshot(snapshot);

    setState((previous) => sanitizeAppState({
      ...nextState,
      profile: {
        ...nextState.profile,
        deviceName: previous.profile.deviceName,
      },
      syncMeta: {
        ...nextState.syncMeta,
        lastImportedAt: new Date().toISOString(),
        lastImportedFrom: source.deviceName,
        lastSyncFileName: source.fileName,
        lastSnapshotAt: snapshot.createdAt,
      },
    }, previous.profile));
  }, [state]);

  const restoreLastImport = useCallback(() => {
    if (!importSnapshot) {
      return false;
    }

    setState(sanitizeAppState(importSnapshot.state, state.profile));
    localStorage.removeItem(IMPORT_SNAPSHOT_STORAGE_KEY);
    setImportSnapshot(null);
    return true;
  }, [importSnapshot, state.profile]);

  return {
    state,
    isLoaded,
    profile: state.profile,
    events: state.personal.events,
    favorites: state.academic.favorites,
    settings: state.settings,
    syncMeta: state.syncMeta,
    hasImportSnapshot: importSnapshot !== null,
    importSnapshot,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleFavorite,
    updateSettings,
    updateProfile,
    recordExport,
    applyImportedState,
    restoreLastImport,
  };
}
