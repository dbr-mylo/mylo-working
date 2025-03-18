
import { AuthErrorCode, AuthErrorOptions, AuthErrorType } from "../../types/authTypes";
import { formatAuthError } from "./errorFormatters";

/**
 * Base authentication error class
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

/**
 * Specific error types for different authentication scenarios
 */
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
