import { useState, useCallback } from 'react';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'up-to-date' | 'error';

interface UpdateInfo {
  version?: string;
  body?: string;
}

export function useUpdater() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [info, setInfo] = useState<UpdateInfo>({});
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const checkForUpdate = useCallback(async () => {
    setStatus('checking');
    setError(null);
    setInfo({});

    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();

      if (update) {
        setInfo({ version: update.version, body: update.body ?? '' });
        setStatus('available');
        return update;
      }

      setStatus('up-to-date');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
      return null;
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    setStatus('checking');
    setError(null);

    try {
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();

      if (!update) {
        setStatus('up-to-date');
        return;
      }

      setStatus('downloading');
      let totalBytes = 0;
      let downloadedBytes = 0;

      await update.downloadAndInstall((event) => {
        if (event.event === 'Started' && event.data.contentLength) {
          totalBytes = event.data.contentLength;
        } else if (event.event === 'Progress') {
          downloadedBytes += event.data.chunkLength;
          if (totalBytes > 0) {
            setProgress(Math.round((downloadedBytes / totalBytes) * 100));
          }
        }
      });

      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, []);

  return { status, info, error, progress, checkForUpdate, downloadAndInstall };
}
