
/**
 * Error classification system for consistent error handling
 */

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  DATABASE = 'database',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  COMPATIBILITY = 'compatibility',
  FORMAT = 'format',
  SYNTAX = 'syntax',
  RUNTIME = 'runtime',
  UNKNOWN = 'unknown',
  // Add the missing categories
  AUTH = 'auth',
  CRITICAL = 'critical',
  SESSION = 'session',
  FILE_SIZE = 'file_size'
}

export interface ClassifiedError {
  originalError: unknown;
  message: string;
  category: ErrorCategory;
  isRecoverable: boolean; // Note: This was previously 'recoverable' in tests
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  technicalMessage?: string; // Add this for test expectations
}

/**
 * Classify an error based on its type and message
 * @param error The error to classify
 * @param context Optional context where the error occurred
 * @returns A classified error object
 */
export function classifyError(error: unknown, context?: string): ClassifiedError {
  let message = 'An unknown error occurred';
  let category = ErrorCategory.UNKNOWN;
  let isRecoverable = false;
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  let suggestedAction: string | undefined;
  let technicalMessage = error instanceof Error ? error.message : String(error);
  
  // Extract error message
  if (error instanceof Error) {
    message = error.message;
    
    // Classify network errors
    if (
      error.name === 'NetworkError' ||
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('offline') ||
      error instanceof TypeError && message.includes('Failed to fetch')
    ) {
      category = ErrorCategory.NETWORK;
      isRecoverable = true;
      suggestedAction = 'Check your internet connection and try again';
      message = 'We\'re having trouble connecting to the server';
    }
    
    // Classify authentication errors
    else if (
      error.name === 'AuthError' ||
      message.includes('authentication') ||
      message.includes('auth') ||
      message.includes('login') ||
      message.includes('token') ||
      message.includes('unauthorized') ||
      message.includes('401')
    ) {
      category = ErrorCategory.AUTHENTICATION;
      isRecoverable = true;
      suggestedAction = 'Try logging in again';
      message = 'Your session may have expired';
    }
    
    // Classify permission errors
    else if (
      error.name === 'PermissionError' ||
      message.includes('permission') ||
      message.includes('denied') ||
      message.includes('access') ||
      message.includes('forbidden') ||
      message.includes('403')
    ) {
      category = ErrorCategory.PERMISSION;
      isRecoverable = false;
      severity = 'high';
      suggestedAction = 'Contact your administrator for access';
      message = 'You don\'t have permission to perform this action';
    }
    
    // Use context to improve classification
    if (context) {
      if (context.includes('auth') || context.includes('login')) {
        category = context.includes('session') ? ErrorCategory.SESSION : ErrorCategory.AUTH;
        isRecoverable = true;
      } else if (context.includes('document')) {
        if (message.includes('size')) {
          category = ErrorCategory.FILE_SIZE;
          isRecoverable = true;
        }
      }
    }
    
    // Set severity based on error type
    if (error instanceof TypeError || error instanceof SyntaxError) {
      severity = 'high';
    } else if (error instanceof RangeError || error instanceof ReferenceError) {
      severity = 'critical';
    }
  } else if (typeof error === 'string') {
    message = error;
    technicalMessage = error;
    
    // Apply simple string-based classification
    if (error.includes('network') || error.includes('connection')) {
      category = ErrorCategory.NETWORK;
      isRecoverable = true;
    } else if (error.includes('auth') || error.includes('login')) {
      category = ErrorCategory.AUTHENTICATION;
      isRecoverable = true;
    }
  }
  
  return {
    originalError: error,
    message,
    category,
    isRecoverable,
    severity,
    suggestedAction,
    technicalMessage
  };
}

/**
 * Get a user-friendly error message based on the classified error
 * @param error The error to classify
 * @param context Optional context where the error occurred
 * @param role Optional user role for customized messaging
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(
  error: unknown, 
  context?: string, 
  role?: string | null
): string {
  // Classify the error first
  const classified = classifyError(error, context);
  
  // Default message based on category
  let message = 'Something went wrong. Please try again.';
  
  switch (classified.category) {
    case ErrorCategory.NETWORK:
      message = 'Connection issue. Please check your internet connection and try again.';
      break;
      
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      message = 'Your session has expired or you are not logged in. Please log in again.';
      break;
      
    case ErrorCategory.PERMISSION:
      message = 'You don\'t have permission to perform this action.';
      break;
      
    case ErrorCategory.VALIDATION:
      message = 'Please check the information you entered and try again.';
      break;
      
    case ErrorCategory.STORAGE:
      message = 'There was a problem storing your data. Please check your browser settings.';
      break;
      
    case ErrorCategory.TIMEOUT:
      message = 'The request took too long to complete. Please try again.';
      break;
      
    case ErrorCategory.RESOURCE_NOT_FOUND:
      message = 'The requested resource was not found.';
      break;
      
    case ErrorCategory.SERVER:
      message = 'There was a problem with the server. Please try again later.';
      break;
      
    case ErrorCategory.CRITICAL:
      message = 'A critical error has occurred. Please refresh the application.';
      break;
      
    case ErrorCategory.FILE_SIZE:
      message = 'The file size exceeds the maximum allowed limit.';
      break;
  }
  
  // Add a more specific message if available
  if (classified.suggestedAction) {
    message += ` ${classified.suggestedAction}`;
  }
  
  // Add role-specific details for admin users
  if (role === 'admin') {
    message += ` (Error category: ${classified.category})`;
  }
  
  return message;
}

/**
 * Get technical error details for debugging purposes
 */
export function getTechnicalErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  return String(error);
}

