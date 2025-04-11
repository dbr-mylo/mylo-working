import { ClassifiedError, classifyError } from "./errorClassifier";
import { getRoleSpecificErrorMessage } from "./roleSpecificErrors";
import { getFeatureSpecificErrorMessage } from "./featureSpecificErrors";

/**
 * Enhanced error message generator that combines role awareness
 * with feature-specific context
 * 
 * @param error The error to get a message for
 * @param context Context where the error occurred 
 * @param role User's role
 * @param feature Specific feature (optional)
 * @returns A user-friendly error message
 */
export function getEnhancedErrorMessage(
  error: unknown,
  context: string,
  role: string | null | undefined,
  feature?: string
): string {
  // First classify the error
  const classifiedError = classifyError(error, context);
  
  // If a specific feature is provided, get feature-specific message
  if (feature) {
    const featureMessage = getFeatureSpecificErrorMessage(classifiedError, feature, role);
    if (featureMessage !== classifiedError.message) {
      return featureMessage;
    }
  }
  
  // Otherwise fall back to role-specific message
  return getRoleSpecificErrorMessage(error, role, context);
}

/**
 * Get recovery steps based on error classification, role, and feature
 * 
 * @param error The error that occurred
 * @param context Context where the error occurred
 * @param role User's role
 * @param feature Specific feature (optional)
 * @returns Array of recovery steps
 */
export function getEnhancedRecoverySteps(
  error: unknown,
  context: string,
  role: string | null | undefined,
  feature?: string
): string[] {
  // First classify the error
  const classifiedError = classifyError(error, context);
  
  // If a specific feature is provided, get feature-specific recovery steps
  if (feature && typeof getFeatureSpecificRecoverySteps === 'function') {
    try {
      const { getFeatureSpecificRecoverySteps } = require('./featureSpecificErrors');
      return getFeatureSpecificRecoverySteps(classifiedError, feature, role);
    } catch (e) {
      console.error('Error loading feature-specific recovery steps', e);
    }
  }
  
  // Otherwise fall back to standard recovery steps
  try {
    const { getErrorResolutionSteps } = require('./errorResolution');
    return getErrorResolutionSteps(error, context);
  } catch (e) {
    console.error('Error loading standard recovery steps', e);
    return [
      'Try refreshing the page',
      'Check your internet connection',
      'Contact support if the issue persists'
    ];
  }
}
