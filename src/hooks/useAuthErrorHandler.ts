
import { useState, useCallback } from 'react';
import { 
  AuthError, 
  SignInError, 
  SignUpError, 
  SignOutError,
  formatAuthError,
  getUserFriendlyErrorMessage,
  mapToAuthError
} from '@/lib/errors/authErrors';
import { toast } from 'sonner';
import { AuthErrorType } from '@/lib/types/authTypes';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  retryCount?: number;
}

const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  logToConsole: true,
  retryCount: 0
};

/**
 * Hook for handling authentication-related errors
 */
export const useAuthErrorHandler = (options: ErrorHandlerOptions = defaultOptions) => {
  const [error, setError] = useState<AuthError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Handle an authentication error
   * @param error The error that occurred
   * @param context The context in which the error occurred
   * @returns The processed AuthError instance
   */
  const handleError = useCallback((error: unknown, context: AuthErrorType) => {
    // Map the error to an AuthError
    const processedError = mapToAuthError(error, context);
    
    // Set the error state
    setError(processedError);

    // Show toast if enabled
    if (options.showToast) {
      toast.error(processedError.getUserMessage());
    }

    // Log to console if enabled
    if (options.logToConsole) {
      console.error(`Auth error (${context}):`, processedError);
      if (processedError.originalError) {
        console.error('Original error:', processedError.originalError);
      }
    }

    return processedError;
  }, [options.showToast, options.logToConsole]);

  /**
   * Retry an operation that failed
   * @param operation The operation to retry
   * @param maxRetries Maximum number of retry attempts
   * @returns Promise that resolves with the operation result or rejects with an error
   */
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = options.retryCount || 1
  ): Promise<T> => {
    if (maxRetries <= 0 || retryCount >= maxRetries) {
      throw new Error('Maximum retry attempts reached');
    }

    try {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      return await operation();
    } catch (error) {
      if (retryCount < maxRetries - 1) {
        // Exponential backoff wait
        const waitTime = Math.min(1000 * (2 ** retryCount), 10000);
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return retryOperation(operation, maxRetries);
      }
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, options.retryCount]);

  /**
   * Clear any stored errors
   */
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  /**
   * Reset the retry counter
   */
  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    error,
    isRetrying,
    retryCount,
    handleError,
    clearError,
    retryOperation,
    resetRetryCount
  };
};
