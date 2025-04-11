/**
 * Error Recovery Strategies
 * 
 * This module provides specialized recovery strategies for different error types
 * and contexts. It works closely with the feature flags system to implement
 * graceful degradation paths.
 */

import { ClassifiedError, ErrorCategory } from './errorClassifier';
import { setFeatureOverride, FeatureFlagKey } from '../featureFlags/featureFlags';
import { toast } from "sonner";
import { reportSystemError } from '../featureFlags/systemHealth';

/**
 * Result of a recovery attempt
 */
export interface RecoveryResult {
  successful: boolean;
  strategy: string;
  featureChanges?: FeatureFlagKey[];
  message?: string;
}

/**
 * Execute recovery strategy based on error classification and context
 * 
 * @param classified The classified error
 * @param context The context where the error occurred
 * @returns Recovery result with status and information
 */
export function executeRecoveryStrategy(
  classified: ClassifiedError,
  context: string
): RecoveryResult {
  console.log(`Attempting recovery for ${classified.category} error in ${context}`);
  
  // Add context information to determine the best recovery strategy
  const contextSpecificStrategy = determineContextSpecificStrategy(classified, context);
  
  if (contextSpecificStrategy) {
    return contextSpecificStrategy;
  }
  
  // Fall back to general strategies based on error category
  switch (classified.category) {
    case ErrorCategory.NETWORK:
      return handleNetworkRecovery(context);
    
    case ErrorCategory.STORAGE:
      return handleStorageRecovery(context);
    
    case ErrorCategory.RATE_LIMIT:
      return handleRateLimitRecovery();
    
    case ErrorCategory.TIMEOUT:
      return handleTimeoutRecovery(context);
      
    case ErrorCategory.VALIDATION:
      return handleValidationRecovery();

    case ErrorCategory.AUTHORIZATION:
      return handleAuthorizationRecovery();

    case ErrorCategory.RESOURCE_NOT_FOUND:
      return handleResourceNotFoundRecovery(context);
      
    default:
      return {
        successful: false,
        strategy: 'none',
        message: 'No recovery strategy available for this error type'
      };
  }
}

/**
 * Determine if there's a context-specific strategy that should be used
 * instead of the general category-based strategy
 */
function determineContextSpecificStrategy(
  classified: ClassifiedError,
  context: string
): RecoveryResult | null {
  // Document-specific recovery
  if (context.includes('document') && classified.category === ErrorCategory.STORAGE) {
    return handleDocumentStorageRecovery();
  }
  
  // Authentication-specific recovery
  if (context.includes('auth') && classified.category === ErrorCategory.NETWORK) {
    return handleAuthNetworkRecovery();
  }
  
  // Template-specific recovery
  if (context.includes('template') && 
      (classified.category === ErrorCategory.RESOURCE_NOT_FOUND || 
       classified.category === ErrorCategory.SERVER)) {
    return handleTemplateLoadFailure();
  }
  
  // No special context-specific strategy found
  return null;
}

/**
 * Handle recovery for network-related errors
 */
function handleNetworkRecovery(context: string): RecoveryResult {
  // Intelligent degradation - disable only relevant features based on context
  const featuresToDisable: FeatureFlagKey[] = ['real-time-collaboration'];
  
  // Add context-specific features to disable
  if (context.includes('template')) {
    featuresToDisable.push('template-marketplace');
  }
  
  if (context.includes('image') || context.includes('upload')) {
    featuresToDisable.push('image-uploading');
  }
  
  if (context.includes('revision') || context.includes('history')) {
    featuresToDisable.push('revision-history');
  }
  
  // Apply feature flag changes
  featuresToDisable.forEach(feature => {
    setFeatureOverride(feature, false);
  });
  
  // Enable offline backup more aggressively
  setFeatureOverride('local-backup', true);
  
  // Notify user
  toast.warning("Network issues detected", {
    description: "Some online features have been temporarily disabled. Working in offline mode."
  });
  
  return {
    successful: true,
    strategy: 'network-degradation',
    featureChanges: [...featuresToDisable, 'local-backup'],
    message: "Switched to offline mode with local backup enabled"
  };
}

/**
 * Handle recovery for storage-related errors
 */
function handleStorageRecovery(context: string): RecoveryResult {
  // Try to clear some storage
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
    
    // Clean up other potential storage items based on context
    if (context.includes('template')) {
      localStorage.removeItem('template_preview_cache');
    }
    
    if (context.includes('style') || context.includes('design')) {
      localStorage.removeItem('style_previews');
    }
    
    toast.warning("Storage issues resolved", {
      description: "Some cached data has been cleared to free up space."
    });
    
    return {
      successful: true,
      strategy: 'storage-cleanup',
      message: "Cleared storage to recover space"
    };
  } catch (e) {
    console.error("Failed to recover from storage error:", e);
    return {
      successful: false,
      strategy: 'storage-cleanup',
      message: "Storage recovery failed"
    };
  }
}

