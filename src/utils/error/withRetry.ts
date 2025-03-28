
import { RetryConfig, DEFAULT_RETRY_CONFIG } from './types';

/**
 * Utility for retrying failed async operations
 * @param fn The function to retry
 * @param config Retry configuration
 * @returns A wrapped function that will retry on failure
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: RetryConfig = {}
): T {
  const { maxAttempts, delayMs, retryCondition } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  };

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        console.info(`[Analytics] Retry attempt ${attempt}/${maxAttempts} failed`);
        lastError = error;
        
        // Check if we should retry
        if (attempt >= maxAttempts || !retryCondition(error)) {
          break;
        }
        
        // Wait before retrying
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    throw lastError;
  }) as T;
}
