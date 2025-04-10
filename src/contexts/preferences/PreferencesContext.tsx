
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  documentViewMode: 'grid' | 'list';
  sidebarExpanded: boolean;
  fontSize: 'small' | 'medium' | 'large';
  editorToolbarPosition: 'top' | 'bottom';
  confirmOnDelete: boolean;
  autosaveEnabled: boolean;
  sortPreference: {
    documents: string;
    templates: string;
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  documentViewMode: 'grid',
  sidebarExpanded: true,
  fontSize: 'medium',
  editorToolbarPosition: 'top',
  confirmOnDelete: true,
  autosaveEnabled: true,
  sortPreference: {
    documents: 'updatedAt:desc',
    templates: 'name:asc',
  },
};

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
  isDarkMode: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {},
  resetPreferences: () => {},
  isDarkMode: false,
});

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const userId = user?.id || 'anonymous';
      const storedPrefs = localStorage.getItem(`user-preferences-${userId}`);
      
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs);
        setPreferences(prev => ({
          ...prev,
          ...parsedPrefs,
        }));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, [user?.id]);

  // Save preferences to localStorage when updated
  useEffect(() => {
    try {
      const userId = user?.id || 'anonymous';
      localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences, user?.id]);

  // Calculate dark mode based on preferences and system settings
  useEffect(() => {
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (preferences.theme === 'system') {
        setIsDarkMode(event.matches);
      }
    };

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (preferences.theme === 'dark') {
      setIsDarkMode(true);
    } else if (preferences.theme === 'light') {
      setIsDarkMode(false);
    } else {
      // System preference
      setIsDarkMode(darkModeQuery.matches);
    }

    darkModeQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      darkModeQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [preferences.theme]);

  // Apply dark mode class to document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, []);

  const value = {
    preferences,
    updatePreference,
    resetPreferences,
    isDarkMode,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
