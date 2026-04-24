import { useState, useEffect, useCallback } from 'react';
import type { CountdownEvent, AppData, AppSettings } from '@/types';
import { DEFAULT_DATA } from '@/types';

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Calculate days between dates
export const calculateDays = (dateStr: string, type: 'countdown' | 'elapsed'): number => {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diff = target.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  return type === 'countdown' ? -days : -days;
};

// Format number with proper suffix
export const formatDays = (days: number, type: 'countdown' | 'elapsed'): string => {
  if (type === 'elapsed') {
    return days > 0 ? `${days}` : '0';
  }
  return days > 0 ? `${days}` : '0';
};

// Get label based on type
export const getDaysLabel = (days: number, type: 'countdown' | 'elapsed'): string => {
  if (type === 'elapsed') {
    return 'Days';
  }
  return days === 1 ? 'Day' : 'Days';
};

// Local storage key
const STORAGE_KEY = 'life-moment-data';

export function useCountdowns() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from local storage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setData({
            ...DEFAULT_DATA,
            ...parsed,
            events: parsed.events || DEFAULT_DATA.events,
            settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Save data to local storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    }
  }, [data, isLoaded]);

  // Add new event
  const addEvent = useCallback((event: Omit<CountdownEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CountdownEvent = {
      ...event,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
    return newEvent.id;
  }, []);

  // Update event
  const updateEvent = useCallback((id: string, updates: Partial<CountdownEvent>) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      ),
    }));
  }, []);

  // Delete event
  const deleteEvent = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== id),
    }));
  }, []);

  // Update settings
  const updateSettings = useCallback((settings: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  // Export data
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Import data
  const importData = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.events && Array.isArray(parsed.events)) {
        setData({
          ...DEFAULT_DATA,
          ...parsed,
          events: parsed.events,
          settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
    return false;
  }, []);

  return {
    events: data.events,
    settings: data.settings,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    updateSettings,
    exportData,
    importData,
  };
}
