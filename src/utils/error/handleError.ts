
import { toast } from "sonner";
import { trackError } from "./analytics";
import { getUserFriendlyErrorMessage, classifyError, ErrorCategory } from "./errorClassifier";

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
 * Enhanced error handler with role-aware messaging
 * 
 * This function extends the basic error handler by providing
 * role-specific error messages tailored to different user roles
 * (e.g., admin, editor, designer)
 * 
 * @param error The error to handle
 * @param context Context information about where the error occurred
 * @param role The user's role (admin, editor, designer, etc.)
 * @param userMessage Optional custom message to override the role-specific message
 * @param shouldToast Whether to show a toast notification (default: true)
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
