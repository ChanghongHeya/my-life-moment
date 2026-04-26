import { isTauri } from '@tauri-apps/api/core';
import { useCallback, useState } from 'react';
import { createSyncFileName, createSyncPackage, decryptSyncPackage, parseSyncPackageText } from '@/lib/sync';
import type { AppStateV2, SyncPackageV1, SyncPreview } from '@/types';

interface UseSyncOptions {
  state: AppStateV2;
  onImport: (nextState: AppStateV2, source: { deviceName: string; fileName: string }) => void;
  onExportRecorded: (fileName: string, exportedAt: string) => void;
}

interface SelectedImportFile {
  fileName: string;
  syncPackage: SyncPackageV1;
}

export interface PendingImport {
  fileName: string;
  exportedAt: string;
  deviceName: string;
  preview: SyncPreview;
}

function downloadInBrowser(fileName: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function pickFileInBrowser(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.lmsync,application/json';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

function getFileNameFromPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.split('/').pop() ?? 'life-moment-sync.lmsync';
}

export function useSync({ state, onImport, onExportRecorded }: UseSyncOptions) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImportFile, setSelectedImportFile] = useState<SelectedImportFile | null>(null);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetImport = useCallback(() => {
    setSelectedImportFile(null);
    setPendingImport(null);
    setError(null);
  }, []);

  const exportToSyncFile = useCallback(async (password: string) => {
    setIsBusy(true);
    setError(null);

    try {
      const syncPackage = await createSyncPackage(state, password, state.profile.deviceName);
      const fileName = createSyncFileName(syncPackage.deviceName, syncPackage.exportedAt);
      const serialized = JSON.stringify(syncPackage, null, 2);

      if (isTauri()) {
        const [{ save }, fs] = await Promise.all([
          import('@tauri-apps/plugin-dialog'),
          import('@tauri-apps/plugin-fs'),
        ]);

        const selectedPath = await save({
          defaultPath: fileName,
          filters: [{ name: 'Life Moment Sync', extensions: ['lmsync'] }],
        });

        if (!selectedPath) {
          return null;
        }

        await fs.startAccessingSecurityScopedResource(selectedPath);
        try {
          await fs.writeTextFile(selectedPath, serialized);
        } finally {
          await fs.stopAccessingSecurityScopedResource(selectedPath);
        }

        onExportRecorded(getFileNameFromPath(selectedPath), syncPackage.exportedAt);
        return { fileName: getFileNameFromPath(selectedPath), exportedAt: syncPackage.exportedAt };
      }

      downloadInBrowser(fileName, serialized);
      onExportRecorded(fileName, syncPackage.exportedAt);
      return { fileName, exportedAt: syncPackage.exportedAt };
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '导出同步文件失败。';
      setError(message);
      return null;
    } finally {
      setIsBusy(false);
    }
  }, [onExportRecorded, state]);

  const chooseImportFile = useCallback(async () => {
    setIsBusy(true);
    setError(null);
    setPendingImport(null);

    try {
      let fileName = '';
      let contents = '';

      if (isTauri()) {
        const [{ open }, fs] = await Promise.all([
          import('@tauri-apps/plugin-dialog'),
          import('@tauri-apps/plugin-fs'),
        ]);

        const selectedPath = await open({
          multiple: false,
          filters: [{ name: 'Life Moment Sync', extensions: ['lmsync', 'json'] }],
        });

        if (!selectedPath || Array.isArray(selectedPath)) {
          return null;
        }

        await fs.startAccessingSecurityScopedResource(selectedPath);
        try {
          contents = await fs.readTextFile(selectedPath);
        } finally {
          await fs.stopAccessingSecurityScopedResource(selectedPath);
        }

        fileName = getFileNameFromPath(selectedPath);
      } else {
        const file = await pickFileInBrowser();
        if (!file) {
          return null;
        }

        fileName = file.name;
        contents = await file.text();
      }

      const syncPackage = parseSyncPackageText(contents);
      setSelectedImportFile({ fileName, syncPackage });

      return {
        fileName,
        exportedAt: syncPackage.exportedAt,
        deviceName: syncPackage.deviceName,
      };
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '读取同步文件失败。';
      setError(message);
      return null;
    } finally {
      setIsBusy(false);
    }
  }, []);

  const prepareImport = useCallback(async (password: string) => {
    if (!selectedImportFile) {
      setError('请先选择同步文件。');
      return null;
    }

    setIsBusy(true);
    setError(null);

    try {
      const { state: decryptedState, preview } = await decryptSyncPackage(selectedImportFile.syncPackage, password);
      setPendingImport({
        fileName: selectedImportFile.fileName,
        exportedAt: selectedImportFile.syncPackage.exportedAt,
        deviceName: selectedImportFile.syncPackage.deviceName,
        preview,
      });

      return {
        nextState: decryptedState,
        preview,
      };
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '解密同步文件失败。';
      setError(message);
      return null;
    } finally {
      setIsBusy(false);
    }
  }, [selectedImportFile]);

  const confirmImport = useCallback((nextState: AppStateV2) => {
    if (!pendingImport) {
      setError('还没有可导入的同步内容。');
      return false;
    }

    onImport(nextState, {
      deviceName: pendingImport.deviceName,
      fileName: pendingImport.fileName,
    });
    setSelectedImportFile(null);
    setPendingImport(null);
    setError(null);
    return true;
  }, [onImport, pendingImport]);

  return {
    isBusy,
    error,
    selectedImportFile,
    pendingImport,
    clearError,
    resetImport,
    exportToSyncFile,
    chooseImportFile,
    prepareImport,
    confirmImport,
  };
}
