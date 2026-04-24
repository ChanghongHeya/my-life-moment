import { motion, AnimatePresence } from 'framer-motion';
import type { CountdownEvent } from '@/types';
import { CountdownCard } from './CountdownCard';

interface CountdownListProps {
  events: CountdownEvent[];
  onEventClick: (event: CountdownEvent) => void;
}

export function CountdownList({ events, onEventClick }: CountdownListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <span className="text-3xl">📅</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          还没有倒计时
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          点击右上角 + 添加
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <CountdownCard
            key={event.id}
            event={event}
            index={index}
            onClick={() => onEventClick(event)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
