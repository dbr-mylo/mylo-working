
/**
 * Utility functions for running diagnostics
 */

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
    
    return storageAvailable && networkAvailable && browserCompatible;
  } catch (error) {
    console.error('Error running diagnostics:', error);
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
    
    // Log individual checks
    console.log('    Local Storage available:', hasLocalStorage ? '✓' : '✗');
    console.log('    Session Storage available:', hasSessionStorage ? '✓' : '✗');
    console.log('    Promises supported:', hasPromises ? '✓' : '✗');
    console.log('    Async/await supported:', hasAsync ? '✓' : '✗');
    console.log('    URL API supported:', hasURLAPI ? '✓' : '✗');
    
    return hasLocalStorage && hasSessionStorage && hasPromises && hasAsync && hasURLAPI;
  } catch (error) {
    console.error('  Browser compatibility check failed:', error);
    return false;
  }
}
