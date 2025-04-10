
import { toast } from "sonner";

/**
 * Application diagnostics tool
 * 
 * This utility provides diagnostics functions to help troubleshoot 
 * common issues in the application.
 */

/**
 * Run a diagnostic check on the application
 * This function will check for common issues and report them
 */
export const runDiagnostics = () => {
  console.log("🔍 Running application diagnostics...");
  
  // Check local storage
  const localStorageCheck = checkLocalStorage();
  
  // Check browser compatibility
  const browserCheck = checkBrowserCompatibility();
  
  // Check for extensions that might interfere
  const extensionsCheck = checkProblematicExtensions();
  
  // Output results
  console.log("📊 Diagnostics results:");
  console.log(`- Local Storage: ${localStorageCheck ? "✅ Available" : "❌ Unavailable"}`);
  console.log(`- Browser Compatibility: ${browserCheck ? "✅ Compatible" : "❌ May have issues"}`);
  console.log(`- Extensions: ${extensionsCheck ? "✅ No issues detected" : "⚠️ Potential conflicts"}`);
  
  // Return the overall status
  const overallStatus = localStorageCheck && browserCheck && extensionsCheck;
  
  if (!overallStatus) {
    toast.error("Application diagnostic failed", {
      description: "Some system checks failed. See console for details.",
      duration: 5000,
    });
  }
  
  return overallStatus;
};

/**
 * Check if localStorage is available and working
 */
const checkLocalStorage = (): boolean => {
  try {
    localStorage.setItem('diagnostics_test', 'test');
    const result = localStorage.getItem('diagnostics_test') === 'test';
    localStorage.removeItem('diagnostics_test');
    return result;
  } catch (error) {
    console.error("Local storage test failed:", error);
    return false;
  }
};

/**
 * Check for browser compatibility issues
 */
const checkBrowserCompatibility = (): boolean => {
  // Check for required browser features
  const features = {
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    promise: typeof Promise !== 'undefined',
    arrayMethods: typeof Array.prototype.find !== 'undefined' && typeof Array.prototype.includes !== 'undefined'
  };
  
  const allFeaturesAvailable = Object.values(features).every(Boolean);
  
  if (!allFeaturesAvailable) {
    console.warn("Browser compatibility issues detected:", 
      Object.entries(features)
        .filter(([_, available]) => !available)
        .map(([feature]) => feature)
        .join(', ')
    );
  }
  
  return allFeaturesAvailable;
};

/**
 * Check for browser extensions that might interfere with the app
 */
const checkProblematicExtensions = (): boolean => {
  // This is a simplified check that looks for common issues
  // In a real implementation, this would be more sophisticated
  const potentialIssues = [];
  
  // Check for modified DOM functions which might indicate extensions
  // that intercept and modify requests or DOM
  if (HTMLElement.prototype.appendChild.toString().indexOf('native code') === -1) {
    potentialIssues.push('DOM manipulation interceptors');
  }
  
  if (potentialIssues.length > 0) {
    console.warn("Potential browser extension conflicts detected:", potentialIssues.join(', '));
    return false;
  }
  
  return true;
};

/**
 * Run a performance check on the application
 */
export const runPerformanceCheck = () => {
  console.log("⚡ Running performance check...");
  
  const startTime = performance.now();
  
  // Simulate a performance test
  const iterations = 10000;
  let result = 0;
  
  for (let i = 0; i < iterations; i++) {
    result += Math.random();
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`🕒 Performance check completed in ${duration.toFixed(2)}ms`);
  
  // Check if the duration is acceptable
  // This threshold would need to be calibrated based on typical performance
  const isPerformanceGood = duration < 50; // 50ms is an arbitrary threshold
  
  if (!isPerformanceGood) {
    console.warn(`Performance may be degraded. Test took ${duration.toFixed(2)}ms, which exceeds the recommended threshold.`);
  }
  
  return {
    duration,
    isPerformanceGood
  };
};
