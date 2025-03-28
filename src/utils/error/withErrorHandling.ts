import { handleError } from "./handleError";
import { withRetry, RetryConfig } from "./withRetry";

/**
 * Wraps an async function with error handling and retry logic
 * @param fn The async function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @param retryConfig Optional retry configuration
 * @returns A new function that handles errors and retries
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string,
  userMessage?: string,
  retryConfig?: RetryConfig
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args) => {
    try {
      // Apply retry logic if configuration is provided
      if (retryConfig) {
        return await withRetry(() => fn(...args), retryConfig);
      }
      // Otherwise, just run the function
      return await fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}

/**
 * Wraps a synchronous function with error handling
 * @param fn The function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @returns A new function that handles errors
 */
export function withSyncErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => T,
  context: string,
  userMessage?: string
): (...args: Args) => T | undefined {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}
