/**
 * Self-healing system utilities
 * 
 * This module provides tools for tracking error patterns,
 * automatically recovering from certain errors, and
 * providing analytics on system health and error rates.
 */

import { ErrorCategory, classifyError } from './errorClassifier';
import { getLocalStorage, setLocalStorage } from '../storage/localStorage';

// Types for error tracking
export interface ErrorCategoryInfo {
  category: ErrorCategory;
  occurrences: number;
  contexts: string[];
  recoveryAttempted: number;
  recoverySucceeded: number;
  recoveryRate: number;
  lastOccurrence: number;
  firstOccurrence: number;
}

export interface ErrorOccurrence {
  category: ErrorCategory;
  message: string;
  context: string;
  timestamp: number;
  recoveryAttempted: boolean;
  recoverySucceeded: boolean;
  stack?: string;
}

// Key for storing error history in localStorage
const ERROR_HISTORY_KEY = 'error_tracking_history';
const ERROR_ANALYTICS_KEY = 'error_analytics';

// Maximum number of errors to track
const MAX_ERROR_HISTORY = 100;

// Time window for considering "recent" errors (24 hours)
const RECENT_ERROR_WINDOW = 24 * 60 * 60 * 1000;

/**
 * Register an error and attempt automatic recovery based on error classification
 * @param error The error to handle
 * @param context Context where the error occurred
 * @returns Boolean indicating whether recovery was attempted
 */
export function registerErrorAndAttemptRecovery(error: unknown, context: string): boolean {
  try {
    // Classify the error
    const classifiedError = classifyError(error, context);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Determine if error is likely recoverable based on historical data
    const likelyRecoverable = isLikelyRecoverable(classifiedError.category);
    let recoveryAttempted = false;
    let recoverySucceeded = false;
    
    // Attempt recovery based on error type
    if (likelyRecoverable) {
      recoveryAttempted = true;
      
      switch (classifiedError.category) {
        case ErrorCategory.NETWORK:
          // Simple network recovery attempt
          recoverySucceeded = attemptNetworkRecovery();
          break;
        case ErrorCategory.STORAGE:
          // Storage error recovery attempt
          recoverySucceeded = attemptStorageRecovery();
          break;
        case ErrorCategory.AUTH:
        case ErrorCategory.AUTHENTICATION:
          // Auth error recovery attempt
          recoverySucceeded = false; // Auth errors require explicit handling by session recovery service
          break;
        default:
          recoveryAttempted = false;
          break;
      }
    }
    
    // Track the error occurrence
    trackErrorOccurrence(
      classifiedError.category,
      errorMessage,
      context,
      recoveryAttempted,
      recoverySucceeded,
      error instanceof Error ? error.stack : undefined
    );
    
    return recoveryAttempted;
  } catch (e) {
    console.error('Failed to register error and attempt recovery:', e);
    return false;
  }
}

/**
 * Attempt to recover from a network error
 * @returns Boolean indicating whether recovery was successful
 */
function attemptNetworkRecovery(): boolean {
  try {
    // Simple check for online status
    return navigator.onLine;
  } catch (e) {
    return false;
  }
}

/**
 * Attempt to recover from a storage error
 * @returns Boolean indicating whether recovery was successful
 */
function attemptStorageRecovery(): boolean {
  try {
    // Test localStorage access
    const testKey = '___test_storage_recovery___';
    localStorage.setItem(testKey, 'test');
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return testValue === 'test';
  } catch (e) {
    return false;
  }
}

/**
 * Record an error occurrence in the tracking system
 * @param category Error category
 * @param message Error message
 * @param context Context where the error occurred
 * @param recoveryAttempted Whether recovery was attempted
 * @param recoverySucceeded Whether recovery succeeded (only relevant if recovery was attempted)
 * @param stack Optional stack trace
 */
