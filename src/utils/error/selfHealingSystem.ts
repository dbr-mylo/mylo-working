
/**
 * Self-Healing System
 * 
 * Provides analytics, tracking, and automated recovery mechanisms
 * for application errors.
 */
import { ErrorCategory } from './errorClassifier';
import { runDiagnostics } from './diagnostics';
import { updateSystemHealth as updateHealth } from '../featureFlags/systemHealth';

// Store error occurrence data for analytics
interface ErrorOccurrence {
  timestamp: number;
  category: ErrorCategory;
  message: string;
  context: string;
  recoveryAttempted: boolean;
  recoverySucceeded: boolean;
  stack?: string;
  sessionId?: string;
}

// Error category analytics
interface ErrorCategoryInfo {
  occurrences: number;
  lastOccurrence: number;
  recoveryAttempts: number;
  successfulRecoveries: number;
  averageRecoveryTime: number;
  category: ErrorCategory;
  recoveryRate: number;
}

// In-memory storage for error tracking
// In a production app, this might be persisted to a backend service
const errorHistory: ErrorOccurrence[] = [];
const errorCategoryStats: Record<ErrorCategory, ErrorCategoryInfo> = {} as Record<ErrorCategory, ErrorCategoryInfo>;
const MAX_ERROR_HISTORY = 100;

/**
 * Track an error occurrence for analytics
 */
export function trackErrorOccurrence(
  category: ErrorCategory,
  message: string,
  context: string,
  recoveryAttempted: boolean = false,
  recoverySucceeded: boolean = false,
  stack?: string
): void {
  // Add to history
  errorHistory.unshift({
    timestamp: Date.now(),
    category,
    message,
    context,
    recoveryAttempted,
    recoverySucceeded,
    stack,
    sessionId: generateSessionId()
  });
  
  // Trim history if it gets too large
  if (errorHistory.length > MAX_ERROR_HISTORY) {
    errorHistory.length = MAX_ERROR_HISTORY;
  }
  
  // Update category stats
  if (!errorCategoryStats[category]) {
    errorCategoryStats[category] = {
      occurrences: 0,
      lastOccurrence: 0,
      recoveryAttempts: 0,
      successfulRecoveries: 0,
      averageRecoveryTime: 0,
      category: category,
      recoveryRate: 0
    };
  }
  
  errorCategoryStats[category].occurrences++;
  errorCategoryStats[category].lastOccurrence = Date.now();
  
  // Log for monitoring
  console.info(`[Error Tracking] ${category} error in ${context}: ${message}`);
}

/**
 * Track a recovery attempt
 */
export function trackRecoveryAttempt(
  category: ErrorCategory,
  context: string,
  succeeded: boolean,
  recoveryTimeMs?: number
): void {
  // Find the most recent matching error
  const matchingError = errorHistory.find(e => 
    e.category === category && e.context === context && !e.recoveryAttempted
  );
  
  if (matchingError) {
    matchingError.recoveryAttempted = true;
    matchingError.recoverySucceeded = succeeded;
  }
  
  // Update category stats
  if (!errorCategoryStats[category]) {
    errorCategoryStats[category] = {
      occurrences: 0,
      lastOccurrence: 0,
      recoveryAttempts: 0,
      successfulRecoveries: 0,
      averageRecoveryTime: 0,
      category: category,
      recoveryRate: 0
    };
  }
  
  errorCategoryStats[category].recoveryAttempts++;
  
  if (succeeded) {
    errorCategoryStats[category].successfulRecoveries++;
    
    // Update average recovery time if provided
    if (recoveryTimeMs) {
      const { averageRecoveryTime, successfulRecoveries } = errorCategoryStats[category];
      const newAverage = (averageRecoveryTime * (successfulRecoveries - 1) + recoveryTimeMs) / successfulRecoveries;
      errorCategoryStats[category].averageRecoveryTime = newAverage;
    }
  }
  
  // Update recovery rate
  const attempts = errorCategoryStats[category].recoveryAttempts;
  const successes = errorCategoryStats[category].successfulRecoveries;
  errorCategoryStats[category].recoveryRate = attempts > 0 ? successes / attempts : 0;
  
  // Log for monitoring
  console.info(`[Recovery Tracking] ${succeeded ? 'Successful' : 'Failed'} recovery for ${category} in ${context}`);
}

/**
 * Register an error and attempt to automatically recover from it
 * @param error The error that occurred
 * @param context The context where the error occurred
 * @returns Boolean indicating whether recovery was attempted
 */
export function registerErrorAndAttemptRecovery(error: Error | unknown, context: string): boolean {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const category = determineErrorCategory(errorObj, context);
  
  // Track the error occurrence
  trackErrorOccurrence(
    category,
    errorObj.message,
    context,
    false,
    false,
    errorObj.stack
  );
  
  // Check if this type of error is recoverable
  if (isLikelyRecoverable(category)) {
    // Attempt recovery
    const startTime = Date.now();
    const succeeded = attemptRecovery(category, context, errorObj);
    const recoveryTime = Date.now() - startTime;
    
    // Track the recovery attempt
    trackRecoveryAttempt(category, context, succeeded, recoveryTime);
    
    return true;
  }
  
  return false;
}

