
/**
 * Error classification system
 * 
 * This module provides utilities to classify errors into categories
 * based on error message patterns and context.
 */

/**
 * Error categories for consistent handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization', // Added this missing enum value
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  FORMAT = 'format',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  UNKNOWN = 'unknown'
}

/**
 * Classified error with additional metadata
 */
export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  suggestedAction?: string;
  recoverable: boolean;
  code?: string;
}

/**
 * Classify an error based on its properties and context
 * 
 * @param error The original error
 * @param context Where the error occurred (component/function name)
 * @returns ClassifiedError with metadata
 */
export function classifyError(error: unknown, context: string): ClassifiedError {
  // Extract message from various error types
  const errorMessage = getErrorMessage(error);
  
  // Check for network-related errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('Failed to fetch')
  ) {
    return {
      category: ErrorCategory.NETWORK,
      message: 'Network connection issue detected.',
      suggestedAction: 'Please check your internet connection and try again.',
      recoverable: true,
    };
  }
  
  // Check for authentication errors
  if (
    errorMessage.includes('auth') ||
    errorMessage.includes('login') ||
    errorMessage.includes('sign in') ||
    errorMessage.includes('token') ||
    errorMessage.includes('credential') ||
    errorMessage.includes('expired')
  ) {
    return {
      category: ErrorCategory.AUTHENTICATION,
      message: 'Authentication error occurred.',
      suggestedAction: 'Please sign in again to continue.',
      recoverable: true,
    };
  }
  
  // Check for permission errors
  if (
    errorMessage.includes('permission') ||
    errorMessage.includes('access denied') ||
    errorMessage.includes('forbidden') ||
    errorMessage.includes('not authorized')
  ) {
    return {
      category: ErrorCategory.PERMISSION,
      message: 'You do not have permission for this action.',
      suggestedAction: 'Contact your administrator if you need access.',
      recoverable: false,
    };
  }
  
  // Check for validation errors
  if (
    errorMessage.includes('valid') ||
    errorMessage.includes('required') ||
    errorMessage.includes('must be') ||
    errorMessage.includes('expected') ||
    errorMessage.includes('format')
  ) {
    return {
      category: ErrorCategory.VALIDATION,
      message: 'There was a problem with the provided data.',
      suggestedAction: 'Please check your input and try again.',
      recoverable: true,
    };
  }
  
  // Check for storage errors
  if (
    errorMessage.includes('storage') ||
    errorMessage.includes('disk') ||
    errorMessage.includes('save') ||
    errorMessage.includes('quota') ||
    context.includes('storage') ||
    context.includes('save')
  ) {
    return {
      category: ErrorCategory.STORAGE,
      message: 'Storage error occurred.',
      suggestedAction: 'Please check available space and permissions.',
      recoverable: true,
    };
  }
  
  // Check for timeouts
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out') ||
    errorMessage.includes('took too long')
  ) {
    return {
      category: ErrorCategory.TIMEOUT,
      message: 'The operation took too long to complete.',
      suggestedAction: 'Please try again. If the problem persists, try a smaller action.',
      recoverable: true,
    };
  }
  
  // Check for rate limiting
  if (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests') ||
    errorMessage.includes('try again later')
  ) {
    return {
      category: ErrorCategory.RATE_LIMIT,
      message: 'Rate limit reached.',
      suggestedAction: 'Please wait a moment before trying again.',
      recoverable: true,
    };
  }
  
  // Check for server errors
  if (
    errorMessage.includes('server') ||
    errorMessage.includes('500') ||
    errorMessage.includes('503') ||
    errorMessage.includes('internal')
  ) {
    return {
      category: ErrorCategory.SERVER,
      message: 'Server error occurred.',
      suggestedAction: 'Please try again later.',
      recoverable: false,
    };
  }
  
  // Check for not found errors
  if (
    errorMessage.includes('not found') ||
    errorMessage.includes('404') ||
    errorMessage.includes('missing') ||
    errorMessage.includes('does not exist')
  ) {
    return {
      category: ErrorCategory.RESOURCE_NOT_FOUND,
      message: 'The requested resource was not found.',
      suggestedAction: 'Please check if the item exists or has been moved.',
      recoverable: false,
    };
  }
  
  // Default case for unknown errors
  return {
    category: ErrorCategory.UNKNOWN,
    message: 'An unexpected error occurred.',
    suggestedAction: 'Please try again or contact support if the problem persists.',
    recoverable: false,
  };
}

/**
 * Get a user-friendly error message based on classification
 * 
 * @param error The original error
 * @param context Where the error occurred
 * @param role Optional user role for customized messages
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  context: string,
  role?: string | null
): string {
  const classified = classifyError(error, context);
  
  // Create friendly message based on classification
  switch (classified.category) {
    case ErrorCategory.NETWORK:
      return 'Connection issue detected. Please check your internet and try again.';
      
    case ErrorCategory.AUTHENTICATION:
      return 'Your session may have expired. Please sign in again to continue.';
      
    case ErrorCategory.PERMISSION:
      return 'You don\'t have permission to perform this action.';
      
    case ErrorCategory.VALIDATION:
      return 'Please check your input - some fields may not be in the correct format.';
      
    case ErrorCategory.STORAGE:
      return 'Unable to save your data. Please check your storage space.';
      
    case ErrorCategory.TIMEOUT:
      return 'The operation took too long. Please try again or try with a smaller amount of data.';
      
    case ErrorCategory.RATE_LIMIT:
      return 'You\'ve reached a rate limit. Please wait a moment before trying again.';
      
    case ErrorCategory.SERVER:
      return 'Our server is experiencing issues. Please try again later.';
      
    case ErrorCategory.RESOURCE_NOT_FOUND:
      return 'The item you requested could not be found. It may have been deleted or moved.';
      
    default:
      // If we have the original error message, use it; otherwise fallback
      return getErrorMessage(error) || 'An unexpected error occurred.';
  }
}

/**
 * Extract a string message from various error types
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    if ('statusText' in error && typeof error.statusText === 'string') {
      return error.statusText;
    }
  }
  
  return 'Unknown error occurred';
}
