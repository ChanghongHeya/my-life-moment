import { useEffect, useRef } from 'react';
import { calculateDaysUntil } from '@/data/conferences';
import type { Conference } from '@/data/conferences';

const NOTIFICATION_CACHE_KEY = 'life-moment-deadline-notifications-v1';

function readNotificationCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTIFICATION_CACHE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, string> : {};
  } catch {
    return {};
  }
}

function writeNotificationCache(cache: Record<string, string>): void {
  localStorage.setItem(NOTIFICATION_CACHE_KEY, JSON.stringify(cache));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(title: string, body: string, icon?: string): void {
  if (Notification.permission !== 'granted') {
    return;
  }

  new Notification(title, {
    body,
    icon: icon ?? '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'ddl-reminder',
    requireInteraction: true,
  });
}

export function useDeadlineNotifications(
  favorites: string[],
  conferences: Conference[],
  reminderDays = 7,
) {
  const lastCheckRef = useRef<string>('');

  useEffect(() => {
    const checkDeadlines = async () => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        return;
      }

      const now = new Date();
      const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

      if (lastCheckRef.current === dayKey) {
        return;
      }

      lastCheckRef.current = dayKey;
      const cache = readNotificationCache();

      favorites.forEach((conferenceId) => {
        const conference = conferences.find((item) => item.id === conferenceId);
        if (!conference) {
          return;
        }

        conference.deadlines.forEach((deadline) => {
          const days = calculateDaysUntil(deadline.date);
          const notificationKey = `${conference.id}:${deadline.id}:${dayKey}`;

          if (days < 0 || days > reminderDays || cache[notificationKey]) {
            return;
          }

          const deadlineType = deadline.type === 'abstract'
            ? '摘要'
            : deadline.type === 'paper'
              ? '论文'
              : deadline.type;

          sendNotification(
            `⏰ ${conference.name} ${deadlineType}截止提醒`,
            `还有 ${days} 天，截止日期 ${deadline.date}（${deadline.timezone}）。`,
          );
          cache[notificationKey] = now.toISOString();
        });
      });

      writeNotificationCache(cache);
    };

    void checkDeadlines();
    const interval = window.setInterval(() => {
      void checkDeadlines();
    }, 60 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [favorites, conferences, reminderDays]);
}

export function useTabTitleNotification(favorites: string[], conferences: Conference[]) {
  useEffect(() => {
    const updateTitle = () => {
      if (favorites.length === 0) {
        document.title = 'Life Moment - 美好时刻';
        return;
      }

      let minDays = Infinity;
      let urgentConference = '';

      favorites.forEach((conferenceId) => {
        const conference = conferences.find((item) => item.id === conferenceId);
        if (!conference) {
          return;
        }

        conference.deadlines.forEach((deadline) => {
          const days = calculateDaysUntil(deadline.date);
          if (days >= 0 && days < minDays) {
            minDays = days;
            urgentConference = conference.name;
          }
        });
      });

      if (minDays <= 7 && Number.isFinite(minDays)) {
        document.title = `⏰ ${minDays}天 - ${urgentConference} | Life Moment`;
      } else {
        document.title = 'Life Moment - 美好时刻';
      }
    };

    updateTitle();
    const interval = window.setInterval(updateTitle, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [favorites, conferences]);
}
