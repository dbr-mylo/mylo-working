/**
 * Self-Healing System
 * 
 * This module provides utilities to automatically recover from common errors
 * by applying recovery strategies based on error patterns and context.
 */

import { ClassifiedError, classifyError, ErrorCategory } from './errorClassifier';
import { executeRecoveryStrategy, RecoveryResult } from './errorRecoveryStrategies';
import { reportSystemError } from '../featureFlags/systemHealth';

// Track error occurrence patterns
interface ErrorOccurrence {
  timestamp: number;
  error: unknown;
  context: string;
  category: ErrorCategory;
  recovered: boolean;
  recoveryResult?: RecoveryResult;
}

// Keep recent error history
const recentErrors: ErrorOccurrence[] = [];

// Define maximum error occurrences before triggering mitigation
const ERROR_THRESHOLD = 3;
const ERROR_TIME_WINDOW = 5 * 60 * 1000; // 5 minutes

/**
 * Register an error occurrence and attempt self-healing if applicable
 * @param error The error object
 * @param context The context where the error occurred
 * @returns Whether recovery was attempted
 */
export function registerErrorAndAttemptRecovery(
  error: unknown,
  context: string
): boolean {
  // Classify the error
  const classified = classifyError(error, context);
  
  // Report to system health
  reportSystemError(error, context);
  
  // Record the error
  const occurrence: ErrorOccurrence = {
    timestamp: Date.now(),
    error,
    context,
    category: classified.category,
    recovered: false
  };
  
  recentErrors.push(occurrence);
  
  // Clean up old errors
  cleanupOldErrors();
  
  // Check if we should attempt recovery
  if (shouldAttemptRecovery(classified, context)) {
    const recoveryResult = executeRecoveryStrategy(classified, context);
    occurrence.recovered = recoveryResult.successful;
    occurrence.recoveryResult = recoveryResult;
    return recoveryResult.successful;
  }
  
  return false;
}

/**
 * Determine if we should attempt automatic recovery
 */
function shouldAttemptRecovery(
  classified: ClassifiedError,
  context: string
): boolean {
  // Get recent errors of the same category in this context
  const similarErrors = recentErrors.filter(e => 
    e.category === classified.category && 
    e.context === context &&
    e.timestamp > Date.now() - ERROR_TIME_WINDOW
  );
  
  // If multiple similar errors, try to recover
  if (similarErrors.length >= ERROR_THRESHOLD) {
    return true;
  }
  
  // For critical systems, attempt recovery on first error
  if (context.includes('document-save') ||
      context.includes('auth') ||
      context.includes('backup')) {
    return true;
  }
  
  // Check if error is recoverable according to classification
  return classified.recoverable;
}

/**
 * Remove error entries older than the time window
 */
function cleanupOldErrors(): void {
  const cutoff = Date.now() - ERROR_TIME_WINDOW;
  
  // Remove old errors
  while (recentErrors.length > 0 && recentErrors[0].timestamp < cutoff) {
    recentErrors.shift();
  }
  
  // Limit array size to prevent memory issues
  if (recentErrors.length > 100) {
    recentErrors.splice(0, recentErrors.length - 100);
  }
}

/**
 * Get analysis of recent errors for diagnostics
 */
export function getErrorAnalytics() {
  // Count errors by category
  const categoryCounts: Record<ErrorCategory, number> = {} as Record<ErrorCategory, number>;
  const contextCounts: Record<string, number> = {};
  const strategyCounts: Record<string, { attempted: number, successful: number }> = {};
  
  let recoveredCount = 0;
  
  for (const error of recentErrors) {
    categoryCounts[error.category] = (categoryCounts[error.category] || 0) + 1;
    contextCounts[error.context] = (contextCounts[error.context] || 0) + 1;
    
    if (error.recovered) {
      recoveredCount++;
    }
    
    // Track recovery strategies
    if (error.recoveryResult) {
      const strategy = error.recoveryResult.strategy;
      if (!strategyCounts[strategy]) {
        strategyCounts[strategy] = { attempted: 0, successful: 0 };
      }
      
      strategyCounts[strategy].attempted++;
      
      if (error.recoveryResult.successful) {
        strategyCounts[strategy].successful++;
      }
    }
  }
  
  return {
    total: recentErrors.length,
    recovered: recoveredCount,
    byCategory: categoryCounts,
    byContext: contextCounts,
    byStrategy: strategyCounts,
    recoveryRate: recentErrors.length ? (recoveredCount / recentErrors.length) * 100 : 0,
    recentErrors: recentErrors.slice(-10) // Return the 10 most recent errors
  };
}

/**
 * Reset recovery state - used for testing or when manually resolving issues
 */
export function resetRecoveryState(): void {
  recentErrors.length = 0;
}

/**
 * Get information about a specific error category
 */
export function getErrorCategoryInfo(category: ErrorCategory) {
  const errors = recentErrors.filter(e => e.category === category);
  const contexts = new Set(errors.map(e => e.context));
  
  const recoveryAttempted = errors.filter(e => e.recoveryResult).length;
  const recoverySucceeded = errors.filter(e => e.recovered).length;
  
  return {
    category,
    occurrences: errors.length,
    contexts: Array.from(contexts),
    recoveryAttempted,
    recoverySucceeded,
    recoveryRate: recoveryAttempted ? (recoverySucceeded / recoveryAttempted) * 100 : 0
  };
}
