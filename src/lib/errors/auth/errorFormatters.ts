
import { AuthErrorCode } from "../../types/authTypes";

/**
 * Helper function to format error messages consistently
 */
export const formatAuthError = (error: Error): string => {
  if (error.name === 'SignInError') {
    return `Sign in failed: ${error.message}`;
  } else if (error.name === 'SignUpError') {
    return `Sign up failed: ${error.message}`;
  } else if (error.name === 'SignOutError') {
    return `Sign out failed: ${error.message}`;
  } else if (error.name === 'SessionError') {
    return `Session error: ${error.message}`;
  } else if (error.name === 'RoleError') {
    return `Role error: ${error.message}`;
  } else if (error.name === 'StorageError') {
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
