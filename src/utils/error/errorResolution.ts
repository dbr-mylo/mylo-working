
/**
 * Utility to provide error resolution steps
 */
import { ResolutionStep, LegacyResolutionStep } from './types';

/**
 * Get error resolution steps based on the error type and context.
 * @param error The error that occurred
 * @param context The context where the error occurred
 * @returns Array of resolution steps
 */
export function getErrorResolutionSteps(error: unknown, context: string): LegacyResolutionStep[] {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Define default steps
  const steps: LegacyResolutionStep[] = [
    "Refresh the page to restart the application.",
    "Check your internet connection is stable.",
    "Clear your browser cache and cookies.",
    "If the problem persists, contact support."
  ];
  
  // Customize based on context
  if (context === 'settings') {
    return [
      "Check your account permissions.",
      "Try logging out and logging back in.",
      "Contact your administrator for assistance."
    ];
  }
  
  if (context === 'api') {
    return [
      "Check your internet connection.",
      "Try again in a few moments.",
      "If you're using a VPN, try disabling it temporarily."
    ];
  }
  
  if (context === 'login') {
    return [
      "Verify your credentials are correct.",
      "Reset your password if you're having trouble.",
      "Check if your account is locked due to too many attempts."
    ];
  }
  
  if (context === 'document') {
    return [
      "Check if there are unsaved changes.",
      "Try saving with a different name.",
      "Verify you have the necessary permissions."
    ];
  }
  
  // Customize based on error message content
  if (errorMessage.includes('permission') || errorMessage.includes('access denied')) {
    return [
      "You may not have sufficient permissions for this action.",
      "Try logging out and logging back in.",
      "Contact your administrator if the problem persists."
    ];
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return [
      "The server took too long to respond.",
      "Check your internet connection.",
      "Try again later when the system might be less busy."
    ];
  }
  
  return steps;
}

/**
 * Get structured resolution steps (for newer components that support it)
 * @param error The error that occurred
 * @param context The context where the error occurred
 * @returns Array of structured resolution steps
 */
export function getStructuredResolutionSteps(error: unknown, context: string): ResolutionStep[] {
  const legacySteps = getErrorResolutionSteps(error, context);
  
  // Convert legacy steps to structured steps
  return legacySteps.map((step, index) => ({
    id: `step-${index}`,
    description: step,
    automated: false
  }));
}

