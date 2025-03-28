
import { toast } from "sonner";
import { trackError } from "./analytics";

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
  
  // Add analytics tracking for errors
  trackError(error, context);
  
  // Show toast notification if requested
  if (shouldToast) {
    toast.error(userMessage || errorMessage, {
      description: "See console for more details",
      duration: 5000,
    });
  }
};
