import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseOnlineStatusProps {
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
  
  /**
   * Whether to show toast notifications on status change
   */
  showToasts?: boolean;
}

/**
 * Hook to detect and monitor online/offline status
 */
export function useOnlineStatus({
  pollingInterval = 30000, // 30 seconds default
  endpoint,
  pingTimeout = 5000, // 5 seconds default
  showToasts = true
}: UseOnlineStatusProps = {}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  
  // Check connection status
  const checkConnection = useCallback(async () => {
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
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        const newStatus = response.ok;
        
        // Only update if status changed
        if (newStatus !== isOnline) {
          setIsOnline(newStatus);
          
          // Show toast when status changes
          if (showToasts) {
            if (newStatus) {
              toast.success("You're back online", {
                description: "Your changes will now sync automatically.",
                duration: 3000
              });
            } else {
              toast.warning("You're offline", {
                description: "Your changes will be saved locally until you reconnect.",
                duration: 5000
              });
            }
          }
        }
      } else {
        // Otherwise rely on navigator.onLine
        const newStatus = navigator.onLine;
        
        // Only update if status changed
        if (newStatus !== isOnline) {
          setIsOnline(newStatus);
          
          // Show toast when status changes
          if (showToasts) {
            if (newStatus) {
              toast.success("You're back online", {
                description: "Your changes will now sync automatically.",
                duration: 3000
              });
            } else {
              toast.warning("You're offline", {
                description: "Your changes will be saved locally until you reconnect.",
                duration: 5000
              });
            }
          }
        }
      }
    } catch (error) {
      // Any error indicates we're offline
      if (isOnline) {
        setIsOnline(false);
        
        // Show toast when going offline
        if (showToasts) {
          toast.warning("You're offline", {
            description: "Your changes will be saved locally until you reconnect.",
            duration: 5000
          });
        }
      }
    } finally {
      setIsChecking(false);
      setLastCheck(new Date());
    }
  }, [isOnline, isChecking, endpoint, pingTimeout, showToasts]);
  
  // Handle online/offline events
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
        
        // Show toast when going online
        if (showToasts) {
          toast.success("You're back online", {
            description: "Your changes will now sync automatically.",
            duration: 3000
          });
        }
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      
      // Show toast when going offline
      if (showToasts) {
        toast.warning("You're offline", {
          description: "Your changes will be saved locally until you reconnect.",
          duration: 5000
        });
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up polling if enabled
    let intervalId: number | undefined;
    if (pollingInterval > 0) {
      intervalId = window.setInterval(checkConnection, pollingInterval);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [checkConnection, endpoint, pollingInterval, showToasts]);
  
  return { 
    isOnline, 
    isChecking,
    lastCheck,
    checkConnection 
  };
}
