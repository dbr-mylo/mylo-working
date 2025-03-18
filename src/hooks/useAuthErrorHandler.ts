
import { useState, useCallback, useRef } from 'react';
import { 
  AuthError, 
  SignInError, 
  SignUpError, 
  SignOutError,
  formatAuthError,
  getUserFriendlyErrorMessage,
  mapToAuthError,
  isRetryableError
} from '@/lib/errors/authErrors';
import { toast } from 'sonner';
import { AuthErrorType, AuthErrorHandlerOptions } from '@/lib/types/authTypes';

const defaultOptions: AuthErrorHandlerOptions = {
  showToast: true,
  logToConsole: true,
  retryCount: 0,
  retryDelay: 1000
};

/**
 * Hook for handling authentication-related errors with type safety
 * Provides error state management, retry capability, and user feedback
 */
export const useAuthErrorHandler = (options: AuthErrorHandlerOptions = defaultOptions) => {
  const [error, setError] = useState<AuthError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = options.retryCount ?? defaultOptions.retryCount;
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Handle an authentication error with proper type mapping and user feedback
   * @param error The error that occurred
   * @param context The context in which the error occurred
   * @returns The processed AuthError instance
   */
  const handleError = useCallback((error: unknown, context: AuthErrorType): AuthError => {
    // Map the error to an AuthError with proper typing
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
   * Retry an operation that failed with exponential backoff
   * @param operation The operation to retry
   * @param maxRetries Maximum number of retry attempts
   * @returns Promise that resolves with the operation result or rejects with an error
   */
  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    customMaxRetries?: number
  ): Promise<T> => {
    const effectiveMaxRetries = customMaxRetries !== undefined ? customMaxRetries : maxRetries;
    
    if (effectiveMaxRetries <= 0) {
      return operation();
    }
    
    // Create new abort controller for this retry operation
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    let currentRetry = 0;
    let lastError: unknown;

    setRetryCount(0);
    setIsRetrying(true);
    
    try {
      while (currentRetry <= effectiveMaxRetries) {
        if (signal.aborted) {
          throw new Error('Retry operation aborted');
        }
        
        try {
          if (currentRetry > 0) {
            // Wait with exponential backoff before retrying
            const delayTime = Math.min((options.retryDelay || 1000) * Math.pow(2, currentRetry - 1), 30000);
            await new Promise(resolve => setTimeout(resolve, delayTime));
          }
          
          // Attempt the operation
          const result = await operation();
          return result;
        } catch (error) {
          lastError = error;
          
          // Only retry if the error is retryable and we haven't reached max retries
          if (currentRetry < effectiveMaxRetries && isRetryableError(error)) {
            currentRetry++;
            setRetryCount(currentRetry);
            continue;
          }
          
          // Not retryable or reached max retries
          throw error;
        }
      }
      
      // This should never be reached due to the while loop condition
      throw lastError || new Error('Maximum retry attempts reached');
    } finally {
      setIsRetrying(false);
      abortControllerRef.current = null;
    }
  }, [maxRetries, options.retryDelay]);

  /**
   * Cancel any in-progress retry operation
   */
  const cancelRetry = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsRetrying(false);
    }
  }, []);

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
    resetRetryCount,
    cancelRetry
  };
};