export function trackErrorOccurrence(
  category: ErrorCategory,
  message: string,
  context: string,
  recoveryAttempted = false,
  recoverySucceeded = false,
  stack?: string
): void {
  try {
    // Create the new error occurrence
    const errorOccurrence: ErrorOccurrence = {
      category,
      message,
      context,
      timestamp: Date.now(),
      recoveryAttempted,
      recoverySucceeded,
      stack
    };
    
    // Get existing error history
    const errorHistory = getErrorHistory();
    
    // Add new occurrence to history
    errorHistory.unshift(errorOccurrence);
    
    // Limit the history size
    while (errorHistory.length > MAX_ERROR_HISTORY) {
      errorHistory.pop();
    }
    
    // Save updated history
    setLocalStorage(ERROR_HISTORY_KEY, errorHistory);
    
    // Update analytics
    updateErrorAnalytics(errorOccurrence);
  } catch (e) {
    console.error('Failed to track error occurrence:', e);
  }
}

/**
 * Track recovery attempt result
 * @param category Error category
 * @param context Error context
 * @param succeeded Whether the recovery succeeded
 */
export function trackRecoveryAttempt(
  category: ErrorCategory,
  context: string,
  succeeded: boolean
): void {
  try {
    // Get analytics
    const analytics = getErrorAnalytics();
    
    // Find the category info
    const categoryInfo = analytics.find(info => info.category === category);
    
    if (categoryInfo) {
      // Update recovery stats
      categoryInfo.recoveryAttempted++;
      if (succeeded) {
        categoryInfo.recoverySucceeded++;
      }
      categoryInfo.recoveryRate = categoryInfo.recoveryAttempted > 0 
        ? categoryInfo.recoverySucceeded / categoryInfo.recoveryAttempted 
        : 0;
      
      // Save updated analytics
      setLocalStorage(ERROR_ANALYTICS_KEY, analytics);
    }
  } catch (e) {
    console.error('Failed to track recovery attempt:', e);
  }
}

/**
 * Get information about a specific error category
 * @param category The error category to get info for
 * @returns Category information or null if not found
 */
export function getErrorCategoryInfo(category: ErrorCategory): ErrorCategoryInfo | null {
  try {
    const analytics = getErrorAnalytics();
    return analytics.find(info => info.category === category) || null;
  } catch (e) {
    console.error('Failed to get error category info:', e);
    return null;
  }
}

/**
 * Get a list of all error categories with their statistics
 * @returns Array of error category information
 */
export function getAllErrorCategoryInfo(): ErrorCategoryInfo[] {
  try {
    return getErrorAnalytics();
  } catch (e) {
    console.error('Failed to get error analytics:', e);
    return [];
  }
}

/**
 * Get recent errors of a specific category
 * @param category Error category
 * @param limit Maximum number of errors to return
 * @returns Array of recent error occurrences
 */
export function getRecentErrors(category?: ErrorCategory, limit = 10): ErrorOccurrence[] {
  try {
    const errorHistory = getErrorHistory();
    
    // Filter by category if provided
    const filtered = category 
      ? errorHistory.filter(error => error.category === category) 
      : errorHistory;
    
    // Return limited number
    return filtered.slice(0, limit);
  } catch (e) {
    console.error('Failed to get recent errors:', e);
    return [];
  }
}

/**
 * Get error occurrences by context
 * @param context The context to filter by
 * @param limit Maximum number of errors to return
 * @returns Array of error occurrences from the specified context
 */
export function getErrorsByContext(context: string, limit = 10): ErrorOccurrence[] {
  try {
    const errorHistory = getErrorHistory();
    const filtered = errorHistory.filter(error => error.context === context);
    return filtered.slice(0, limit);
  } catch (e) {
    console.error('Failed to get errors by context:', e);
    return [];
  }
}

/**
 * Clear error history
 */
export function clearErrorHistory(): void {
  try {
    setLocalStorage(ERROR_HISTORY_KEY, []);
  } catch (e) {
    console.error('Failed to clear error history:', e);
  }
}

/**
 * Reset error analytics
 */
export function resetErrorAnalytics(): void {
  try {
    setLocalStorage(ERROR_ANALYTICS_KEY, []);
  } catch (e) {
    console.error('Failed to reset error analytics:', e);
  }
}

/**
 * Get the most frequent error categories in the specified time window
 * @param timeWindow Time window in milliseconds (default: 24 hours)
 * @returns Array of categories sorted by frequency
 */
