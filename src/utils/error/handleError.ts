
import { toast } from "sonner";
import { trackError } from "./analytics";
import { getUserFriendlyErrorMessage, classifyError, ErrorCategory } from "./errorClassifier";
import { getEnhancedErrorMessage, getEnhancedRecoverySteps } from "./getRoleAwareErrorMessage";

/**
 * Handles an error with consistent logging and user notification
 * 
 * This function centralizes error handling by:
 * 1. Classifying the error for better reporting
 * 2. Logging the error with context
 * 3. Tracking the error for analytics
 * 4. Displaying a user-friendly toast notification
 * 
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
  // Classify the error for better reporting
  const classifiedError = classifyError(error, context);
  
  // Extract error message
  const errorMessage = userMessage || classifiedError.message;
  
  // Determine toast variant based on error category
  const toastVariant = classifiedError.category === ErrorCategory.NETWORK 
    ? "warning" 
    : "error";
  
  // Log error with context
  console.error(`Error in ${context}:`, error);
  console.info(`Classified as: ${classifiedError.category}`);
  
  // Add analytics tracking for errors
  trackError(error, context);
  
  // Show toast notification if requested
  if (shouldToast) {
    toast.error(errorMessage, {
      description: classifiedError.suggestedAction || "See console for more details",
      duration: 5000,
    });
  }
};

/**
 * Enhanced error handler with role-aware and feature-specific messaging
 * 
 * This function extends the basic error handler by providing
 * role-specific and feature-specific error messages
 * 
 * @param error The error to handle
 * @param context Context information about where the error occurred
 * @param role The user's role (admin, editor, designer, etc.)
 * @param feature Optional feature context (editor, template, auth, etc.)
 * @param userMessage Optional custom message to override the generated message
 * @param shouldToast Whether to show a toast notification (default: true)
 */
export const handleRoleAwareError = (
  error: unknown,
  context: string,
  role: string | null,
  feature?: string,
  userMessage?: string,
  shouldToast: boolean = true
): void => {
  // Get enhanced message
  const enhancedMessage = getEnhancedErrorMessage(error, context, role, feature);
  
  // Use standard error handler with enhanced message
  handleError(error, context, userMessage || enhancedMessage, shouldToast);
};

/**
 * Get recovery steps for an error based on classification, role, and feature
 * 
 * @param error The error to get recovery steps for
 * @param context Context information about where the error occurred
 * @param role The user's role
 * @param feature Optional feature context
 * @returns Array of recovery step strings
 */
export const getErrorRecoverySteps = (
  error: unknown, 
  context: string, 
  role: string | null | undefined,
  feature?: string
): string[] => {
  return getEnhancedRecoverySteps(error, context, role, feature);
};
