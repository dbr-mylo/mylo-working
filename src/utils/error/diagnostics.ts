
/**
 * Run basic application diagnostics
 * 
 * This function checks for common issues that might cause errors:
 * - Browser compatibility
 * - LocalStorage availability
 * - Network connectivity
 * - Memory usage
 * 
 * @returns Boolean indicating if diagnostics completed successfully
 */
export function runDiagnostics(): boolean {
  try {
    console.group('Application Diagnostics');
    
    // Check browser compatibility
    const userAgent = navigator.userAgent;
    console.log('Browser:', userAgent);
    
    // Check localStorage availability
    let localStorageAvailable = false;
    try {
      localStorage.setItem('diagnostics_test', 'test');
      localStorageAvailable = localStorage.getItem('diagnostics_test') === 'test';
      localStorage.removeItem('diagnostics_test');
    } catch (e) {
      localStorageAvailable = false;
    }
    console.log('LocalStorage available:', localStorageAvailable);
    
    // Check network connectivity
    const online = navigator.onLine;
    console.log('Online status:', online ? 'Connected' : 'Disconnected');
    
    // Check memory usage if available
    if (window.performance && window.performance.memory) {
      // @ts-expect-error - memory is non-standard but available in Chrome
      const memory = window.performance.memory;
      console.log('Memory usage:', {
        // @ts-expect-error - memory is non-standard but available in Chrome
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / (1024 * 1024)) + 'MB',
        // @ts-expect-error - memory is non-standard but available in Chrome
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / (1024 * 1024)) + 'MB',
      });
    }
    
    // Check for unhandled promise rejections
    const hasUnhandledRejectionHandler = 'onunhandledrejection' in window;
    console.log('Unhandled rejection handler registered:', hasUnhandledRejectionHandler);
    
    console.groupEnd();
    return true;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    return false;
  }
}

/**
 * Get diagnostic data for reporting
 * 
 * @returns Object containing diagnostic information
 */
export function getDiagnosticData() {
  return {
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    time: new Date().toISOString()
  };
}
