
/**
 * Error categories for better user feedback
 */
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  FORMAT = 'format',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

/**
 * Interface for classified error information
 */
export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  technicalMessage: string;
  recoverable: boolean;
  suggestedAction?: string;
}

/**
 * Helper function to check if the error contains specific keywords
 */
function containsAny(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Classifies an error into a specific category with helpful user messages
 */
export function classifyError(error: unknown, context?: string): ClassifiedError {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';
  
  const technicalMessage = error instanceof Error 
    ? `${error.name}: ${error.message}` 
    : String(error);
  
  // Network errors
  if (
    containsAny(errorMessage, ['network', 'offline', 'internet', 'connection', 'fetch', 'http', 'request']) ||
    error instanceof TypeError && containsAny(errorMessage, ['failed to fetch'])
  ) {
    return {
      category: ErrorCategory.NETWORK,
      message: "We're having trouble connecting to the server.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Check your internet connection and try again."
    };
  }
  
  // Authentication errors
  if (
    containsAny(errorMessage, ['auth', 'login', 'credential', 'token', 'session', 'expired']) ||
    context?.includes('auth') ||
    context?.includes('login')
  ) {
    return {
      category: ErrorCategory.AUTHENTICATION,
      message: "Your session may have expired.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Please try logging in again."
    };
  }
  
  // Permission errors
  if (containsAny(errorMessage, ['permission', 'access', 'denied', 'unauthorized', 'forbidden'])) {
    return {
      category: ErrorCategory.PERMISSION,
      message: "You don't have permission to perform this action.",
      technicalMessage,
      recoverable: false,
      suggestedAction: "Contact an administrator if you need access."
    };
  }
  
  // Validation errors
  if (containsAny(errorMessage, ['valid', 'format', 'required', 'missing', 'invalid'])) {
    return {
      category: ErrorCategory.VALIDATION,
      message: "There's a problem with the information provided.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Check the input and try again."
    };
  }
  
  // Storage errors
  if (containsAny(errorMessage, ['storage', 'quota', 'capacity', 'full', 'space'])) {
    return {
      category: ErrorCategory.STORAGE,
      message: "There's not enough storage space.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Try freeing up some space by deleting unnecessary files."
    };
  }
  
  // Format errors
  if (containsAny(errorMessage, ['parse', 'JSON', 'syntax', 'malformed', 'corrupt'])) {
    return {
      category: ErrorCategory.FORMAT,
      message: "The file or data is in an incorrect format.",
      technicalMessage,
      recoverable: false,
      suggestedAction: "Try using a different file."
    };
  }
  
  // Timeout errors
  if (containsAny(errorMessage, ['timeout', 'timed out', 'took too long'])) {
    return {
      category: ErrorCategory.TIMEOUT,
      message: "The operation took too long to complete.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Try again or perform the operation with a smaller file."
    };
  }
  
  // Unknown/default error
  return {
    category: ErrorCategory.UNKNOWN,
    message: "Something unexpected happened.",
    technicalMessage,
    recoverable: true,
    suggestedAction: "Try again or contact support if the problem persists."
  };
}

/**
 * Gets a user-friendly message based on error classification and role
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  context?: string,
  role?: string | null
): string {
  const classified = classifyError(error, context);
  
  // Add role-specific details if available
  if (role) {
    if (role === 'designer' && classified.category === ErrorCategory.PERMISSION) {
      return `${classified.message} Designers have different permissions than editors.`;
    }
    
    if (role === 'editor' && classified.category === ErrorCategory.FORMAT) {
      return `${classified.message} This template may not be compatible with the editor.`;
    }
  }
  
  return classified.message + (classified.suggestedAction ? ` ${classified.suggestedAction}` : '');
}
