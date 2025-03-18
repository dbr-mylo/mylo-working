
/**
 * Custom error types for authentication-related errors
 */

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class SignInError extends AuthError {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SignInError';
  }
}

export class SignUpError extends AuthError {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SignUpError';
  }
}

export class SignOutError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'SignOutError';
  }
}

export class SessionError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export class RoleError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'RoleError';
  }
}

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
  } else {
    return `Authentication error: ${error.message}`;
  }
};
