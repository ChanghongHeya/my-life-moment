import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Bell, BellOff } from 'lucide-react';
import type { Conference, Deadline } from '@/data/conferences';
import { calculateDaysUntil, formatDeadline, getConferenceColor } from '@/data/conferences';
import { openConferenceWebsite } from '@/lib/external-links';

interface ConferenceCardProps {
  conference: Conference;
  deadline: Deadline;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  index?: number;
}

const deadlineTypeMap: Record<string, string> = {
  abstract: '摘要截止',
  paper: '投稿截止',
  rebuttal: '反驳截止',
  notification: '通知',
  camera: '终稿截止',
};

function DeadlineRow({ label, deadline }: { label: string; deadline: Deadline }) {
  const days = calculateDaysUntil(deadline.date);
  const isExpired = days < 0;
  const isUrgent = days <= 7 && days >= 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isExpired ? 'bg-gray-300 dark:bg-gray-600' : isUrgent ? 'bg-red-400' : 'bg-blue-400'
        }`} />
        <span className="text-[11px] text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">{deadline.date}</span>
      </div>
      <span className={`text-xs font-semibold ${
        isExpired
          ? 'text-gray-400'
          : isUrgent
            ? 'text-red-500'
            : 'text-blue-500'
      }`}>
        {isExpired ? '已截止' : `${days}天`}
      </span>
    </div>
  );
}

export function ConferenceCard({
  conference,
  deadline,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}: ConferenceCardProps) {
  const [linkError, setLinkError] = useState<string | null>(null);
  const days = calculateDaysUntil(deadline.date);
  const isExpired = days < 0;
  const isUrgent = days <= 7 && days >= 0;
  const color = getConferenceColor(conference.ccfRank);

  // Find abstract and paper deadlines from the conference
  const abstractDeadline = conference.deadlines.find(d => d.type === 'abstract');
  const paperDeadline = conference.deadlines.find(d => d.type === 'paper');

  const handleOpenWebsite = async () => {
    try {
      setLinkError(null);
      await openConferenceWebsite(conference.website);
    } catch (error) {
      setLinkError(error instanceof Error ? error.message : '打开官网失败。');
    }
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
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
          style={{ backgroundColor: color }}
        >
          {conference.ccfRank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight break-words">
                {conference.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {conference.fullName}
              </p>
            </div>

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

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-400">
              {conference.category}
            </span>
            {conference.location && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400 min-w-0 max-w-full break-words">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="break-words">{conference.location}</span>
              </span>
            )}
          </div>

          {/* Dual deadline display */}
          <div className="mt-2.5 space-y-1 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl px-3 py-2">
            {abstractDeadline && (
              <DeadlineRow label={deadlineTypeMap.abstract} deadline={abstractDeadline} />
            )}
            {paperDeadline && (
              <DeadlineRow label={deadlineTypeMap.paper} deadline={paperDeadline} />
            )}
            {!abstractDeadline && !paperDeadline && (
              <DeadlineRow
                label={deadlineTypeMap[deadline.type] || deadline.type}
                deadline={deadline}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/50 min-w-0">
            <div className="flex items-center gap-2 shrink-0 max-w-full">
              <button
                type="button"
                onClick={handleOpenWebsite}
                className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
              >
                官网 <ExternalLink className="w-3 h-3" />
              </button>

              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(conference.id)}
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

          {linkError && (
            <p className="mt-2 text-[11px] text-red-500 dark:text-red-400">
              {linkError}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
