
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
  if (feature) {
    try {
      const featureRecoverySteps = getFeatureSpecificRecoverySteps(classifiedError, feature, role);
      return featureRecoverySteps;
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

/**
 * Get feature-specific recovery steps
 * 
 * @param error The classified error
 * @param feature The feature where the error occurred
 * @param role The user's role
 * @returns Array of recovery steps specific to the feature
 */
function getFeatureSpecificRecoverySteps(
  error: ClassifiedError,
  feature: string,
  role: string | null | undefined
): string[] {
  // Try importing directly instead of using require
  try {
    // Import from featureSpecificErrors
    const { getFeatureSpecificRecoverySteps } = require('./featureSpecificErrors');
    return getFeatureSpecificRecoverySteps(error, feature, role);
  } catch (e) {
    console.error('Feature-specific recovery steps not available', e);
    
    // Default recovery steps based on feature
    if (feature === 'editor' || feature === 'document') {
      return [
        'Save your work locally if possible',
        'Try reopening the document',
        'Contact support if the issue persists'
      ];
    } else if (feature === 'auth') {
      return [
        'Try signing out and back in',
        'Clear your browser cookies',
        'Reset your password if needed'
      ];
    }
    
    return [
      'Try refreshing the page',
      'Check your internet connection',
      'Contact support if the issue persists'
    ];
  }
}

export { getFeatureSpecificRecoverySteps };
