
import { NavigationError, NavigationErrorType, UserRole } from './types';
import { getErrorResolutionSteps } from '@/utils/error/errorResolution';
import { ErrorCategory } from '@/utils/error/errorClassifier';
import { toast } from 'sonner';

/**
 * Format a navigation error message to be user-friendly
 * @param error Navigation error object
 * @param role User role
 * @returns User-friendly error message
 */
export const formatNavigationErrorMessage = (error: NavigationError, role?: UserRole): string => {
  switch (error.type) {
    case NavigationErrorType.UNAUTHORIZED:
      return role ? 
        `Your ${role} role doesn't have permission to access this page` :
        'You need to log in to access this page';
      
    case NavigationErrorType.NOT_FOUND:
      return 'The page you requested could not be found';
      
    case NavigationErrorType.VALIDATION_ERROR:
      return 'The navigation request contains invalid parameters';
      
    case NavigationErrorType.SERVER_ERROR:
      return 'There was a problem with the server while processing your request';
      
    default:
      return 'An unexpected error occurred during navigation';
  }
};

/**
 * Get recovery steps for a navigation error
 * @param error Navigation error
 * @returns Array of recovery step instructions
 */
export const getNavigationErrorRecoverySteps = (error: NavigationError): string[] => {
  const baseSteps: string[] = [];
  
  // Convert to the system's error category
  const errorCategory = navigationalErrorToCategory(error.type);
  
  // Get appropriate resolution steps based on category
  const resolutionSteps = getErrorResolutionSteps(
    new Error(error.message || 'Navigation error'),
    'navigation',
    error.role,
    'navigation'
  );
  
  // Add navigation-specific steps
  switch (error.type) {
    case NavigationErrorType.UNAUTHORIZED:
      baseSteps.push('Make sure you have the correct permissions for this page');
      baseSteps.push('Contact your administrator if you believe this is in error');
      break;
      
    case NavigationErrorType.NOT_FOUND:
      baseSteps.push('Check that the URL is correct');
      baseSteps.push('The page might have been moved or deleted');
      break;
      
    case NavigationErrorType.VALIDATION_ERROR:
      baseSteps.push('Verify that all parameters in the URL are valid');
      baseSteps.push('Try navigating to a parent page');
      break;
      
    case NavigationErrorType.SERVER_ERROR:
      baseSteps.push('Wait a few moments and try again');
      baseSteps.push('If the problem persists, contact support');
      break;
  }
  
  // Combine steps with no duplicates
  return [...new Set([...baseSteps, ...resolutionSteps])];
};

/**
 * Show an error toast with recovery steps
 * @param error Navigation error
 */
export const showNavigationErrorToast = (error: NavigationError): void => {
  const message = formatNavigationErrorMessage(error, error.role);
  const recoverySteps = getNavigationErrorRecoverySteps(error);
  
  toast.error(message, {
    description: recoverySteps.length > 0 ? recoverySteps[0] : undefined,
    duration: 5000,
    action: recoverySteps.length > 1 ? {
      label: "View Help",
      onClick: () => {
        // Open a modal with all recovery steps
        // For now, just log them
        console.info('Navigation Error Recovery Steps:', recoverySteps);
        alert('Recovery steps: ' + recoverySteps.join('\n- '));
      }
    } : undefined
  });
};

/**
 * Map navigation error types to general error categories
 * @param errorType Navigation error type
 * @returns Error category
 */
export const navigationalErrorToCategory = (errorType: NavigationErrorType): ErrorCategory => {
  switch (errorType) {
    case NavigationErrorType.UNAUTHORIZED:
      return ErrorCategory.AUTHORIZATION;
      
    case NavigationErrorType.NOT_FOUND:
      return ErrorCategory.RESOURCE_NOT_FOUND;
      
    case NavigationErrorType.VALIDATION_ERROR:
      return ErrorCategory.VALIDATION;
      
    case NavigationErrorType.SERVER_ERROR:
      return ErrorCategory.SERVER;
      
    default:
      return ErrorCategory.UNKNOWN;
  }
};
