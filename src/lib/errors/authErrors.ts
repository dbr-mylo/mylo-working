
import { AuthErrorCode, AuthErrorOptions, AuthErrorType } from "../types/authTypes";

/**
 * Custom error types for authentication-related errors
 * These provide type-safe error handling with consistent formatting
 */

export class AuthError extends Error {
  public readonly type: AuthErrorType;
  public readonly code?: AuthErrorCode;
  public readonly originalError?: unknown;
  public readonly context?: string;
  public readonly timestamp: number;

  constructor(message: string, type: AuthErrorType = "signIn", options?: AuthErrorOptions) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.code = options?.code;
    this.originalError = options?.originalError;
    this.context = options?.context;
    this.timestamp = Date.now();
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * Returns a user-friendly error message with context
   */
  public getUserMessage(): string {
    return formatAuthError(this);
  }

  /**
   * Check if error is recoverable
   */
  public isRecoverable(): boolean {
    // Network errors are typically recoverable
    if (this.code === AuthErrorCode.NetworkError) return true;
    
    // Session expiration just needs a re-login
    if (this.code === AuthErrorCode.SessionExpired) return true;
    
    // Storage errors may be recoverable
    if (this.code === AuthErrorCode.StorageError) return true;
    
    return false;
  }
  
  /**
   * Get recommended recovery action
   */
  public getRecoveryAction(): string {
    switch (this.code) {
      case AuthErrorCode.NetworkError:
        return "Check your internet connection and try again.";
      case AuthErrorCode.SessionExpired:
        return "Please sign in again to continue.";
      case AuthErrorCode.StorageError:
        return "Try clearing your browser cache and reload the page.";
      default:
        return "Please try again or contact support if the problem persists.";
    }
  }
}

export class SignInError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signIn", options);
    this.name = 'SignInError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, SignInError.prototype);
  }
}

export class SignUpError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signUp", options);
    this.name = 'SignUpError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, SignUpError.prototype);
  }
}

export class SignOutError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signOut", options);
    this.name = 'SignOutError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, SignOutError.prototype);
  }
}

export class SessionError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "session", options);
    this.name = 'SessionError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, SessionError.prototype);
  }
}

export class RoleError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "role", options);
    this.name = 'RoleError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, RoleError.prototype);
  }
}

export class StorageError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "storage", options);
    this.name = 'StorageError';
    
    // This is needed to make instanceof work correctly in TypeScript
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * Maps an error to an appropriate AuthError instance
 * @param error The original error
 * @param context The context in which the error occurred
 * @returns An AuthError instance
 */
export const mapToAuthError = (error: unknown, context: AuthErrorType): AuthError => {
  // If it's already an AuthError, return it
  if (error instanceof AuthError) {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message || 'An unknown error occurred';
    
    // Map to specific error types based on context and message patterns
    if (context === 'signIn') {
      if (/invalid credentials|password incorrect/i.test(message)) {
        return new SignInError('Invalid email or password', { 
          code: AuthErrorCode.InvalidCredentials, 
          originalError: error 
        });
      }
      if (/not found|no account/i.test(message)) {
        return new SignInError('No account found with this email', { 
          code: AuthErrorCode.UserNotFound, 
          originalError: error 
        });
      }
      return new SignInError(message, { originalError: error });
    }
    
    if (context === 'signUp') {
      if (/already exists|already in use/i.test(message)) {
        return new SignUpError('An account with this email already exists', { 
          code: AuthErrorCode.EmailAlreadyInUse, 
          originalError: error 
        });
      }
      if (/weak password|password requirements/i.test(message)) {
        return new SignUpError('Password is too weak. Please use a stronger password', { 
          code: AuthErrorCode.WeakPassword, 
          originalError: error 
        });
      }
      return new SignUpError(message, { originalError: error });
    }
    
    // Map other context types accordingly
    switch (context) {
      case 'signOut':
        return new SignOutError(message, { originalError: error });
      case 'session':
        return new SessionError(message, { originalError: error });
      case 'role':
        return new RoleError(message, { originalError: error });
      case 'storage':
        return new StorageError(message, { originalError: error });
      default:
        return new AuthError(message, context, { originalError: error });
    }
  }

  // Handle network errors (likely from fetch)
  if (error && typeof error === 'object' && 'status' in error) {
    const statusError = error as { status?: number, message?: string };
    const message = statusError.message || `Server returned ${statusError.status || 'an error'}`;
    return new AuthError(message, context, { 
      code: AuthErrorCode.NetworkError,
      originalError: error 
    });
  }

  // Handle non-Error objects
  const message = typeof error === 'string' 
    ? error 
    : 'An unknown error occurred';
  
  return new AuthError(message, context, { originalError: error });
};

/**
 * Helper function to format error messages consistently
 */
export const formatAuthError = (error: Error): string => {
  if (error instanceof SignInError) {
    return `Sign in failed: ${error.message}`;
  } else if (error instanceof SignUpError) {
    return `Sign up failed: ${error.message}`;
  } else if (error instanceof SignOutError) {
    return `Sign out failed: ${error.message}`;
  } else if (error instanceof SessionError) {
    return `Session error: ${error.message}`;
  } else if (error instanceof RoleError) {
    return `Role error: ${error.message}`;
  } else if (error instanceof StorageError) {
    return `Storage error: ${error.message}`;
  } else {
    return `Authentication error: ${error.message}`;
  }
};

/**
 * Provides user-friendly error messages for common auth error codes
 */
export const getUserFriendlyErrorMessage = (code?: AuthErrorCode): string => {
  if (!code) return 'An unknown error occurred';

  switch (code) {
    case AuthErrorCode.InvalidCredentials:
      return 'The email or password you entered is incorrect.';
    case AuthErrorCode.UserNotFound:
      return 'No account found with this email address.';
    case AuthErrorCode.EmailAlreadyInUse:
      return 'An account with this email already exists.';
    case AuthErrorCode.WeakPassword:
      return 'Password is too weak. Please use a stronger password.';
    case AuthErrorCode.NetworkError:
      return 'Network error. Please check your connection and try again.';
    case AuthErrorCode.InvalidRole:
      return 'Invalid user role specified.';
    case AuthErrorCode.SessionExpired:
      return 'Your session has expired. Please sign in again.';
    case AuthErrorCode.StorageError:
      return 'There was an error storing your authentication data.';
    case AuthErrorCode.PermissionDenied:
      return 'You do not have permission to perform this action.';
    case AuthErrorCode.AccountDisabled:
      return 'This account has been disabled. Please contact support.';
    case AuthErrorCode.TooManyRequests:
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred during authentication.';
  }
};

/**
 * Determine if an error can be retried automatically
 */
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof AuthError) {
    return error.isRecoverable();
  }
  
  // Network errors are typically retryable
  if (error instanceof Error && /network|connection|timeout/i.test(error.message)) {
    return true;
  }
  
  return false;
};
