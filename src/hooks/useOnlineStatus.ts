
import { useEffect, useState, useCallback } from 'react';
import { useOnline } from './useOnline';

interface UseOnlineStatusReturn {
  isOnline: boolean;
  lastChanged: Date | null;
  checkConnection: () => boolean;
}

/**
 * Enhanced hook for tracking online status with additional features
 * @returns Object with online status, last change timestamp, and check function
 */
export function useOnlineStatus(): UseOnlineStatusReturn {
  const isOnline = useOnline();
  const [lastChanged, setLastChanged] = useState<Date | null>(null);
  
  useEffect(() => {
    setLastChanged(new Date());
  }, [isOnline]);
  
  const checkConnection = useCallback(() => {
    // Perform active connection check if needed
    // For now, just return current status
    return isOnline;
  }, [isOnline]);
  
  return {
    isOnline,
    lastChanged,
    checkConnection
  };
}
