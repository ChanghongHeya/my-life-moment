import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cloud, Download, Lock, Upload } from 'lucide-react';
import type { AppStateV2 } from '@/types';
import type { PendingImport } from '@/hooks/useSync';

type SyncDialogMode = 'export' | 'import';

interface ImportSelectionMeta {
  fileName: string;
  exportedAt: string;
  deviceName: string;
}

interface SyncDialogProps {
  isOpen: boolean;
  mode: SyncDialogMode | null;
  isBusy: boolean;
  error: string | null;
  importSelection: ImportSelectionMeta | null;
  pendingImport: PendingImport | null;
  onClose: () => void;
  onResetImport: () => void;
  onExport: (password: string) => Promise<boolean>;
  onChooseImportFile: () => Promise<ImportSelectionMeta | null>;
  onPrepareImport: (password: string) => Promise<{ nextState: AppStateV2 } | null>;
  onConfirmImport: (nextState: AppStateV2) => boolean;
}

export function SyncDialog({
  isOpen,
  mode,
  isBusy,
  error,
  importSelection,
  pendingImport,
  onClose,
  onResetImport,
  onExport,
  onChooseImportFile,
  onPrepareImport,
  onConfirmImport,
}: SyncDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [preparedState, setPreparedState] = useState<AppStateV2 | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setConfirmPassword('');
      setLocalError(null);
      setPreparedState(null);
    }
  }, [isOpen]);

  const closeDialog = () => {
    setPassword('');
    setConfirmPassword('');
    setLocalError(null);
    setPreparedState(null);
    onResetImport();
    onClose();
  };

  const handleExport = async () => {
    if (password !== confirmPassword) {
      setLocalError('两次输入的同步口令不一致。');
      return;
    }

    const succeeded = await onExport(password);
    if (succeeded) {
      closeDialog();
    }
  };

  const handlePrepareImport = async () => {
    setLocalError(null);
    const result = await onPrepareImport(password);
    if (result) {
      setPreparedState(result.nextState);
    }
  };

  const handleConfirmImport = () => {
    if (!preparedState) {
      setLocalError('请先解密并预览同步内容。');
      return;
    }

    const succeeded = onConfirmImport(preparedState);
    if (succeeded) {
      closeDialog();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && mode && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto glass-card rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mode === 'export' ? '导出同步文件' : '导入同步文件'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {mode === 'export'
                      ? '生成加密同步包后，保存到 iCloud Drive。'
                      : '从 iCloud Drive 读取同步包，解密预览后再覆盖本地数据。'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 text-sm text-gray-600 dark:text-gray-300"
                >
                  关闭
                </button>
              </div>

              <div className="space-y-4">
                {mode === 'export' ? (
                  <>
                    <div className="rounded-2xl bg-sky-50/80 dark:bg-sky-900/20 p-4 text-sm text-sky-800 dark:text-sky-100 space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <Cloud className="w-4 h-4" />
                        手动 iCloud 同步
                      </div>
                      <p>导出的 `.lmsync` 文件请放到 iCloud Drive，另一端导入同一个文件即可同步。</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        同步口令
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="至少 8 个字符"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        再输入一次
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="重复输入同步口令"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={isBusy}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium disabled:opacity-60"
                    >
                      <Download className="w-4 h-4" />
                      {isBusy ? '导出中...' : '导出到 iCloud 文件'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onChooseImportFile}
                      disabled={isBusy}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    >
                      <Upload className="w-4 h-4" />
                      {importSelection ? '重新选择同步文件' : '选择同步文件'}
                    </button>

                    {importSelection && (
                      <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>文件：{importSelection.fileName}</p>
                        <p>来源设备：{importSelection.deviceName}</p>
                        <p>导出时间：{new Date(importSelection.exportedAt).toLocaleString('zh-CN')}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        同步口令
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="输入导出时设置的口令"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePrepareImport}
                      disabled={isBusy || !importSelection}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium disabled:opacity-60"
                    >
                      {isBusy ? '解密中...' : '解密并预览'}
                    </button>

                    {pendingImport && (
                      <div className="rounded-2xl bg-violet-50/80 dark:bg-violet-900/20 p-4 space-y-2">
                        <p className="text-sm font-medium text-violet-800 dark:text-violet-100">
                          即将导入以下内容
                        </p>
                        <p className="text-sm text-violet-700 dark:text-violet-200">
                          资料名：{pendingImport.preview.displayName}
                        </p>
                        <p className="text-sm text-violet-700 dark:text-violet-200">
                          生活事件：{pendingImport.preview.eventCount} 个
                        </p>
                        <p className="text-sm text-violet-700 dark:text-violet-200">
                          学术关注：{pendingImport.preview.favoriteCount} 个
                        </p>
                        <p className="text-sm text-violet-700 dark:text-violet-200">
                          提醒天数：{pendingImport.preview.reminderDays} 天
                        </p>
                        <p className="text-sm text-violet-700 dark:text-violet-200">
                          主题：{pendingImport.preview.theme}
                        </p>

                        <button
                          type="button"
                          onClick={handleConfirmImport}
                          className="w-full mt-3 px-4 py-3 rounded-xl bg-violet-600 text-white font-medium"
                        >
                          确认覆盖并导入
                        </button>
                      </div>
                    )}
                  </>
                )}

                {(localError || error) && (
                  <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-200">
                    {localError || error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
