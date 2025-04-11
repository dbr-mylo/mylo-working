
import { useState, useEffect } from 'react';
import { FeatureFlagHistoryEntry } from '@/utils/featureFlags/types';

const HISTORY_STORAGE_KEY = 'feature_flag_history';

export function useFeatureFlagHistory() {
  const [history, setHistory] = useState<FeatureFlagHistoryEntry[]>([]);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse feature flag history:', error);
      }
    }
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);
  
  // Log a flag change to history
  const logFlagChange = (entry: FeatureFlagHistoryEntry) => {
    setHistory(prevHistory => {
      // Limit history size to 100 entries
      const newHistory = [entry, ...prevHistory];
      if (newHistory.length > 100) {
        newHistory.pop();
      }
      return newHistory;
    });
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };
  
  return { history, logFlagChange, clearHistory };
}
