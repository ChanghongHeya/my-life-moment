import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@/hooks/useUser';
import { UI_EMOJIS } from '@/data/emojis';

const AVATAR_OPTIONS = ['👤', '👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🔬', '👨‍🔬', '👩‍🔬', '🤖', '👽', '🎭', '🦄', '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁'];

interface UserSwitcherProps {
  users: User[];
  currentUser: User;
  onSwitch: (userId: string) => boolean;
  onCreate: (name: string, avatar: string) => string;
  onDelete: (userId: string) => boolean;
  onUpdate: (userId: string, updates: Partial<User>) => void;
  onClose: () => void;
}

export function UserSwitcher({
  users,
  currentUser,
  onSwitch,
  onCreate,
  onDelete,
  onUpdate,
}: UserSwitcherProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newUserName.trim()) {
      onCreate(newUserName.trim(), selectedAvatar);
      setNewUserName('');
      setIsCreating(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditName(user.name);
  };

  const handleSaveEdit = (userId: string) => {
    if (editName.trim()) {
      onUpdate(userId, { name: editName.trim() });
      setEditingUser(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      <div className="px-5 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span>{UI_EMOJIS.users}</span>
            切换用户
          </h3>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 text-white"
          >
            {isCreating ? '取消' : '+ 新用户'}
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user) => (
            <motion.div
              key={user.id}
              layout
              className={`p-3 rounded-xl flex items-center justify-between ${
                user.id === currentUser.id
                  ? 'bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-900/20 dark:to-violet-900/20 border border-pink-200 dark:border-pink-800'
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleSaveEdit(user.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(user.id)}
                      className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {user.name}
                      </span>
                      {user.id === currentUser.id && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600">
                          当前
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {user.id !== currentUser.id && (
                  <button
                    onClick={() => onSwitch(user.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  >
                    切换
                  </button>
                )}
                <button
                  onClick={() => handleEdit(user)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  ✏️
                </button>
                {users.length > 1 && (
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl space-y-3"
            >
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                  选择头像
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        selectedAvatar === avatar
                          ? 'bg-gradient-to-r from-pink-400 to-violet-400 shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="输入用户名"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button
                  onClick={handleCreate}
                  disabled={!newUserName.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white text-sm font-medium disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
