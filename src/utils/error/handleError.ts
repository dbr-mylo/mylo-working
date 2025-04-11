
// Import for registerErrorAndAttemptRecovery
import { registerErrorAndAttemptRecovery } from "./selfHealingSystem";
import { toast } from "sonner";
import { trackError } from "./analytics";

/**
 * Utility functions for handling errors and providing recovery steps.
 */

/**
 * Centralized error handling function.
 * @param error The error object.
 * @param context The context in which the error occurred.
 * @param userMessage Optional custom message to show to the user on error.
 * @param shouldToast Whether to show a toast notification, defaults to true.
 */
export function handleError(
  error: unknown,
  context: string,
  userMessage?: string,
  shouldToast: boolean = true
): void {
  // Log to console
  console.error(`Error in ${context}:`, error);

  // Track for analytics
  trackError(error, context);

  // Show toast to user if requested
  if (shouldToast) {
    const message = userMessage || 
      (error instanceof Error ? error.message : 'An unexpected error occurred');
    
    toast.error(message, {
      description: `Error context: ${context}`,
      duration: 5000,
    });
  }

  // Attempt automatic recovery
  registerErrorAndAttemptRecovery(error, context);
}

/**
 * Get recovery steps based on the error type and user role.
 * @param error The error object.
 * @param context The context in which the error occurred.
 * @param role The user's role.
 * @param feature The feature that was being used when the error occurred.
 * @returns An array of recovery steps.
 */
export function getErrorRecoverySteps(
  error: Error,
  context: string,
  role: string | null | undefined,
  feature?: string
): string[] {
  // Log the error for debugging purposes
  console.error(`Error in ${context} for feature ${feature}:`, error);
  
  // Attempt to register the error and trigger automatic recovery
  const recoveryAttempted = registerErrorAndAttemptRecovery(error, context);
  
  // Define recovery steps based on error type and context
  const steps: string[] = [];
  
  // Common steps
  steps.push("Check your internet connection.");
  steps.push("Refresh the page.");
  
  if (context === 'authentication') {
    steps.push("Clear your browser cookies and cache.");
    steps.push("Reset your password.");
  }
  
  if (context === 'storage') {
    steps.push("Clear your browser's local storage.");
    steps.push("Check if you have enough storage space.");
  }
  
  if (feature === 'real-time-collaboration') {
    steps.push("Ensure all collaborators have a stable internet connection.");
    steps.push("Try disabling and re-enabling real-time collaboration.");
  }
  
  if (role === 'admin') {
    steps.push("Check the server logs for more details.");
    steps.push("Restart the server.");
  }
  
  // Add a generic step
  steps.push("Contact support if the issue persists.");
  
  // If recovery was attempted, add a note about it
  if (recoveryAttempted) {
    steps.push("The system attempted an automatic recovery.");
  }
  
  return steps;
}
