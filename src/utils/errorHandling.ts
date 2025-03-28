
import { toast } from "sonner";

/**
 * Error handling utility functions
 */

/**
 * Handles an error with consistent logging and user notification
 * @param error The error to handle
 * @param context Context information about where the error occurred
 * @param userMessage Optional custom message to show to the user
 * @param shouldToast Whether to show a toast notification (default: true)
 */
export const handleError = (
  error: unknown,
  context: string,
  userMessage?: string,
  shouldToast: boolean = true
): void => {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : 'An unknown error occurred';
  
  // Log error with context
  console.error(`Error in ${context}:`, error);
  
  // Show toast notification if requested
  if (shouldToast) {
    toast.error(userMessage || errorMessage);
  }
};

/**
 * Wraps an async function with error handling
 * @param fn The async function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @returns A new function that handles errors
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string,
  userMessage?: string
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args) => {
    try {
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