/**
 * Determine error category based on error and context
 */
function determineErrorCategory(error: Error, context: string): ErrorCategory {
  // Simple determination based on error message and context
  const message = error.message.toLowerCase();
  const ctx = context.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || ctx.includes('api')) {
    return ErrorCategory.NETWORK;
  }
  
  if (message.includes('auth') || message.includes('login') || ctx.includes('auth')) {
    return ErrorCategory.AUTHENTICATION;
  }
  
  if (message.includes('permission') || message.includes('access') || ctx.includes('permission')) {
    return ErrorCategory.PERMISSION;
  }
  
  if (message.includes('valid') || message.includes('format') || ctx.includes('form')) {
    return ErrorCategory.VALIDATION;
  }
  
  if (message.includes('storage') || message.includes('space') || ctx.includes('storage')) {
    return ErrorCategory.STORAGE;
  }
  
  if (message.includes('timeout') || message.includes('expired') || ctx.includes('timeout')) {
    return ErrorCategory.TIMEOUT;
  }
  
  // Default
  return ErrorCategory.UNKNOWN;
}

/**
 * Attempt to recover from an error
 */
function attemptRecovery(category: ErrorCategory, context: string, error: Error): boolean {
  // Simple recovery logic based on error category
  switch (category) {
    case ErrorCategory.NETWORK:
      // For network errors, we could retry the operation
      console.info('[Recovery] Attempting network recovery in context:', context);
      return Math.random() > 0.3; // Simulate success rate
    
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      // For auth errors, we could try to refresh the auth token
      console.info('[Recovery] Attempting authentication recovery in context:', context);
      return Math.random() > 0.4;
    
    case ErrorCategory.STORAGE:
      // For storage errors, we could try to free up space
      console.info('[Recovery] Attempting storage recovery in context:', context);
      return Math.random() > 0.5;
    
    default:
      // For other errors, no specific recovery strategy
      console.info('[Recovery] No specific recovery strategy for', category, 'in context:', context);
      return false;
  }
}

/**
 * Check if an error category is likely recoverable based on history
 */
export function isLikelyRecoverable(category: ErrorCategory): boolean {
  const stats = errorCategoryStats[category];
  
  // If we have no data, default to true for better user experience
  if (!stats || stats.recoveryAttempts === 0) {
    return true;
  }
  
  // Calculate recovery success rate
  const successRate = stats.successfulRecoveries / stats.recoveryAttempts;
  
  // If more than 30% of recovery attempts succeed, consider it recoverable
  return successRate > 0.3;
}

/**
 * Get information about a specific error category
 */
export function getErrorCategoryInfo(category: ErrorCategory): ErrorCategoryInfo {
  return errorCategoryStats[category] || {
    occurrences: 0,
    lastOccurrence: 0,
    recoveryAttempts: 0,
    successfulRecoveries: 0,
    averageRecoveryTime: 0,
    category: category,
    recoveryRate: 0
  };
}

/**
 * Get all error category information
 */
export function getAllErrorCategoryInfo(): ErrorCategoryInfo[] {
  return Object.values(errorCategoryStats).map(info => ({
    ...info,
    recoveryRate: info.recoveryAttempts > 0 
      ? info.successfulRecoveries / info.recoveryAttempts 
      : 0
  }));
}

/**
 * Get recent errors, optionally filtered by category
 */
export function getRecentErrors(category?: ErrorCategory, limit: number = 20): ErrorOccurrence[] {
  if (category) {
    return errorHistory.filter(e => e.category === category).slice(0, limit);
  }
  return errorHistory.slice(0, limit);
}

/**
 * Reset error analytics data
 */
export function resetErrorAnalytics(): void {
  Object.keys(errorCategoryStats).forEach(key => {
    const category = key as ErrorCategory;
    errorCategoryStats[category] = {
      occurrences: 0,
      lastOccurrence: 0,
      recoveryAttempts: 0,
      successfulRecoveries: 0,
      averageRecoveryTime: 0,
      category: category,
      recoveryRate: 0
    };
  });
}

/**
 * Clear error history data
 */
export function clearErrorHistory(): void {
  errorHistory.length = 0;
}

/**
 * Helper function to generate a session ID for grouping related errors
 */
function generateSessionId(): string {
  // Simple implementation - in a real app this would be more sophisticated
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Run system diagnostics and update system health score
 */
export async function runSystemDiagnostics(): Promise<number> {
  const diagnosticsSucceeded = await runDiagnostics();
  // Update system health based on diagnostics results
  const healthImpact = diagnosticsSucceeded ? 10 : -20;
  updateSystemHealth(healthImpact);
  return healthImpact;
}

/**
 * Update system health score
 */
export function updateSystemHealth(delta: number): void {
  updateHealth(delta);
}
