
/**
 * Error classification system
 * 
 * This module classifies errors into categories based on their properties,
 * messages, and context. It provides user-friendly messages and recovery
 * suggestions.
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
  SESSION = 'session',
  FILE_SIZE = 'file_size',
  UNKNOWN = 'unknown'
}

/**
 * Structure for a classified error
 */
export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  originalError: unknown;
  context?: string;
  suggestedAction?: string;
  recoverable: boolean;
  code?: string;
  technicalMessage?: string;
}

/**
 * Classifies an error based on its characteristics and context
 * 
 * @param error - The error to classify
 * @param context - The context in which the error occurred (e.g., 'api.fetchData', 'auth.login')
 * @returns ClassifiedError - A categorized error with user-friendly information
 */
export function classifyError(error: unknown, context: string = 'general'): ClassifiedError {
  // Default classification
  let category = ErrorCategory.UNKNOWN;
  let recoverable = true;
  let message = "Something went wrong. Please try again.";
  let suggestedAction = "Refresh the page or try again later.";
  let code = "";

  // Extract error message if available
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : '';
  
  // Attempt to extract HTTP status code from error object
  const status = (error as any)?.status || (error as any)?.response?.status;
  
  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('offline') ||
    errorName === 'NetworkError'
  ) {
    category = ErrorCategory.NETWORK;
    message = "We're having trouble connecting to the server.";
    suggestedAction = "Please check your internet connection and try again.";
  } 
  // Authentication errors
  else if (
    errorMessage.toLowerCase().includes('unauthorized') ||
    errorMessage.toLowerCase().includes('unauthenticated') ||
    errorMessage.toLowerCase().includes('auth') ||
    status === 401 ||
    context.startsWith('auth.')
  ) {
    category = ErrorCategory.AUTHENTICATION;
    message = "Your session may have expired.";
    suggestedAction = "Please sign in again to continue.";
  } 
  // Permission errors
  else if (
    errorMessage.toLowerCase().includes('permission') ||
    errorMessage.toLowerCase().includes('forbidden') ||
    status === 403
  ) {
    category = ErrorCategory.PERMISSION;
    message = "You don't have permission to perform this action.";
    suggestedAction = "Please contact your administrator for access.";
    recoverable = false;
  } 
  // Validation errors
  else if (
    errorMessage.toLowerCase().includes('invalid') ||
    errorMessage.toLowerCase().includes('validation') ||
    status === 422 ||
    status === 400 ||
    context.startsWith('form.')
  ) {
    category = ErrorCategory.VALIDATION;
    message = "There seems to be a problem with the information provided.";
    suggestedAction = "Please check your input and try again.";
  } 
  // Not found errors
  else if (
    errorMessage.toLowerCase().includes('not found') ||
    status === 404
  ) {
    category = ErrorCategory.RESOURCE_NOT_FOUND;
    message = "The requested resource could not be found.";
    suggestedAction = "Please check that the item exists and you have access to it.";
  }
  // Rate limit errors
  else if (
    errorMessage.toLowerCase().includes('rate limit') ||
    errorMessage.toLowerCase().includes('too many requests') ||
    status === 429
  ) {
    category = ErrorCategory.RATE_LIMIT;
    message = "You've made too many requests. Please slow down.";
    suggestedAction = "Please wait a moment before trying again.";
  }
  // Server errors
  else if (
    (status && status >= 500) ||
    errorMessage.toLowerCase().includes('server error')
  ) {
    category = ErrorCategory.SERVER;
    message = "There was a problem with our server.";
    suggestedAction = "Please try again later while we fix the issue.";
  }
  // Session errors
  else if (
    errorMessage.toLowerCase().includes('session') ||
    errorMessage.toLowerCase().includes('token expired')
  ) {
    category = ErrorCategory.SESSION;
    message = "Your session has expired.";
    suggestedAction = "Please sign in again to continue.";
  }
  // File size errors
  else if (
    errorMessage.toLowerCase().includes('file size') ||
    errorMessage.toLowerCase().includes('too large')
  ) {
    category = ErrorCategory.FILE_SIZE;
    message = "The file is too large.";
    suggestedAction = "Please try a smaller file.";
  }
  // Timeout errors
  else if (
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('timed out')
  ) {
    category = ErrorCategory.TIMEOUT;
    message = "The request took too long to complete.";
    suggestedAction = "Please try again later or check your connection speed.";
  }
  // Storage errors
  else if (
    errorMessage.toLowerCase().includes('storage') ||
    errorMessage.toLowerCase().includes('disk') ||
    errorMessage.toLowerCase().includes('quota') ||
    errorMessage.toLowerCase().includes('localStorage') ||
    errorMessage.toLowerCase().includes('indexedDB')
  ) {
    category = ErrorCategory.STORAGE;
    message = "There was a problem with storage.";
    suggestedAction = "Please clear some browser storage and try again.";
  }

  // Context-based classification (if we haven't categorized it yet)
  if (category === ErrorCategory.UNKNOWN) {
    if (context.startsWith('auth')) {
      category = ErrorCategory.AUTHENTICATION;
      message = "There was a problem with authentication.";
      suggestedAction = "Please try signing in again.";
    } else if (context.startsWith('api')) {
      category = ErrorCategory.NETWORK;
      message = "There was a problem communicating with our service.";
      suggestedAction = "Please try again later.";
    } else if (context.startsWith('document') || context.includes('save')) {
      category = ErrorCategory.STORAGE;
      message = "There was a problem saving your document.";
      suggestedAction = "We've saved a backup copy locally. Try again later.";
    } else if (context.includes('database')) {
      category = ErrorCategory.DATABASE;
      message = "There was a problem with our database.";
      suggestedAction = "Please try again later while we fix the issue.";
    }
  }

  const technicalMessage = getTechnicalErrorDetails(error);

  return {
    category,
    message,
    originalError: error,
    context,
    suggestedAction,
    recoverable,
    code: code || String(status) || '',
    technicalMessage
  };
}

/**
 * Gets a user-friendly error message based on the error and role
 * 
 * @param error - The error object
 * @param context - The context in which the error occurred
 * @param role - The user's role (optional)
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(
  error: unknown, 
  context: string = 'general',
  role: string | null = null
): string {
  const classified = classifyError(error, context);
  
  // Base message that's generally user-friendly
  let message = classified.message;
  
  // Role-specific messaging
  if (role) {
    // For administrators, provide more technical details
    if (role === 'admin') {
      message = `${classified.message} (${classified.category}). Please check server logs for more details.`;
    }
    // For designers, focus on template and styling errors
    else if (role === 'designer') {
      if (classified.category === ErrorCategory.VALIDATION) {
        message = "There may be a conflict in the template styling. Please check your style definitions.";
      } else if (classified.category === ErrorCategory.STORAGE) {
        message = "There was a problem saving your template. We've created a local backup.";
      }
    }
    // For writers, focus on content preservation
    else if (role === 'writer') {
      if (classified.category === ErrorCategory.STORAGE) {
        message = "Your document couldn't be saved to the cloud, but we've kept a local copy for you.";
      } else if (classified.category === ErrorCategory.AUTHENTICATION) {
        message = "Your session has expired, but don't worry—your work has been backed up locally.";
      }
    }
  }
  
  return message;
}

/**
 * Extract technical details from an error object
 * Used for debugging and detailed logging
 */
export function getTechnicalErrorDetails(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  
  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify(error, null, 2);
    } catch (e) {
      return `Object: ${Object.prototype.toString.call(error)}`;
    }
  }
  
  return String(error);
}
