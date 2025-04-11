/**
 * Self-healing system functions for error recovery
 */

import { ErrorCategory, classifyError } from "./errorClassifier";
import { updateSystemHealth } from "../featureFlags/systemHealth";
import { runDiagnostics } from "./diagnostics";

// Track error patterns for automatic recovery
const errorPatterns: Map<string, number> = new Map();
const recoveryAttempts: Map<string, { success: number; failure: number }> = new Map();

// Track error history for analysis and reporting
const errorHistory: Array<{
  category: ErrorCategory;
  message: string;
  context: string;
  timestamp: number;
  recoveryAttempted: boolean;
  recoverySucceeded: boolean;
  stack?: string;
}> = [];

/**
 * Register an error and attempt automatic recovery
 * @param error The error that occurred
 * @param context The context where the error occurred
 * @returns boolean indicating if recovery was attempted
 */
export function registerErrorAndAttemptRecovery(error: unknown, context: string): boolean {
  // Create a key from the error and context
  const errorKey = createErrorKey(error, context);
  
  // Track the error pattern
  trackErrorPattern(errorKey);
  
  // Check if we should attempt recovery
  if (shouldAttemptRecovery(error, context)) {
    return attemptRecovery(error, context);
  }
  
  return false;
}

/**
 * Create a key to identify an error pattern
 */
function createErrorKey(error: unknown, context: string): string {
  if (error instanceof Error) {
    // Use error name, message and context
    return `${error.name}:${error.message.substring(0, 50)}:${context}`;
  } else {
    // Handle non-Error objects
    return `Unknown:${String(error).substring(0, 50)}:${context}`;
  }
}

/**
 * Track error patterns for analysis
 */
function trackErrorPattern(errorKey: string): void {
  const count = errorPatterns.get(errorKey) || 0;
  errorPatterns.set(errorKey, count + 1);
  
  // If we're seeing this error frequently, log it for investigation
  if (count === 5 || count === 10 || count === 50) {
    console.warn(`Frequent error pattern detected (${count} occurrences): ${errorKey}`);
  }
}

/**
 * Track an error occurrence for analytics and reporting
 */
export function trackErrorOccurrence(
  category: ErrorCategory,
  message: string, 
  context: string, 
  recoveryAttempted: boolean,
  recoverySucceeded: boolean,
  stack?: string
): void {
  errorHistory.push({
    category,
    message,
    context,
    timestamp: Date.now(),
    recoveryAttempted,
    recoverySucceeded,
    stack
  });
  
  // Trim history if it gets too large
  if (errorHistory.length > 1000) {
    errorHistory.shift();
  }
}

/**
 * Track a recovery attempt
 */
export function trackRecoveryAttempt(
  category: ErrorCategory, 
  context: string, 
  succeeded: boolean
): void {
  // Add to error history
  trackErrorOccurrence(
    category,
    `Recovery ${succeeded ? 'succeeded' : 'failed'}`,
    context,
    true,
    succeeded
  );
  
  // Update system health
  updateSystemHealth(succeeded ? 1 : -1);
}

/**
 * Determine if we should attempt automatic recovery
 */
function shouldAttemptRecovery(error: unknown, context: string): boolean {
  // Classify the error to determine if it's recoverable
  const classified = classifyError(error, context);
  
  // Only attempt recovery for certain types of errors
  switch (classified.category) {
    case ErrorCategory.NETWORK:
    case ErrorCategory.STORAGE:
    case ErrorCategory.TIMEOUT:
      return true;
      
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      // Only attempt recovery for certain authentication errors
      return context.includes('session') || context.includes('token');
      
    default:
      return false;
  }
}

/**
 * Determine if an error category is likely recoverable
 */
export function isLikelyRecoverable(category: ErrorCategory): boolean {
  switch (category) {
    case ErrorCategory.NETWORK:
    case ErrorCategory.STORAGE:
    case ErrorCategory.TIMEOUT:
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      return true;
    default:
      return false;
  }
}

/**
 * Attempt to recover from an error automatically
 */
function attemptRecovery(error: unknown, context: string): boolean {
  const errorKey = createErrorKey(error, context);
  const classified = classifyError(error, context);
  
  // Track recovery attempts
  const attempts = recoveryAttempts.get(errorKey) || { success: 0, failure: 0 };
  
  try {
    let recoverySuccess = false;
    
    // Apply recovery strategy based on error category
    switch (classified.category) {
      case ErrorCategory.NETWORK:
        recoverySuccess = handleNetworkRecovery();
        break;
        
      case ErrorCategory.STORAGE:
        recoverySuccess = handleStorageRecovery();
        break;
        
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.AUTH:
      case ErrorCategory.SESSION:
        recoverySuccess = handleAuthRecovery();
        break;
        
      case ErrorCategory.TIMEOUT:
        recoverySuccess = handleTimeoutRecovery();
        break;
        
      default:
        return false;
    }
    
    // Update recovery metrics
    if (recoverySuccess) {
      attempts.success++;
      recoveryAttempts.set(errorKey, attempts);
      updateSystemHealth(1); // Improve system health slightly
      return true;
    } else {
      attempts.failure++;
      recoveryAttempts.set(errorKey, attempts);
      updateSystemHealth(-1); // Decrease system health slightly
      return false;
    }
  } catch (recoveryError) {
    console.error("Error during recovery attempt:", recoveryError);
    attempts.failure++;
    recoveryAttempts.set(errorKey, attempts);
    updateSystemHealth(-2); // Decrease system health more on recovery failure
    return false;
  }
}

