
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
  DATABASE = 'database',
  SERVER = 'server',
  CLIENT = 'client',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  RATE_LIMIT = 'rate_limit',
  COMPATIBILITY = 'compatibility',
  SESSION = 'session',
  FILE_SIZE = 'file_size',
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
 * Check HTTP status code ranges
 */
function getErrorCategoryFromStatus(status: number): ErrorCategory | null {
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (status === 404) {
      return ErrorCategory.RESOURCE_NOT_FOUND;
    }
    if (status === 422) {
      return ErrorCategory.VALIDATION;
    }
    if (status === 429) {
      return ErrorCategory.RATE_LIMIT;
    }
    return ErrorCategory.CLIENT;
  }
  if (status >= 500) {
    return ErrorCategory.SERVER;
  }
  return null;
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
  
  // Extract HTTP status code if available
  let statusCode: number | undefined;
  if (error && typeof error === 'object' && 'status' in error) {
    statusCode = Number(error.status);
  }
  
  // Check for HTTP status-based categorization
  if (statusCode) {
    const statusCategory = getErrorCategoryFromStatus(statusCode);
    if (statusCategory) {
      switch (statusCategory) {
        case ErrorCategory.AUTHENTICATION:
          return {
            category: ErrorCategory.AUTHENTICATION,
            message: "You need to sign in to access this feature.",
            technicalMessage,
            recoverable: true,
            suggestedAction: "Please try logging in again."
          };
        case ErrorCategory.RESOURCE_NOT_FOUND:
          return {
            category: ErrorCategory.RESOURCE_NOT_FOUND,
            message: "The requested resource wasn't found.",
            technicalMessage,
            recoverable: false,
            suggestedAction: "Please check the URL or go back to the previous page."
          };
        case ErrorCategory.VALIDATION:
          return {
            category: ErrorCategory.VALIDATION,
            message: "There was a problem with the information provided.",
            technicalMessage,
            recoverable: true,
            suggestedAction: "Please review and correct the information."
          };
        case ErrorCategory.RATE_LIMIT:
          return {
            category: ErrorCategory.RATE_LIMIT,
            message: "You've made too many requests.",
            technicalMessage,
            recoverable: true,
            suggestedAction: "Please wait a moment before trying again."
          };
        case ErrorCategory.SERVER:
          return {
            category: ErrorCategory.SERVER,
            message: "There was a problem with our server.",
            technicalMessage,
            recoverable: false,
            suggestedAction: "Please try again later."
          };
        case ErrorCategory.CLIENT:
          return {
            category: ErrorCategory.CLIENT,
            message: "There was a problem with your request.",
            technicalMessage,
            recoverable: true,
            suggestedAction: "Please try again or contact support."
          };
      }
    }
  }
  
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
    containsAny(errorMessage, ['auth', 'login', 'credential', 'token', 'session', 'expired', 'unauthorized', 'unauthenticated']) ||
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
  if (containsAny(errorMessage, ['valid', 'format', 'required', 'missing', 'invalid', 'constraint'])) {
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
  if (containsAny(errorMessage, ['parse', 'JSON', 'syntax', 'malformed', 'corrupt', 'format'])) {
    return {
      category: ErrorCategory.FORMAT,
      message: "The file or data is in an incorrect format.",
      technicalMessage,
      recoverable: false,
      suggestedAction: "Try using a different file."
    };
  }
  
  // Timeout errors
  if (containsAny(errorMessage, ['timeout', 'timed out', 'took too long', 'deadline', 'exceeded'])) {
    return {
      category: ErrorCategory.TIMEOUT,
      message: "The operation took too long to complete.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Try again or perform the operation with a smaller file."
    };
  }
  
  // Database errors
  if (containsAny(errorMessage, ['database', 'db', 'query', 'sql', 'table', 'column', 'record', 'schema'])) {
    return {
      category: ErrorCategory.DATABASE,
      message: "There was a database error.",
      technicalMessage,
      recoverable: false,
      suggestedAction: "Please try again later. If the problem persists, contact support."
    };
  }
  
  // Not found errors
  if (containsAny(errorMessage, ['not found', '404', 'doesn\'t exist', 'does not exist', 'missing'])) {
    return {
      category: ErrorCategory.RESOURCE_NOT_FOUND,
      message: "The requested resource wasn't found.",
      technicalMessage,
      recoverable: false,
      suggestedAction: "Check that the resource exists."
    };
  }
  
  // Rate limit errors
  if (containsAny(errorMessage, ['rate limit', 'too many requests', 'throttle', '429'])) {
    return {
      category: ErrorCategory.RATE_LIMIT,
      message: "You've made too many requests.",
      technicalMessage,
      recoverable: true,
      suggestedAction: "Please wait a moment before trying again."
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
    
    if (role === 'admin' && classified.category === ErrorCategory.SERVER) {
      return `${classified.message} As an admin, you can check the server logs for more information.`;
    }
  }
  
  return classified.message + (classified.suggestedAction ? ` ${classified.suggestedAction}` : '');
}

/**
 * Get technical error details - useful for developers
 */
export function getTechnicalErrorDetails(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
}
