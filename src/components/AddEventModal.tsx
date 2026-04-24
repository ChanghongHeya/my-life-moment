import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Heart, Clock } from 'lucide-react';
import type { CountdownEvent, CountdownType } from '@/types';
import { COLOR_THEMES, DEFAULT_ICONS } from '@/types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editEvent?: CountdownEvent | null;
}

export function AddEventModal({ isOpen, onClose, onSave, editEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<CountdownType>('elapsed');
  const [icon, setIcon] = useState('❤️');
  const [color, setColor] = useState<string>(COLOR_THEMES[0].color);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Reset form when modal opens or editEvent changes
  useEffect(() => {
    if (isOpen) {
      if (editEvent) {
        setTitle(editEvent.title);
        setDate(editEvent.date);
        setType(editEvent.type);
        setIcon(editEvent.icon);
        setColor(editEvent.color);
      } else {
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('elapsed');
        setIcon('❤️');
        setColor(COLOR_THEMES[0].color);
      }
    }
  }, [isOpen, editEvent]);

  const handleSave = () => {
    if (!title.trim() || !date) return;
    
    onSave({
      title: title.trim(),
      date,
      type,
      icon,
      color,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card w-full max-w-sm rounded-3xl p-6 pointer-events-auto shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editEvent ? '编辑事件' : '添加事件'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Title input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：生日、纪念日..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>

                {/* Type selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    类型
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType('elapsed')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        type === 'elapsed'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${type === 'elapsed' ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${type === 'elapsed' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        正计时
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('countdown')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        type === 'countdown'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Clock className={`w-5 h-5 ${type === 'countdown' ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${type === 'countdown' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        倒计时
                      </span>
                    </button>
                  </div>
                </div>

                {/* Date input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    日期
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Icon selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图标
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm text-gray-500">选择图标</span>
                  </button>
                  
                  {showIconPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl grid grid-cols-8 gap-2"
                    >
                      {DEFAULT_ICONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setIcon(emoji);
                            setShowIconPicker(false);
                          }}
                          className={`aspect-square rounded-lg text-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                            icon === emoji ? 'bg-primary-100 dark:bg-primary-900/30' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Color selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    主题颜色
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_THEMES.map((theme) => (
                      <button
                        key={theme.color}
                        type="button"
                        onClick={() => setColor(theme.color)}
                        className={`w-10 h-10 rounded-xl transition-all ${
                          color === theme.color
                            ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: theme.color }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!title.trim() || !date}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
