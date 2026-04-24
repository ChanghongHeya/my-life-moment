import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountdownEvent } from '@/types';
import { useCountdowns } from '@/hooks/useCountdowns';
import { useUser } from '@/hooks/useUser';
import { useDeadlineNotifications, useTabTitleNotification, requestNotificationPermission } from '@/hooks/useNotifications';
import { ALL_CONFERENCES } from '@/data/conferences-extended';
import { UI_EMOJIS } from '@/data/emojis';
import { CountdownList } from './CountdownList';
import { AddEventModal } from './AddEventModal';
import { AcademicMode } from './AcademicMode';
import { UserSwitcher } from './UserSwitcher';

type AppMode = 'personal' | 'academic';

function App() {
  const {
    events,
    settings,
    isLoaded: countdownsLoaded,
    addEvent,
    updateEvent,
    updateSettings,
  } = useCountdowns();

  const {
    users,
    currentUser,
    isLoaded: userLoaded,
    createUser,
    switchUser,
    deleteUser,
    updateUser,
    getUserStorageKey,
  } = useUser();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CountdownEvent | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mode, setMode] = useState<AppMode>('personal');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState(settings.theme);

  // Load favorites for current user
  useEffect(() => {
    if (currentUser) {
      const key = getUserStorageKey('life-moment-favorites');
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load favorites:', e);
        }
      } else {
        setFavorites([]);
      }
    }
  }, [currentUser, getUserStorageKey]);

  // Save favorites for current user
  useEffect(() => {
    if (currentUser) {
      const key = getUserStorageKey('life-moment-favorites');
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }, [favorites, currentUser, getUserStorageKey]);

  // Sync theme with settings
  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Request notification permission when entering academic mode
  useEffect(() => {
    if (mode === 'academic') {
      requestNotificationPermission();
    }
  }, [mode]);

  // Deadline notifications
  useDeadlineNotifications(favorites, ALL_CONFERENCES, 7);
  useTabTitleNotification(favorites, ALL_CONFERENCES);

  const handleEdit = (event: CountdownEvent) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleSave = (eventData: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingEvent(null);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    );
  };

  if (!countdownsLoaded || !userLoaded || !currentUser) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Elements */}
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

      <div className="relative max-w-md mx-auto min-h-screen glass flex flex-col shadow-2xl">
        {/* Header */}
        <header className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
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
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {currentUser.avatar} {currentUser.name}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              {/* User Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-xl"
              >
                {currentUser.avatar}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
              >
                <span className="text-lg">{UI_EMOJIS.settings}</span>
              </motion.button>

              {mode === 'personal' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md flex items-center justify-center"
                >
                  <span className="text-white text-xl">{UI_EMOJIS.add}</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mode Switcher with Emoji */}
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
        </header>

        {/* User Menu Panel */}
        <AnimatePresence>
          {showUserMenu && (
            <UserSwitcher
              users={users}
              currentUser={currentUser}
              onSwitch={switchUser}
              onCreate={createUser}
              onDelete={deleteUser}
              onUpdate={updateUser}
              onClose={() => setShowUserMenu(false)}
            />
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    {UI_EMOJIS.settings} 主题设置
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'light', icon: '☀️', label: '浅色' },
                      { value: 'dark', icon: '🌙', label: '深色' },
                      { value: 'auto', icon: '🌓', label: '自动' },
                    ].map(({ value, icon, label }) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateSettings({ theme: value as any })}
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

                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{UI_EMOJIS.cloud}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">iCloud 同步</span>
                  </div>
                  <button
                    onClick={() => updateSettings({ syncEnabled: !settings.syncEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      settings.syncEnabled ? 'bg-gradient-to-r from-pink-400 to-violet-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <motion.span
                      animate={{ x: settings.syncEnabled ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto momentum-scroll">
          {mode === 'personal' ? (
            <div className="px-5 py-4">
              <CountdownList
                events={events}
                onEventClick={handleEdit}
              />
            </div>
          ) : (
            <AcademicMode
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="px-5 py-3 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
            <span>{UI_EMOJIS.heart}</span>
            {mode === 'personal'
              ? `${events.length} 个美好时刻`
              : `${favorites.length} 个关注会议`
            }
            <span>·</span>
            <span>{UI_EMOJIS.lock} 本地存储</span>
          </p>
        </footer>
      </div>

      {/* Add/Edit Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editEvent={editingEvent}
      />
    </div>
  );
}

export default App;
