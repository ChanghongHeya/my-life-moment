import { useEffect, useRef } from 'react';
import { calculateDaysUntil } from '@/data/conferences';
import type { Conference } from '@/data/conferences';

// Check if notifications are supported and permitted
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
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

// Send notification
export function sendNotification(title: string, body: string, icon?: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'ddl-reminder',
      requireInteraction: true,
    });
  }
}

// Hook to check deadlines and send notifications
export function useDeadlineNotifications(
  favorites: string[],
  conferences: Conference[],
  reminderDays: number = 7
) {
  const lastCheckRef = useRef<string>('');

  useEffect(() => {
    // Request permission on mount
    requestNotificationPermission();

    const checkDeadlines = () => {
      const now = new Date();
      const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      
      // Only check once per day
      if (lastCheckRef.current === todayKey) return;
      lastCheckRef.current = todayKey;

      favorites.forEach(confId => {
        const conf = conferences.find(c => c.id === confId);
        if (!conf) return;

        conf.deadlines.forEach(deadline => {
          const days = calculateDaysUntil(deadline.date);
          
          // Send notification for urgent deadlines
          if (days >= 0 && days <= reminderDays) {
            const deadlineType = deadline.type === 'abstract' ? '摘要' : 
                                deadline.type === 'paper' ? '论文' : 
                                deadline.type;
            
            sendNotification(
              `⏰ ${conf.name} ${deadlineType}截止提醒`,
              `还有 ${days} 天！截止日期：${deadline.date} (${deadline.timezone})`,
            );
          }
        });
      });
    };

    // Check immediately
    checkDeadlines();

    // Check every hour
    const interval = setInterval(checkDeadlines, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [favorites, conferences, reminderDays]);
}

// Hook for browser tab title notification
export function useTabTitleNotification(favorites: string[], conferences: Conference[]) {
  useEffect(() => {
    const updateTitle = () => {
      if (favorites.length === 0) {
        document.title = 'Life Moment - 美好时刻';
        return;
      }

      let minDays = Infinity;
      let urgentConf = '';

      favorites.forEach(confId => {
        const conf = conferences.find(c => c.id === confId);
        if (!conf) return;

        conf.deadlines.forEach(deadline => {
          const days = calculateDaysUntil(deadline.date);
          if (days >= 0 && days < minDays) {
            minDays = days;
            urgentConf = conf.name;
          }
        });
      });

      if (minDays <= 7 && minDays !== Infinity) {
        document.title = `⏰ ${minDays}天 - ${urgentConf} | Life Moment`;
      } else {
        document.title = 'Life Moment - 美好时刻';
      }
    };

    updateTitle();
    const interval = setInterval(updateTitle, 60 * 1000); // Update every minute

    return () => clearInterval(interval);
  }, [favorites, conferences]);
}
