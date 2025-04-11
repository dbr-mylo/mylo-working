
/**
 * Self-Healing System
 * 
 * Provides analytics, tracking, and automated recovery mechanisms
 * for application errors.
 */
import { ErrorCategory } from './errorClassifier';
import { runDiagnostics } from './diagnostics';

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
      averageRecoveryTime: 0
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
      averageRecoveryTime: 0
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
  
  // Log for monitoring
  console.info(`[Recovery Tracking] ${succeeded ? 'Successful' : 'Failed'} recovery for ${category} in ${context}`);
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
    averageRecoveryTime: 0
  };
}

/**
 * Get all error category information
 */
export function getAllErrorCategoryInfo(): Record<ErrorCategory, ErrorCategoryInfo> {
  return { ...errorCategoryStats };
}

/**
 * Get recent errors, optionally filtered by category
 */
export function getRecentErrors(category?: ErrorCategory): ErrorOccurrence[] {
  if (category) {
    return errorHistory.filter(e => e.category === category).slice(0, 20);
  }
  return errorHistory.slice(0, 20);
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
      averageRecoveryTime: 0
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
 * Export the updateSystemHealth function to be used by systemHealth.ts
 */
export function updateSystemHealth(delta: number): void {
  // This function will be implemented in systemHealth.ts
  // But we declare it here to satisfy the import in other files
  console.log('updateSystemHealth called with delta:', delta);
}
