
import { toast } from "sonner";
import { trackError } from "./analytics";
import { getUserFriendlyErrorMessage, classifyError, ErrorCategory } from "./errorClassifier";

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
 * Enhanced error handler with role-aware messaging
 */
export const handleRoleAwareError = (
  error: unknown,
  context: string,
  role: string | null,
  userMessage?: string,
  shouldToast: boolean = true
): void => {
  // Get role-specific message
  const roleMessage = getUserFriendlyErrorMessage(error, context, role);
  
  // Use standard error handler with role-specific message
  handleError(error, context, userMessage || roleMessage, shouldToast);
};
