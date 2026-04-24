import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { CountdownEvent } from '@/types';
import { calculateDays, formatDays, getDaysLabel } from '@/hooks/useCountdowns';

interface CountdownCardProps {
  event: CountdownEvent;
  onClick?: () => void;
  index?: number;
}

export function CountdownCard({ event, onClick, index = 0 }: CountdownCardProps) {
  const days = calculateDays(event.date, event.type);
  const displayDays = formatDays(days, event.type);
  const label = getDaysLabel(days, event.type);
  
  // Format date
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Calculate secondary info
  const getSecondaryInfo = () => {
    if (event.type === 'elapsed') {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (years > 0) {
        return `${years}年 ${remainingDays}天 · 已过`;
      }
      return `${formattedDate} · 已过`;
    }
    return `${formattedDate} · 还剩`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="glass-card rounded-2xl p-4 cursor-pointer transition-smooth hover:bg-white/70 dark:hover:bg-gray-800/70 group"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${event.color}20` }}
        >
          {event.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {event.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {getSecondaryInfo()}
          </p>
        </div>
        
        {/* Days counter */}
        <div className="text-right shrink-0">
          <div 
            className="text-3xl font-bold tabular-nums"
            style={{ color: event.color }}
          >
            {displayDays}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {label}
          </div>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
      </div>
    </motion.div>
  );
}
