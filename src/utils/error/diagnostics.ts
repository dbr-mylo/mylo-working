
/**
 * Error diagnostics utility functions
 */

/**
 * Run system diagnostics to help identify and resolve errors
 * @returns Promise resolving when diagnostics have completed
 */
export async function runDiagnostics(): Promise<boolean> {
  console.info('Running system diagnostics...');
  
  try {
    const results = await Promise.all([
      checkNetworkConnectivity(),
      checkStorageAccess(),
      checkPerformance()
    ]);
    
    console.info('Diagnostics complete');
    
    // Return true if all diagnostics passed
    return results.every(result => result === true);
  } catch (e) {
    console.error('Diagnostics failed:', e);
    return false;
  }
}

/**
 * Check network connectivity
 */
async function checkNetworkConnectivity(): Promise<boolean> {
  try {
    console.info('Checking network connectivity...');
    
    // First check navigator.onLine (basic check)
    const isOnline = navigator.onLine;
    console.info(`Device reports ${isOnline ? 'online' : 'offline'} status`);
    
    if (!isOnline) {
      return false;
    }
    
    // Try a lightweight ping to verify actual connectivity
    // We use a timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      // Try to fetch a tiny resource to verify connection
      // In a real app, you'd use a dedicated endpoint
      await fetch('/favicon.ico', { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      console.info('Network connectivity confirmed');
      return true;
    } catch (e) {
      console.warn('Network connectivity test failed:', e);
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (e) {
    console.warn('Network diagnostics error:', e);
    return false;
  }
}

/**
 * Check storage access
 */
async function checkStorageAccess(): Promise<boolean> {
  try {
    console.info('Checking storage access...');
    
    // Check localStorage
    const testKey = '___diagnostics_test___';
    try {
      localStorage.setItem(testKey, Date.now().toString());
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved) {
        console.info('localStorage is accessible');
      } else {
        console.warn('localStorage write/read test failed');
        return false;
      }
    } catch (e) {
      console.warn('localStorage access error:', e);
      return false;
    }
    
    // Check IndexedDB if needed
    // This is a basic test to see if IndexedDB is available
    if ('indexedDB' in window) {
      try {
        const request = indexedDB.open('___diagnostic_test___', 1);
        request.onsuccess = () => {
          const db = request.result;
          db.close();
          indexedDB.deleteDatabase('___diagnostic_test___');
          console.info('IndexedDB is accessible');
        };
        request.onerror = () => {
          console.warn('IndexedDB test failed:', request.error);
        };
      } catch (e) {
        console.warn('IndexedDB access error:', e);
      }
    }
    
    return true;
  } catch (e) {
    console.warn('Storage diagnostics error:', e);
    return false;
  }
}

/**
 * Check system performance
 */
async function checkPerformance(): Promise<boolean> {
  try {
    console.info('Checking system performance...');
    
    // Get basic performance metrics if available
    if ('performance' in window) {
      try {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationTiming) {
          // Use loadEventEnd and startTime instead of navigationStart which doesn't exist
          const loadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
          console.info(`Page load time: ${Math.round(loadTime)}ms`);
        }
        
        // Check for long tasks if available
        if ('PerformanceObserver' in window) {
          console.info('Performance observer is available for monitoring long tasks');
        }
      } catch (e) {
        console.warn('Performance metrics error:', e);
      }
    }
    
    return true;
  } catch (e) {
    console.warn('Performance diagnostics error:', e);
    return false;
  }
}
