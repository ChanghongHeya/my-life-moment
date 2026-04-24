import { useState, useMemo } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_CONFERENCES, CATEGORIES, getConferenceColor } from '@/data/conferences-extended';
import type { Conference } from '@/data/conferences';

type FilterRank = 'All' | 'A' | 'B' | 'C';
type FilterCategory = 'All' | typeof CATEGORIES[number];

interface ConferencePoolProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function ConferencePool({ favorites, onToggleFavorite }: ConferencePoolProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState<FilterRank>('All');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('All');

  // Filter conferences
  const filteredConferences = useMemo(() => {
    return ALL_CONFERENCES.filter(conf => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = conf.name.toLowerCase().includes(query);
        const matchFullName = conf.fullName.toLowerCase().includes(query);
        if (!matchName && !matchFullName) return false;
      }

      // Rank filter
      if (filterRank !== 'All' && conf.ccfRank !== filterRank) return false;

      // Category filter
      if (filterCategory !== 'All' && conf.category !== filterCategory) return false;

      return true;
    });
  }, [searchQuery, filterRank, filterCategory]);

  // Group by rank
  const groupedConferences = useMemo(() => {
    const groups: { rank: 'A' | 'B' | 'C'; conferences: Conference[] }[] = [
      { rank: 'A', conferences: [] },
      { rank: 'B', conferences: [] },
      { rank: 'C', conferences: [] },
    ];

    filteredConferences.forEach(conf => {
      const group = groups.find(g => g.rank === conf.ccfRank);
      if (group) group.conferences.push(conf);
    });

    return groups.filter(g => g.conferences.length > 0);
  }, [filteredConferences]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col"
    >
      {/* Filter Bar */}
      <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索会议..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Rank Filter */}
          <div className="flex gap-1">
            {(['All', 'A', 'B', 'C'] as FilterRank[]).map(rank => (
              <button
                key={rank}
                onClick={() => setFilterRank(rank)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterRank === rank
                    ? rank === 'A' ? 'bg-red-500 text-white' :
                      rank === 'B' ? 'bg-orange-500 text-white' :
                      rank === 'C' ? 'bg-blue-500 text-white' :
                      'bg-gray-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {rank === 'All' ? '全部' : rank}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
          >
            <option value="All">全部方向</option>
            {CATEGORIES.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <p className="text-xs text-gray-500">
          共 {filteredConferences.length} 个会议 · 已关注 {favorites.length} 个
        </p>
      </div>

      {/* Conference List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-6">
        {groupedConferences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">没有找到符合条件的会议</p>
          </div>
        ) : (
          groupedConferences.map((group) => (
            <div key={group.rank}>
              {/* Rank Header */}
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: getConferenceColor(group.rank) }}
                >
                  {group.rank}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {group.rank === 'A' ? '顶级会议' : group.rank === 'B' ? '重要会议' : '一般会议'}
                </span>
                <span className="text-xs text-gray-400">({group.conferences.length})</span>
              </div>

              {/* Conference Cards */}
              <div className="space-y-2">
                {group.conferences.map((conf, index) => {
                  const isFav = favorites.includes(conf.id);
                  return (
                    <motion.div
                      key={conf.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="glass-card rounded-xl p-3 flex items-center justify-between gap-3 group min-w-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm break-words min-w-0 max-w-full">
                            {conf.name}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
                            {conf.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {conf.fullName}
                        </p>
                        {conf.deadlines.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {conf.deadlines.length} 个截止日期
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onToggleFavorite(conf.id)}
                        className={`ml-3 p-1.5 rounded-lg transition-all shrink-0 ${
                          isFav
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isFav ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
