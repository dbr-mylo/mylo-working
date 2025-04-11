
/**
 * Utility functions for running diagnostics
 */

import { getSystemHealth, reportSystemError, updateNetworkHealth, updateStorageHealth } from '../featureFlags/systemHealth';

/**
 * Run system diagnostics to check for common issues
 * @returns boolean indicating if diagnostics succeeded
 */
export function runDiagnostics(): boolean {
  try {
    console.log('Running system diagnostics...');
    
    // Check localStorage access
    const storageAvailable = checkLocalStorage();
    console.log('  Storage check:', storageAvailable ? '✓' : '✗');
    
    // Check network connectivity
    const networkAvailable = checkNetworkConnectivity();
    console.log('  Network check:', networkAvailable ? '✓' : '✗');
    
    // Check browser compatibility
    const browserCompatible = checkBrowserCompatibility();
    console.log('  Browser compatibility check:', browserCompatible ? '✓' : '✗');
    
    // Check IndexedDB access
    const indexedDBAvailable = checkIndexedDB();
    console.log('  IndexedDB check:', indexedDBAvailable ? '✓' : '✗');
    
    // Check network latency
    checkNetworkLatency().then(latencyMs => {
      console.log(`  Network latency: ${latencyMs !== null ? `${latencyMs}ms` : 'Unknown'}`);
      
      // Update system health with network information
      if (latencyMs !== null) {
        updateNetworkHealth(networkAvailable, latencyMs);
      } else {
        updateNetworkHealth(networkAvailable);
      }
    });
    
    // Update storage health based on diagnostics
    updateStorageHealth();
    
    // Display overall system health
    const systemHealth = getSystemHealth();
    console.log(`  System health score: ${systemHealth}/100`);
    
    return storageAvailable && networkAvailable && browserCompatible;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    reportSystemError(error, 'diagnostics');
    return false;
  }
}

/**
 * Check if localStorage is available
 */
function checkLocalStorage(): boolean {
  try {
    const testKey = '___diagnostics_test___';
    localStorage.setItem(testKey, 'test');
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return testValue === 'test';
  } catch (error) {
    console.error('  LocalStorage check failed:', error);
    return false;
  }
}

/**
 * Check network connectivity
 */
function checkNetworkConnectivity(): boolean {
  // This is a simple check, in a real app you might want to ping a server
  return navigator.onLine;
}

/**
 * Check network latency by pinging a reliable endpoint
 * @returns Promise resolving to latency in ms or null if check failed
 */
async function checkNetworkLatency(): Promise<number | null> {
  try {
    const start = performance.now();
    
    // Use a reliable API that supports CORS
    const response = await fetch('https://httpbin.org/get', { 
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      },
    });
    
    if (response.ok) {
      const end = performance.now();
      return Math.round(end - start);
    }
    
    return null;
  } catch (error) {
    console.warn('  Network latency check failed:', error);
    return null;
  }
}

/**
 * Check browser compatibility for modern features
 */
function checkBrowserCompatibility(): boolean {
  try {
    // Check for some modern features
    const hasLocalStorage = typeof localStorage !== 'undefined';
    const hasSessionStorage = typeof sessionStorage !== 'undefined';
    const hasPromises = typeof Promise !== 'undefined';
    const hasAsync = (async () => {}).constructor.name === 'AsyncFunction';
    const hasURLAPI = typeof URL !== 'undefined';
    const hasIndexedDB = typeof indexedDB !== 'undefined';
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    // Log individual checks
    console.log('    Local Storage available:', hasLocalStorage ? '✓' : '✗');
    console.log('    Session Storage available:', hasSessionStorage ? '✓' : '✗');
    console.log('    Promises supported:', hasPromises ? '✓' : '✗');
    console.log('    Async/await supported:', hasAsync ? '✓' : '✗');
    console.log('    URL API supported:', hasURLAPI ? '✓' : '✗');
    console.log('    IndexedDB supported:', hasIndexedDB ? '✓' : '✗');
    console.log('    Service Worker supported:', hasServiceWorker ? '✓' : '✗');
    
    return hasLocalStorage && hasSessionStorage && hasPromises && hasAsync && hasURLAPI;
  } catch (error) {
    console.error('  Browser compatibility check failed:', error);
    return false;
  }
}

/**
 * Check IndexedDB access
 */
function checkIndexedDB(): boolean {
  try {
    const testDbName = '___diagnostics_test_db___';
    
    // Simple promise-based check
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.error('  IndexedDB not supported');
        resolve(false);
        return;
      }
      
      const request = window.indexedDB.open(testDbName, 1);
      
      request.onerror = () => {
        console.error('  IndexedDB check failed:', request.error);
        resolve(false);
      };
      
      request.onsuccess = (event) => {
        // Clean up by deleting the test database
        const db = (event.target as IDBOpenDBRequest).result;
        db.close();
        window.indexedDB.deleteDatabase(testDbName);
        resolve(true);
      };
    }) as unknown as boolean;
  } catch (error) {
    console.error('  IndexedDB check failed:', error);
    return false;
  }
}
