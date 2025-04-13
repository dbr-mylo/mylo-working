
import { useState, useEffect } from 'react';

/**
 * Hook that tracks browser online/offline status
 * @returns Current online status (boolean)
 */
export function useOnline(): boolean {
  // Ensure we're accessing navigator only in browser context
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' && typeof navigator !== 'undefined' 
      ? navigator.onLine 
      : true
  );
  
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    function handleOnline() {
      setIsOnline(true);
    }
    
    function handleOffline() {
      setIsOnline(false);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
