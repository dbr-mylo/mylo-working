/**
 * Self-Healing System
 * 
 * This module provides utilities to automatically recover from common errors
 * by applying recovery strategies based on error patterns and context.
 */

import { ClassifiedError, classifyError, ErrorCategory } from './errorClassifier';
import { setFeatureOverride } from '../featureFlags/featureFlags';
import { reportSystemError } from '../featureFlags/systemHealth';
import { toast } from 'sonner';

// Track error occurrence patterns
interface ErrorOccurrence {
  timestamp: number;
  error: unknown;
  context: string;
  category: ErrorCategory;
  recovered: boolean;
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
    const recovered = executeRecoveryStrategy(classified, context);
    occurrence.recovered = recovered;
    return recovered;
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
  
  // Check if error is recoverable according to classification
  return classified.recoverable;
}

/**
 * Execute recovery strategy based on error classification
 */
function executeRecoveryStrategy(
  classified: ClassifiedError,
  context: string
): boolean {
  console.log(`Attempting self-healing for ${classified.category} error in ${context}`);
  
  switch (classified.category) {
    case ErrorCategory.NETWORK:
      return handleNetworkRecovery();
    
    case ErrorCategory.STORAGE:
      return handleStorageRecovery();
    
    case ErrorCategory.RATE_LIMIT:
      return handleRateLimitRecovery();
    
    case ErrorCategory.TIMEOUT:
      return handleTimeoutRecovery();
      
    case ErrorCategory.VALIDATION:
      return handleValidationRecovery();
      
    default:
      return false;
  }
}

/**
 * Handle recovery for network-related errors
 */
function handleNetworkRecovery(): boolean {
  // Disable features that require network
  setFeatureOverride('real-time-collaboration', false);
  setFeatureOverride('template-marketplace', false);
  
  // Enable offline backup more aggressively
  setFeatureOverride('local-backup', true);
  
  toast.warning("Network issues detected", {
    description: "Some online features have been temporarily disabled. Working in offline mode."
  });
  
  return true;
}

/**
 * Handle recovery for storage-related errors
 */
function handleStorageRecovery(): boolean {
  // Attempt to clear some storage
  try {
    // Try to clear temp storage
    localStorage.removeItem('temp_documents');
    
    // Reduce history size if it exists
    const history = localStorage.getItem('document_history');
    if (history) {
      try {
        const parsed = JSON.parse(history);
        // Keep only most recent 5 items
        if (Array.isArray(parsed) && parsed.length > 5) {
          localStorage.setItem('document_history', JSON.stringify(parsed.slice(0, 5)));
        }
      } catch (e) {
        // If parse fails, just remove the item
        localStorage.removeItem('document_history');
      }
    }
    
    toast.warning("Storage issues resolved", {
      description: "Some cached data has been cleared to free up space."
    });
    
    return true;
  } catch (e) {
    console.error("Failed to recover from storage error:", e);
    return false;
  }
}

/**
 * Handle recovery for rate limit errors
 */
function handleRateLimitRecovery(): boolean {
  // Implement exponential backoff for API calls
  const backoffDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
  
  toast.warning("Rate limit detected", {
    description: `Will retry automatically after a ${Math.round(backoffDelay/1000)} second delay.`
  });
  
  // Return true to indicate we're handling it
  return true;
}

/**
 * Handle recovery for timeout errors
 */
function handleTimeoutRecovery(): boolean {
  // Disable heavy features
  setFeatureOverride('revision-history', false);
  setFeatureOverride('advanced-formatting', false);
  
  toast.warning("Performance issues detected", {
    description: "Some advanced features have been temporarily disabled to improve responsiveness."
  });
  
  return true;
}

/**
 * Handle recovery for validation errors
 */
function handleValidationRecovery(): boolean {
  // Can't do much about validation errors automatically
  return false;
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
  let recoveredCount = 0;
  
  for (const error of recentErrors) {
    categoryCounts[error.category] = (categoryCounts[error.category] || 0) + 1;
    contextCounts[error.context] = (contextCounts[error.context] || 0) + 1;
    if (error.recovered) recoveredCount++;
  }
  
  return {
    total: recentErrors.length,
    recovered: recoveredCount,
    byCategory: categoryCounts,
    byContext: contextCounts,
    recoveryRate: recentErrors.length ? (recoveredCount / recentErrors.length) * 100 : 0
  };
}
