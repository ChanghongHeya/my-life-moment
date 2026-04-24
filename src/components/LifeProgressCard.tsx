import { motion } from 'framer-motion';
import type { CountdownEvent } from '@/types';

interface LifeProgressCardProps {
  event: CountdownEvent;
}

const LIFE_EXPECTANCY_YEARS = 100;
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
const CIRCLE_RADIUS = 44;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function LifeProgressCard({ event }: LifeProgressCardProps) {
  const birthDate = new Date(event.date);
  const now = new Date();
  const ageInMs = now.getTime() - birthDate.getTime();
  const ageYears = Math.max(ageInMs / YEAR_MS, 0);
  const progress = Math.min(Math.max((ageYears / LIFE_EXPECTANCY_YEARS) * 100, 0), 100);
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;
  const ageText = `${ageYears.toFixed(2)} Year`;
  const progressText = `${progress.toFixed(2)}%`;
  const statusText = progress >= 100 ? 'Complete' : 'Passed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-3xl p-5 overflow-hidden"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-emerald-100/80 dark:text-emerald-950/40"
            />
            <circle
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={event.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className="drop-shadow-sm transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl">{event.icon}</span>
          </div>
        </div>

        <div className="space-y-1 max-w-full">
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
            {event.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words">
            Life · {ageText} / {LIFE_EXPECTANCY_YEARS} Year · {statusText}
          </p>
        </div>

        <div className="w-full rounded-2xl bg-white/45 dark:bg-gray-900/35 border border-white/25 dark:border-white/10 px-4 py-5 shadow-inner overflow-hidden">
          <div
            className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white break-all"
            style={{ color: event.color }}
          >
            {progressText}
          </div>
        </div>
      </div>

    </motion.div>
  );
}
