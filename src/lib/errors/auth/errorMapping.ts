
import { AuthErrorType, AuthErrorCode } from "../../types/authTypes";
import { 
  AuthError, 
  SignInError, 
  SignUpError, 
  SignOutError, 
  SessionError, 
  RoleError, 
  StorageError 
} from "./errorClasses";

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
