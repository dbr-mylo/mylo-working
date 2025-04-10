
type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const defaultRetryConfig: Required<RetryConfig> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffFactor: 2,
  retryCondition: () => true,
  onRetry: () => {}
};

/**
 * A utility that adds retry capability to any async function
 * @param fn The async function to wrap with retry logic
 * @param config Configuration options for retry behavior
 * @returns A new function that will retry according to the config
 */
export function withRetry<T, Args extends any[]>(
  fn: AsyncFunction<T, Args>,
  config?: RetryConfig
): AsyncFunction<T, Args> {
  // Merge provided config with defaults
  const {
    maxAttempts,
    delayMs,
    backoffFactor,
    retryCondition,
    onRetry
  } = { ...defaultRetryConfig, ...config };

  // Return a new function with retry logic
  return async function(...args: Args): Promise<T> {
    let lastError: any;
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        // First attempt or retry
        return await fn(...args);
      } catch (error) {
        lastError = error;
        attempt++;
        
        // Stop retrying if we've hit max attempts or condition fails
        if (attempt >= maxAttempts || !retryCondition(error)) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = delayMs * Math.pow(backoffFactor, attempt - 1);
        
        // Notify about retry
        onRetry(attempt, error);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If we got here, all retries failed
    throw lastError;
  };
}
