import { useState, useEffect } from 'react';

interface OnlineStatusOptions {
  /**
   * Poll interval in milliseconds to check connection status
   * Set to 0 to disable polling
   */
  pollingInterval?: number;
  
  /**
   * Custom endpoint to ping to verify connection
   * By default, uses navigator.onLine status
   */
  endpoint?: string;
  
  /**
   * Timeout for endpoint ping in milliseconds
   */
  pingTimeout?: number;
}

/**
 * Hook to detect and monitor online/offline status
 */
export function useOnlineStatus(options: OnlineStatusOptions = {}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  
  const {
    pollingInterval = 30000, // 30 seconds default
    endpoint,
    pingTimeout = 5000, // 5 seconds default
  } = options;

  // Check connection status
  const checkConnection = async () => {
    // Skip if already checking
    if (isChecking) return;
    
    setIsChecking(true);
    
    try {
      // If an endpoint is specified, ping it to verify actual connectivity
      if (endpoint) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), pingTimeout);
        
        const response = await fetch(endpoint, {
          method: 'HEAD',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        setIsOnline(response.ok);
      } else {
        // Otherwise rely on navigator.onLine
        setIsOnline(navigator.onLine);
      }
    } catch (error) {
      // Any error indicates we're offline
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Set up event listeners for online/offline events
    const handleOnline = () => {
      // Double-check with a real request when possible
      if (endpoint) {
        checkConnection();
      } else {
        setIsOnline(true);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up polling if enabled
    let intervalId: number;
    if (pollingInterval > 0) {
      intervalId = window.setInterval(checkConnection, pollingInterval);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, [endpoint, pollingInterval]);
  
  return { 
    isOnline, 
    isChecking,
    checkConnection 
  };
}