/**
 * Handle network-related error recovery
 */
function handleNetworkRecovery(): boolean {
  // Run network diagnostics
  runDiagnostics();
  
  // Attempt to re-establish network connection if offline
  if (!navigator.onLine) {
    // Can't force online, but we've checked the status
    console.log("Network recovery: Device is offline. Waiting for reconnection...");
    return false;
  }
  
  console.log("Network recovery: Device is online, recovery possible");
  return true;
}

/**
 * Handle storage-related error recovery
 */
function handleStorageRecovery(): boolean {
  try {
    // Test localStorage access
    const testKey = '___recovery_test___';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    console.log("Storage recovery: Local storage is accessible");
    return true;
  } catch (e) {
    console.error("Storage recovery failed:", e);
    return false;
  }
}

/**
 * Handle authentication-related error recovery
 */
function handleAuthRecovery(): boolean {
  // Check if we have a refresh token
  const hasRefreshToken = localStorage.getItem('refresh_token') !== null;
  
  if (hasRefreshToken) {
    console.log("Auth recovery: Refresh token available, recovery possible");
    // In a real implementation, we'd trigger a token refresh here
    return true;
  }
  
  console.log("Auth recovery: No refresh token available");
  return false;
}

/**
 * Handle timeout-related error recovery
 */
function handleTimeoutRecovery(): boolean {
  // Not much we can do automatically for timeouts
  // except indicate that retries might work
  console.log("Timeout recovery: Suggesting retry with longer timeout");
  return false;
}

/**
 * Get information about all error categories
 */
export function getAllErrorCategoryInfo(): Array<{
  category: string;
  occurrences: number;
  recoveryAttempted: number;
  recoverySucceeded: number;
  recoveryRate: number;
}> {
  // Create a map to aggregate stats by category
  const categoryCounts = new Map<string, {
    occurrences: number;
    attempted: number;
    succeeded: number;
  }>();
  
  // Process error history
  errorHistory.forEach(error => {
    const category = error.category;
    if (!categoryCounts.has(category)) {
      categoryCounts.set(category, { occurrences: 0, attempted: 0, succeeded: 0 });
    }
    
    const counts = categoryCounts.get(category)!;
    counts.occurrences++;
    
    if (error.recoveryAttempted) {
      counts.attempted++;
      if (error.recoverySucceeded) {
        counts.succeeded++;
      }
    }
  });
  
  // Convert to array for return
  return Array.from(categoryCounts).map(([category, counts]) => {
    return {
      category,
      occurrences: counts.occurrences,
      recoveryAttempted: counts.attempted,
      recoverySucceeded: counts.succeeded,
      recoveryRate: counts.attempted > 0 ? counts.succeeded / counts.attempted : 0
    };
  });
}

/**
 * Get recent errors from the history
 * @param category Optional category filter
 * @param limit Maximum number of errors to return
 */
export function getRecentErrors(category?: ErrorCategory, limit = 20): Array<{
  category: ErrorCategory;
  message: string;
  context: string;
  timestamp: number;
  recoveryAttempted: boolean;
  recoverySucceeded: boolean;
}> {
  // Filter by category if specified
  const filtered = category 
    ? errorHistory.filter(err => err.category === category)
    : errorHistory;
  
  // Sort by timestamp (newest first) and limit
  return [...filtered]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Reset error analytics data
 */
export function resetErrorAnalytics(): void {
  errorPatterns.clear();
  recoveryAttempts.clear();
}

/**
 * Clear error history
 */
export function clearErrorHistory(): void {
  errorHistory.length = 0;
}

/**
 * Get information about a specific error category
 */
export function getErrorCategoryInfo(category: ErrorCategory) {
  // Convert recovery attempts to array and filter by category
  const categoryErrors: { key: string; attempts: { success: number; failure: number } }[] = [];
  
  recoveryAttempts.forEach((attempts, key) => {
    // Simple check to see if the key contains the category name
    // In a real system, we'd have better categorization
    if (key.toLowerCase().includes(category.toLowerCase())) {
      categoryErrors.push({ key, attempts });
    }
  });
  
  // Calculate success rate
  let totalSuccess = 0;
  let totalAttempts = 0;
  
  categoryErrors.forEach(({ attempts }) => {
    totalSuccess += attempts.success;
    totalAttempts += attempts.success + attempts.failure;
  });
  
  const successRate = totalAttempts > 0 ? (totalSuccess / totalAttempts) * 100 : 0;
  
  return {
    errorCount: categoryErrors.length,
    totalAttempts,
    totalSuccess,
    successRate,
    recentErrors: categoryErrors.slice(0, 5) // Just return the 5 most recent
  };
}
