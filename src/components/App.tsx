import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { CountdownEvent } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { useSync } from '@/hooks/useSync';
import { useDeadlineNotifications, useTabTitleNotification, requestNotificationPermission } from '@/hooks/useNotifications';
import { ALL_CONFERENCES } from '@/data/conferences-extended';
import { UI_EMOJIS } from '@/data/emojis';
import { isLifeProgressEvent } from '@/lib/countdown';
import { useUpdater } from '@/hooks/useUpdater';
import { CountdownList } from './CountdownList';
import { AddEventModal } from './AddEventModal';
import { AcademicMode } from './AcademicMode';
import { LifeProgressCard } from './LifeProgressCard';
import { SyncDialog } from './SyncDialog';

type AppMode = 'personal' | 'academic';
type SyncDialogMode = 'export' | 'import' | null;

function App() {
  const {
    state,
    profile,
    events,
    favorites,
    settings,
    syncMeta,
    isLoaded,
    hasImportSnapshot,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleFavorite,
    updateSettings,
    updateProfile,
    recordExport,
    applyImportedState,
    restoreLastImport,
  } = useAppState();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);
  const [lifeProgressDetailEvent, setLifeProgressDetailEvent] = useState<CountdownEvent | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<AppMode>('personal');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [syncDialogMode, setSyncDialogMode] = useState<SyncDialogMode>(null);

  const {
    isBusy: syncBusy,
    error: syncError,
    selectedImportFile,
    pendingImport,
    clearError: clearSyncError,
    resetImport,
    exportToSyncFile,
    chooseImportFile,
    prepareImport,
    confirmImport,
  } = useSync({
    state,
    onImport: applyImportedState,
    onExportRecorded: recordExport,
  });

  const importSelection = useMemo(() => {
    if (!selectedImportFile) {
      return null;
    }

    return {
      fileName: selectedImportFile.fileName,
      exportedAt: selectedImportFile.syncPackage.exportedAt,
      deviceName: selectedImportFile.syncPackage.deviceName,
    };
  }, [selectedImportFile]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (settings.theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (mode === 'academic') {
      requestNotificationPermission();
    }
  }, [mode]);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setStatusMessage(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  useDeadlineNotifications(favorites, ALL_CONFERENCES, settings.reminderDays);
  useTabTitleNotification(favorites, ALL_CONFERENCES);

  // Hide window on blur with delay to avoid race condition with tray click
  const showTimestamp = useRef(0);
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    const tryHide = () => {
      const elapsed = Date.now() - showTimestamp.current;
      if (elapsed > 500) {
        getCurrentWindow().hide();
      }
    };

    listen<boolean>('window-focus-changed', (event) => {
      if (event.payload) {
        showTimestamp.current = Date.now();
      } else {
        tryHide();
      }
    }).then((fn) => { unlisten = fn; });

    // Fallback: listen to browser blur event (fires when webview loses focus)
    const onBlur = () => tryHide();
    window.addEventListener('blur', onBlur);

    return () => {
      unlisten?.();
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const updater = useUpdater();

  const handleSave = (eventData: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setStatusMessage(`已更新「${eventData.title}」`);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
      setStatusMessage(`已新增「${eventData.title}」`);
    }
  };

  const handleDelete = (eventId: string) => {
    const target = events.find((event) => event.id === eventId);
    deleteEvent(eventId);
    setEditingEvent(null);
    setStatusMessage(target ? `已删除「${target.title}」` : '已删除事件');
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingEvent(null);
  };

  const handleEventClick = (event: CountdownEvent) => {
    if (isLifeProgressEvent(event)) {
      setLifeProgressDetailEvent(event);
      return;
    }

    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleEditLifeProgress = () => {
    if (!lifeProgressDetailEvent) {
      return;
    }

    setEditingEvent(lifeProgressDetailEvent);
    setLifeProgressDetailEvent(null);
    setIsAddModalOpen(true);
  };

  const handleExport = async (password: string) => {
    const result = await exportToSyncFile(password);
    if (result) {
      setStatusMessage(`已导出同步文件：${result.fileName}`);
      return true;
    }
    return false;
  };

  const handlePrepareImport = async (password: string) => {
    const result = await prepareImport(password);
    if (!result) {
      return null;
    }

    return {
      nextState: result.nextState,
    };
  };

  const handleConfirmImport = (nextState: typeof state) => {
    const succeeded = confirmImport(nextState);
    if (succeeded) {
      setStatusMessage('同步内容已导入，本地快照已备份，可随时撤销。');
      return true;
    }
    return false;
  };

  const handleRestoreImport = () => {
    const restored = restoreLastImport();
    if (restored) {
      setStatusMessage('已恢复到导入前的本地快照。');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-50 to-blue-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-6xl"
        >
          {UI_EMOJIS.loading}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-4xl opacity-20"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-20 text-3xl opacity-20"
        >
          💫
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20 text-2xl opacity-20"
        >
          ⭐
        </motion.div>
      </div>

      <div className="relative max-w-md mx-auto h-full glass flex flex-col shadow-2xl rounded-xl overflow-hidden">
        {/* Drag handle for frameless window */}
        <div className="h-2 w-full cursor-grab flex-shrink-0" data-tauri-drag-region="" />

        <header className="px-5 py-3 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0" data-tauri-drag-region="">
          <div className="flex items-center justify-between mb-4">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300 ${
                mode === 'personal'
                  ? 'from-pink-400 to-rose-500'
                  : 'from-violet-400 to-purple-600'
              }`}>
                <span className="text-white text-2xl">
                  {mode === 'personal' ? UI_EMOJIS.heart : UI_EMOJIS.academic}
                </span>
              </div>

              <div>
                <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                  Life Moment
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile.displayName} · {profile.deviceName}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  clearSyncError();
                  setShowSettings((previous) => !previous);
                }}
                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
              >
                <span className="text-lg">{UI_EMOJIS.settings}</span>
              </motion.button>

              {mode === 'personal' && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md flex items-center justify-center"
                >
                  <span className="text-white text-xl">{UI_EMOJIS.add}</span>
                </motion.button>
              )}
            </div>
          </div>

          <div className="flex p-1.5 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-inner">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('personal')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === 'personal'
                  ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{UI_EMOJIS.heart}</span>
              生活
              {events.length > 0 && (
                <span className="ml-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 px-2 py-0.5 rounded-full">
                  {events.length}
                </span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('academic')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === 'academic'
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{UI_EMOJIS.academic}</span>
              学术
              {favorites.length > 0 && (
                <span className="ml-1 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-100"
              >
                {statusMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50 max-h-[50vh] flex-shrink-0"
            >
              <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      显示名称
                    </label>
                    <input
                      type="text"
                      value={profile.displayName}
                      maxLength={24}
                      onChange={(event) => updateProfile({ displayName: event.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      设备名称
                    </label>
                    <input
                      type="text"
                      value={profile.deviceName}
                      maxLength={32}
                      onChange={(event) => updateProfile({ deviceName: event.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {UI_EMOJIS.settings} 主题
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'light', icon: '☀️', label: '浅色' },
                      { value: 'dark', icon: '🌙', label: '深色' },
                      { value: 'auto', icon: '🌓', label: '自动' },
                    ].map(({ value, icon, label }) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateSettings({ theme: value as typeof settings.theme })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                          settings.theme === value
                            ? 'bg-gradient-to-r from-pink-400 to-violet-400 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{icon}</span>
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    学术提醒天数
                  </label>
                  <div className="flex gap-2">
                    {[3, 7, 14].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => updateSettings({ reminderDays: days })}
                        className={`px-4 py-2 rounded-xl text-sm ${
                          settings.reminderDays === days
                            ? 'bg-violet-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {days} 天
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    同步模式
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'manual-icloud', label: '手动 iCloud' },
                      { value: 'local-only', label: '仅本地' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSettings({ syncMode: option.value as typeof settings.syncMode })}
                        className={`px-4 py-2 rounded-xl text-sm ${
                          settings.syncMode === option.value
                            ? 'bg-sky-500 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    同步状态
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    最近导出：{syncMeta.lastExportedAt ? new Date(syncMeta.lastExportedAt).toLocaleString('zh-CN') : '暂无'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    最近导入：{syncMeta.lastImportedAt ? new Date(syncMeta.lastImportedAt).toLocaleString('zh-CN') : '暂无'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    最近来源：{syncMeta.lastImportedFrom ?? '暂无'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    最近文件：{syncMeta.lastSyncFileName ?? '暂无'}
                  </p>
                </div>

                {settings.syncMode === 'manual-icloud' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        clearSyncError();
                        setSyncDialogMode('export');
                      }}
                      className="px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium"
                    >
                      导出到 iCloud
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clearSyncError();
                        setSyncDialogMode('import');
                      }}
                      className="px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium"
                    >
                      导入 iCloud 文件
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    导入前会自动生成本地快照，支持一键回滚。
                  </p>
                  <button
                    type="button"
                    onClick={handleRestoreImport}
                    disabled={!hasImportSnapshot}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                  >
                    撤销上次导入
                  </button>
                </div>

                {syncError && (
                  <p className="text-sm text-red-500 dark:text-red-300">
                    {syncError}
                  </p>
                )}

                <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      应用更新
                    </p>
                    <span className="text-xs text-gray-400">v0.1.0</span>
                  </div>
                  {updater.status === 'available' && updater.info.version && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      发现新版本 v{updater.info.version}
                    </p>
                  )}
                  {updater.status === 'up-to-date' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">已是最新版本</p>
                  )}
                  {updater.status === 'downloading' && (
                    <div className="space-y-1">
                      <p className="text-xs text-blue-500">下载中... {updater.progress}%</p>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${updater.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {updater.status === 'error' && updater.error && (
                    <p className="text-xs text-red-500">{updater.error}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updater.checkForUpdate()}
                      disabled={updater.status === 'checking' || updater.status === 'downloading'}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-medium disabled:opacity-50"
                    >
                      {updater.status === 'checking' ? '检查中...' : '检查更新'}
                    </button>
                    {updater.status === 'available' && (
                      <button
                        type="button"
                        onClick={() => updater.downloadAndInstall()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium"
                      >
                        下载并安装
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 min-h-0 overflow-hidden">
          {mode === 'personal' ? (
            <div className="h-full overflow-y-auto momentum-scroll px-5 py-4">
              <CountdownList events={events} onEventClick={handleEventClick} />
            </div>
          ) : (
            <AcademicMode favorites={favorites} onToggleFavorite={toggleFavorite} />
          )}
        </main>

        <footer className="px-5 py-3 border-t border-gray-200/50 dark:border-gray-700/50 text-center flex-shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
            <span>{settings.syncMode === 'manual-icloud' ? UI_EMOJIS.cloud : UI_EMOJIS.lock}</span>
            {mode === 'personal'
              ? `${events.length} 个生活时刻`
              : `${favorites.length} 个关注会议`}
            <span>·</span>
            <span>{settings.syncMode === 'manual-icloud' ? '手动 iCloud 同步' : '仅本地存储'}</span>
          </p>
        </footer>
      </div>

      <AnimatePresence>
        {lifeProgressDetailEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLifeProgressDetailEvent(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-sm pointer-events-auto space-y-4">
                <div className="glass-card rounded-3xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">人生进度</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">查看时间占比与人生进度</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLifeProgressDetailEvent(null)}
                      className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-800/70 text-sm text-gray-600 dark:text-gray-300"
                    >
                      关闭
                    </button>
                  </div>

                  <LifeProgressCard event={lifeProgressDetailEvent} />

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={handleEditLifeProgress}
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-medium shadow-md"
                    >
                      编辑人生进度
                    </button>
                    <button
                      type="button"
                      onClick={() => setLifeProgressDetailEvent(null)}
                      className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-gray-800/70 text-sm text-gray-600 dark:text-gray-300"
                    >
                      返回
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
        editEvent={editingEvent}
      />

      <SyncDialog
        isOpen={syncDialogMode !== null}
        mode={syncDialogMode}
        isBusy={syncBusy}
        error={syncError}
        importSelection={importSelection}
        pendingImport={pendingImport}
        onClose={() => setSyncDialogMode(null)}
        onResetImport={resetImport}
        onExport={handleExport}
        onChooseImportFile={chooseImportFile}
        onPrepareImport={handlePrepareImport}
        onConfirmImport={handleConfirmImport}
      />
    </div>
  );
}

export default App;
