import { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConferenceCard } from './ConferenceCard';
import { ConferencePool } from './ConferencePool';
import { ALL_CONFERENCES, CATEGORIES, calculateDaysUntil } from '@/data/conferences-extended';
import type { Conference, Deadline } from '@/data/conferences';

type FilterRank = 'All' | 'A' | 'B' | 'C';
type FilterCategory = 'All' | typeof CATEGORIES[number];
type ViewMode = 'timeline' | 'pool';

interface AcademicModeProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function AcademicMode({ favorites, onToggleFavorite }: AcademicModeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState<FilterRank>('All');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Get favorite conferences with their most relevant deadline
  const favoriteDeadlines = useMemo(() => {
    const items: { conference: Conference; deadline: Deadline }[] = [];

    favorites.forEach(favId => {
      const conf = ALL_CONFERENCES.find(c => c.id === favId);
      if (!conf || conf.deadlines.length === 0) {
        return;
      }

      const deadlinesWithDays = conf.deadlines
        .map(d => ({ ...d, days: calculateDaysUntil(d.date) }))
        .sort((a, b) => a.days - b.days);

      const upcomingDeadline = deadlinesWithDays.find(d => d.days >= 0);
      const latestPastDeadline = [...deadlinesWithDays].reverse().find(d => d.days < 0);
      const displayDeadline = upcomingDeadline ?? latestPastDeadline;

      if (displayDeadline) {
        items.push({
          conference: conf,
          deadline: displayDeadline,
        });
      }
    });

    return items.sort((a, b) => {
      const daysA = calculateDaysUntil(a.deadline.date);
      const daysB = calculateDaysUntil(b.deadline.date);
      return daysA - daysB;
    });
  }, [favorites]);

  // Filter favorite deadlines
  const filteredFavoriteDeadlines = useMemo(() => {
    return favoriteDeadlines.filter(({ conference }) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = conference.name.toLowerCase().includes(query);
        const matchFullName = conference.fullName.toLowerCase().includes(query);
        if (!matchName && !matchFullName) return false;
      }
      if (filterRank !== 'All' && conference.ccfRank !== filterRank) return false;
      if (filterCategory !== 'All' && conference.category !== filterCategory) return false;
      return true;
    });
  }, [favoriteDeadlines, searchQuery, filterRank, filterCategory]);

  // Group by time period
  const groupedDeadlines = useMemo(() => {
    const groups: { label: string; items: typeof filteredFavoriteDeadlines; color: string }[] = [
      { label: '紧急 (≤3天)', items: [], color: '#ef4444' },
      { label: '即将截止 (4-7天)', items: [], color: '#f97316' },
      { label: '本周 (8-30天)', items: [], color: '#f59e0b' },
      { label: '本月 (31-90天)', items: [], color: '#3b82f6' },
      { label: '更晚 (>90天)', items: [], color: '#6b7280' },
      { label: '已截止', items: [], color: '#9ca3af' },
    ];

    filteredFavoriteDeadlines.forEach(item => {
      const days = calculateDaysUntil(item.deadline.date);
      if (days < 0) groups[5].items.push(item);
      else if (days <= 3) groups[0].items.push(item);
      else if (days <= 7) groups[1].items.push(item);
      else if (days <= 30) groups[2].items.push(item);
      else if (days <= 90) groups[3].items.push(item);
      else groups[4].items.push(item);
    });

    return groups.filter(g => g.items.length > 0);
  }, [filteredFavoriteDeadlines]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">学术 DDL</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {viewMode === 'timeline' 
                  ? `${favorites.length} 个关注`
                  : `${ALL_CONFERENCES.length} 个会议`
                }
              </p>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              我的关注
            </button>
            <button
              onClick={() => setViewMode('pool')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'pool'
                  ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              全部会议
            </button>
          </div>
        </div>

        {viewMode === 'timeline' && (
          <>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索关注的会议..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showFilters
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                筛选
              </button>

              <button
                onClick={() => setViewMode('pool')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              >
                <Star className="w-4 h-4" />
                添加关注
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">CCF 等级</label>
                      <div className="flex gap-2">
                        {(['All', 'A', 'B', 'C'] as FilterRank[]).map(rank => (
                          <button
                            key={rank}
                            onClick={() => setFilterRank(rank)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              filterRank === rank
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {rank === 'All' ? '全部' : rank}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">研究方向</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                      >
                        <option value="All">全部方向</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden momentum-scroll">
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-5 py-4 space-y-6"
            >
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">还没有关注任何会议</p>
                  <button
                    onClick={() => setViewMode('pool')}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    去全部会议中添加 →
                  </button>
                </div>
              ) : groupedDeadlines.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">关注的会议暂无即将到来的截止日期</p>
                </div>
              ) : (
                groupedDeadlines.map((group, groupIndex) => (
                  <div key={group.label}>
                    <h3 
                      className="text-sm font-semibold mb-3 flex items-center gap-2"
                      style={{ color: group.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                      {group.label}
                      <span className="text-xs opacity-60">({group.items.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {group.items.map(({ conference, deadline }, index) => (
                        <ConferenceCard
                          key={`${conference.id}-${deadline.id}`}
                          conference={conference}
                          deadline={deadline}
                          isFavorite={true}
                          onToggleFavorite={onToggleFavorite}
                          index={groupIndex * 10 + index}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <ConferencePool
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
