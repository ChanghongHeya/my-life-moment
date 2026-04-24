import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Bell, BellOff } from 'lucide-react';
import type { Conference, Deadline } from '@/data/conferences';
import { calculateDaysUntil, formatDeadline, getConferenceColor } from '@/data/conferences';

interface ConferenceCardProps {
  conference: Conference;
  deadline: Deadline;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  index?: number;
}

export function ConferenceCard({ 
  conference, 
  deadline, 
  isFavorite = false, 
  onToggleFavorite,
  index = 0 
}: ConferenceCardProps) {
  const days = calculateDaysUntil(deadline.date);
  const isExpired = days < 0;
  const isUrgent = days <= 7 && days >= 0;
  const color = getConferenceColor(conference.ccfRank);
  
  const deadlineTypeMap: Record<string, string> = {
    abstract: '摘要',
    paper: '论文',
    rebuttal: '反驳',
    notification: '通知',
    camera: '终稿',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`glass-card rounded-2xl p-4 transition-all hover:bg-white/70 dark:hover:bg-gray-800/70 ${
        isExpired ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Left: CCF Rank Badge */}
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
          style={{ backgroundColor: color }}
        >
          {conference.ccfRank}
        </div>
        
        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight break-words">
                {conference.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {conference.fullName}
              </p>
            </div>
            
            {/* Days Badge - 优化为独立徽章样式 */}
            <div className={`flex flex-col items-end shrink-0 ${isUrgent ? 'animate-pulse' : ''}`}>
              <div 
                className={`px-2 py-1 rounded-lg font-bold text-lg leading-none ${
                  isUrgent 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : days < 0
                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}
              >
                {days >= 0 ? days : '—'}
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {formatDeadline(days)}
              </span>
            </div>
          </div>
          
          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
              {conference.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-500">
              {deadlineTypeMap[deadline.type] || deadline.type}
            </span>
            {conference.location && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400 min-w-0 max-w-full break-words">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="break-words">{conference.location}</span>
              </span>
            )}
          </div>

          {/* Date & Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50 min-w-0">
            <span className="text-xs text-gray-500 break-words min-w-0">
              {deadline.date}
            </span>
            
            <div className="flex items-center gap-2 shrink-0 max-w-full">
              {conference.website && (
                <a
                  href={conference.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  官网 <ExternalLink className="w-3 h-3" />
                </a>
              )}
              
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(conference.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400'
                  }`}
                  title={isFavorite ? '取消关注' : '关注'}
                >
                  {isFavorite ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
