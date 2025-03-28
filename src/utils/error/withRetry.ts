
import { trackError } from "./analytics";

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Starting delay in milliseconds */
  baseDelay?: number;
  /** Whether to use exponential backoff strategy */
  useExponentialBackoff?: boolean;
  /** Optional callback to determine if an error is retryable */
  isRetryable?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  useExponentialBackoff: true,
  isRetryable: () => true,
};

/**
 * Wraps an async function with retry logic
 * @param fn The async function to wrap
 * @param config Retry configuration
 * @returns A new function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  config: RetryConfig = {}
): Promise<T> {
  const { maxAttempts, baseDelay, useExponentialBackoff, isRetryable } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  };
  
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxAttempts!; attempt++) {
    try {
      // Track attempt for analytics
      if (attempt > 0) {
        console.info(`[Analytics] Retry attempt ${attempt} for operation`);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!isRetryable!(error)) {
        console.info(`[Analytics] Error not retryable, stopping retry attempts`);
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxAttempts! - 1) {
        console.info(`[Analytics] Max retry attempts (${maxAttempts}) reached`);
        throw error;
      }
      
      // Calculate delay using exponential backoff if configured
      const delay = useExponentialBackoff! 
        ? baseDelay! * Math.pow(2, attempt)
        : baseDelay!;
        
      console.info(`[Analytics] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This point should not be reached due to the throw in the loop,
  // but TypeScript requires a return value
  throw lastError;
}