export function getMostFrequentErrorCategories(timeWindow = RECENT_ERROR_WINDOW): ErrorCategory[] {
  try {
    const errorHistory = getErrorHistory();
    const now = Date.now();
    const recentErrors = errorHistory.filter(error => now - error.timestamp < timeWindow);
    
    // Count occurrences by category
    const categoryCounts = new Map<ErrorCategory, number>();
    recentErrors.forEach(error => {
      const count = categoryCounts.get(error.category) || 0;
      categoryCounts.set(error.category, count + 1);
    });
    
    // Sort by count (descending)
    return Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  } catch (e) {
    console.error('Failed to get most frequent error categories:', e);
    return [];
  }
}

/**
 * Get recovery rate for a specific error category
 * @param category Error category
 * @returns Recovery rate (0-1) or null if no recovery attempts
 */
export function getRecoveryRate(category: ErrorCategory): number | null {
  try {
    const categoryInfo = getErrorCategoryInfo(category);
    
    if (!categoryInfo || categoryInfo.recoveryAttempted === 0) {
      return null;
    }
    
    return categoryInfo.recoveryRate;
  } catch (e) {
    console.error('Failed to get recovery rate:', e);
    return null;
  }
}

/**
 * Check if an error is likely to be recoverable based on historical data
 * @param category Error category
 * @returns true if the error is likely recoverable, false otherwise
 */
export function isLikelyRecoverable(category: ErrorCategory): boolean {
  try {
    const recoveryRate = getRecoveryRate(category);
    
    // If we have no data, assume it's not recoverable
    if (recoveryRate === null) {
      return false;
    }
    
    // If the recovery rate is above 50%, consider it recoverable
    return recoveryRate > 0.5;
  } catch (e) {
    console.error('Failed to check if error is likely recoverable:', e);
    return false;
  }
}

// Helper functions

/**
 * Get error history from localStorage
 * @returns Array of error occurrences
 */
function getErrorHistory(): ErrorOccurrence[] {
  try {
    const history = getLocalStorage<ErrorOccurrence[]>(ERROR_HISTORY_KEY);
    return history || [];
  } catch (e) {
    console.error('Failed to get error history:', e);
    return [];
  }
}

/**
 * Get error analytics from localStorage
 * @returns Array of error category information
 */
function getErrorAnalytics(): ErrorCategoryInfo[] {
  try {
    const analytics = getLocalStorage<ErrorCategoryInfo[]>(ERROR_ANALYTICS_KEY);
    return analytics || [];
  } catch (e) {
    console.error('Failed to get error analytics:', e);
    return [];
  }
}

/**
 * Update error analytics with a new error occurrence
 * @param error The new error occurrence
 */
function updateErrorAnalytics(error: ErrorOccurrence): void {
  try {
    const analytics = getErrorAnalytics();
    
    // Find existing category info
    let categoryInfo = analytics.find(info => info.category === error.category);
    
    if (!categoryInfo) {
      // Create new category info if it doesn't exist
      categoryInfo = {
        category: error.category,
        occurrences: 0,
        contexts: [],
        recoveryAttempted: 0,
        recoverySucceeded: 0,
        recoveryRate: 0,
        lastOccurrence: error.timestamp,
        firstOccurrence: error.timestamp
      };
      analytics.push(categoryInfo);
    }
    
    // Update category info
    categoryInfo.occurrences++;
    categoryInfo.lastOccurrence = error.timestamp;
    
    // Add context if it doesn't exist
    if (!categoryInfo.contexts.includes(error.context)) {
      categoryInfo.contexts.push(error.context);
    }
    
    // Update recovery stats if applicable
    if (error.recoveryAttempted) {
      categoryInfo.recoveryAttempted++;
      if (error.recoverySucceeded) {
        categoryInfo.recoverySucceeded++;
      }
      categoryInfo.recoveryRate = categoryInfo.recoverySucceeded / categoryInfo.recoveryAttempted;
    }
    
    // Save updated analytics
    setLocalStorage(ERROR_ANALYTICS_KEY, analytics);
  } catch (e) {
    console.error('Failed to update error analytics:', e);
  }
}
