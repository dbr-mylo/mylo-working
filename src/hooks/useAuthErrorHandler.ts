
import { useState, useCallback } from 'react';
import { 
  AuthError, 
  SignInError, 
  SignUpError, 
  SignOutError,
  formatAuthError
} from '@/lib/errors/authErrors';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
}

const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  logToConsole: true
};

export const useAuthErrorHandler = (options: ErrorHandlerOptions = defaultOptions) => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: unknown, context: string) => {
    let processedError: Error;

    if (error instanceof AuthError) {
      processedError = error;
    } else if (error instanceof Error) {
      // Map known error patterns to our custom error types
      if (context === 'signIn') {
        processedError = new SignInError(error.message);
      } else if (context === 'signUp') {
        processedError = new SignUpError(error.message);
      } else if (context === 'signOut') {
        processedError = new SignOutError(error.message);
      } else {
        processedError = new AuthError(error.message);
      }
    } else {
      // Handle non-Error objects
      const message = typeof error === 'string' ? error : 'An unknown error occurred';
      processedError = new AuthError(message);
    }

    // Set the error state
    setError(processedError);

    // Show toast if enabled
    if (options.showToast) {
      toast.error(formatAuthError(processedError));
    }

    // Log to console if enabled
    if (options.logToConsole) {
      console.error(`Auth error (${context}):`, processedError);
    }

    return processedError;
  }, [options.showToast, options.logToConsole]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
};