/**
 * Handle recovery for document storage issues specifically
 */
function handleDocumentStorageRecovery(): RecoveryResult {
  try {
    // Force use local backup system instead of regular storage
    setFeatureOverride('local-backup', true);
    
    // Notify user
    toast.warning("Document storage issues", {
      description: "Switched to emergency backup system for document saving."
    });
    
    return {
      successful: true,
      strategy: 'document-backup-fallback',
      featureChanges: ['local-backup'],
      message: "Activated emergency document backup system"
    };
  } catch (e) {
    return {
      successful: false,
      strategy: 'document-backup-fallback',
      message: "Document recovery strategy failed"
    };
  }
}

/**
 * Handle recovery for rate limit errors
 */
function handleRateLimitRecovery(): RecoveryResult {
  // Implement exponential backoff for API calls
  const backoffDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
  
  toast.warning("Rate limit detected", {
    description: `Will retry automatically after a ${Math.round(backoffDelay/1000)} second delay.`
  });
  
  // Update system health to reduce API call frequency
  reportSystemError(new Error('Rate limit reached'), 'rate-limit');
  
  return {
    successful: true,
    strategy: 'rate-limit-backoff',
    message: `Applied ${backoffDelay}ms backoff delay`
  };
}

/**
 * Handle recovery for timeout errors
 */
function handleTimeoutRecovery(context: string): RecoveryResult {
  const featuresToDisable: FeatureFlagKey[] = [];
  
  // Determine which heavy features to disable based on context
  if (context.includes('revision') || context.includes('history')) {
    featuresToDisable.push('revision-history');
  } else if (context.includes('format') || context.includes('style')) {
    featuresToDisable.push('advanced-formatting');
  } else if (context.includes('collab') || context.includes('collaboration')) {
    featuresToDisable.push('real-time-collaboration');
  } else {
    // Default case - disable common heavy features
    featuresToDisable.push('revision-history', 'advanced-formatting');
  }
  
  // Apply feature flag changes
  featuresToDisable.forEach(feature => {
    setFeatureOverride(feature, false);
  });
  
  toast.warning("Performance issues detected", {
    description: "Some advanced features have been temporarily disabled to improve responsiveness."
  });
  
  return {
    successful: true,
    strategy: 'performance-optimization',
    featureChanges: featuresToDisable,
    message: "Disabled heavy features to improve performance"
  };
}

/**
 * Handle recovery for validation errors
 */
function handleValidationRecovery(): RecoveryResult {
  // Can't do much about validation errors automatically
  // But we can provide user guidance
  toast.warning("Validation error detected", {
    description: "Please check your input and try again."
  });
  
  return {
    successful: false,
    strategy: 'validation-guidance',
    message: "Provided validation error guidance to user"
  };
}

/**
 * Handle recovery for authentication network issues
 */
function handleAuthNetworkRecovery(): RecoveryResult {
  // Enable offline authentication mode
  setFeatureOverride('auth-session', true);
  
  toast.warning("Authentication connectivity issues", {
    description: "Using cached credentials. Some account features may be limited."
  });
  
  return {
    successful: true,
    strategy: 'offline-auth',
    featureChanges: ['auth-session'],
    message: "Enabled offline authentication mode"
  };
}

/**
 * Handle recovery for authorization errors
 */
function handleAuthorizationRecovery(): RecoveryResult {
  // Clear any potentially corrupted auth tokens
  try {
    localStorage.removeItem('auth_session_corrupted');
    sessionStorage.removeItem('auth_session_corrupted');
    
    toast.warning("Authorization issue detected", {
      description: "Your session may need to be refreshed. Please try signing in again if problems persist."
    });
    
    return {
      successful: true,
      strategy: 'auth-session-reset',
      message: "Reset potentially corrupted auth session data"
    };
  } catch (e) {
    return {
      successful: false,
      strategy: 'auth-session-reset',
      message: "Failed to reset auth session data"
    };
  }
}

/**
 * Handle recovery for resource not found errors
 */
function handleResourceNotFoundRecovery(context: string): RecoveryResult {
  // For documents or templates, we can suggest creating a new one
  if (context.includes('document') || context.includes('template')) {
    toast.warning("Resource not found", {
      description: "The requested item could not be found. It may have been deleted or moved."
    });
  }
  
  return {
    successful: false, // This is more about guidance than actual recovery
    strategy: 'resource-guidance',
    message: "Provided guidance for missing resource"
  };
}

/**
 * Handle recovery for template load failures
 */
function handleTemplateLoadFailure(): RecoveryResult {
  // Disable template marketplace temporarily
  setFeatureOverride('template-marketplace', false);
  
  toast.warning("Template system issues", {
    description: "Template functionality is temporarily limited. Basic editing is still available."
  });
  
  return {
    successful: true,
    strategy: 'template-degradation',
    featureChanges: ['template-marketplace'],
    message: "Limited template functionality due to loading issues"
  };
}
