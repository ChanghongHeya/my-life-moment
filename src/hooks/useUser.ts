import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface UserData {
  user: User;
  favorites: string[];
  customConferences: string[];
  settings: {
    reminderDays: number;
    theme: 'light' | 'dark' | 'auto';
  };
}

const USERS_KEY = 'life-moment-users';
const CURRENT_USER_KEY = 'life-moment-current-user';

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const savedUsers = localStorage.getItem(USERS_KEY);
        const savedCurrent = localStorage.getItem(CURRENT_USER_KEY);
        
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          // Create default user
          const defaultUser: User = {
            id: 'default',
            name: '默认用户',
            avatar: '👤',
            createdAt: new Date().toISOString(),
          };
          setUsers([defaultUser]);
          setCurrentUser(defaultUser);
          localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
        }
        
        if (savedCurrent) {
          setCurrentUser(JSON.parse(savedCurrent));
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      }
      setIsLoaded(true);
    };
    loadUsers();
  }, []);

  // Save users to localStorage
  useEffect(() => {
    if (isLoaded && users.length > 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }, [users, isLoaded]);

  // Save current user to localStorage
  useEffect(() => {
    if (isLoaded && currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }
  }, [currentUser, isLoaded]);

  const createUser = useCallback((name: string, avatar: string = '👤') => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      avatar,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    return newUser.id;
  }, []);

  const switchUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users]);

  const deleteUser = useCallback((userId: string) => {
    if (users.length <= 1) {
      alert('至少保留一个用户');
      return false;
    }
    
    // Delete user data
    localStorage.removeItem(`life-moment-data-${userId}`);
    localStorage.removeItem(`life-moment-favorites-${userId}`);
    
    setUsers(prev => prev.filter(u => u.id !== userId));
    
    if (currentUser?.id === userId) {
      const remaining = users.filter(u => u.id !== userId);
      setCurrentUser(remaining[0]);
    }
    return true;
  }, [users, currentUser]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser]);

  // Get user-specific storage key
  const getUserStorageKey = useCallback((key: string) => {
    if (!currentUser) return key;
    return `${key}-${currentUser.id}`;
  }, [currentUser]);

  return {
    users,
    currentUser,
    isLoaded,
    createUser,
    switchUser,
    deleteUser,
    updateUser,
    getUserStorageKey,
  };
}
