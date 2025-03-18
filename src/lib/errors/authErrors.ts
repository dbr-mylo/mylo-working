
import { AuthErrorCode, AuthErrorOptions, AuthErrorType } from "../types/authTypes";

/**
 * Custom error types for authentication-related errors
 */

export class AuthError extends Error {
  public readonly type: AuthErrorType;
  public readonly code?: AuthErrorCode;
  public readonly originalError?: unknown;

  constructor(message: string, type: AuthErrorType = "unknown", options?: AuthErrorOptions) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.code = options?.code;
    this.originalError = options?.originalError;
  }

  /**
   * Returns a user-friendly error message with context
   */
  public getUserMessage(): string {
    return formatAuthError(this);
  }
}

export class SignInError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signIn", options);
    this.name = 'SignInError';
  }
}

export class SignUpError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signUp", options);
    this.name = 'SignUpError';
  }
}

export class SignOutError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "signOut", options);
    this.name = 'SignOutError';
  }
}

export class SessionError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "session", options);
    this.name = 'SessionError';
  }
}

export class RoleError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "role", options);
    this.name = 'RoleError';
  }
}

export class StorageError extends AuthError {
  constructor(message: string, options?: AuthErrorOptions) {
    super(message, "storage", options);
    this.name = 'StorageError';
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
    
    // Map to specific error types based on context
    switch (context) {
      case 'signIn':
        return new SignInError(message, { originalError: error });
      case 'signUp':
        return new SignUpError(message, { originalError: error });
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

  // Handle non-Error objects
  const message = typeof error === 'string' 
    ? error 
    : 'An unknown error occurred';
  
  return new AuthError(message, context);
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
    default:
      return 'An error occurred during authentication.';
  }
};
