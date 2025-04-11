
import { ClassifiedError, ErrorCategory } from './errorClassifier';

/**
 * Get feature-specific error messages based on the feature and error type
 * This enhances our error messaging by providing more context-aware messages
 * 
 * @param error The classified error object
 * @param feature The feature where the error occurred
 * @param role The user's role
 * @returns A feature-specific error message
 */
export function getFeatureSpecificErrorMessage(
  error: ClassifiedError,
  feature: string,
  role: string | null | undefined
): string {
  // Editor-specific error messages
  if (feature.includes('editor') || feature.includes('document')) {
    switch (error.category) {
      case ErrorCategory.STORAGE:
        return `We couldn't save your document. ${role === 'writer' ? 'Your work has been backed up locally.' : 'Please try again.'}`;
      
      case ErrorCategory.NETWORK:
        return `The editor is having trouble connecting to the server. ${role === 'writer' ? 'You can continue working, and we\'ll save your changes when the connection is restored.' : 'Please check your connection.'}`;
        
      case ErrorCategory.VALIDATION:
        return `There's a problem with the document format. ${role === 'designer' ? 'This may be due to template constraints.' : 'The document may contain invalid formatting.'}`;
        
      case ErrorCategory.FORMAT:
        return `The document contains formatting that isn't supported. ${role === 'designer' ? 'Please check the template settings.' : 'Try simplifying the document formatting.'}`;
        
      default:
        return error.message;
    }
  }
  
  // Template-specific error messages
  if (feature.includes('template') || feature.includes('design')) {
    switch (error.category) {
      case ErrorCategory.VALIDATION:
        return `The template contains invalid settings. ${role === 'designer' ? 'Please check the template configuration.' : 'Please contact a designer.'}`;
        
      case ErrorCategory.PERMISSION:
        return `You don't have permission to modify this template. ${role === 'admin' ? 'You can grant permissions in the admin panel.' : 'Please request access from an administrator.'}`;
        
      case ErrorCategory.FORMAT:
        return `The template format is invalid. ${role === 'designer' ? 'Check for missing required fields or invalid settings.' : 'Please use a different template.'}`;
        
      default:
        return error.message;
    }
  }
  
  // Authentication-specific error messages
  if (feature.includes('auth') || feature.includes('login')) {
    switch (error.category) {
      case ErrorCategory.AUTHENTICATION:
        return `Your session has expired. Please sign in again.`;
        
      case ErrorCategory.NETWORK:
        return `We couldn't connect to the authentication service. Please check your internet connection.`;
        
      case ErrorCategory.PERMISSION:
        return `You don't have permission to access this feature. ${role === 'admin' ? 'You can manage permissions in the admin panel.' : 'Please contact an administrator for access.'}`;
        
      default:
        return error.message;
    }
  }
  
  // Export/Import error messages
  if (feature.includes('export') || feature.includes('import')) {
    switch (error.category) {
      case ErrorCategory.FORMAT:
        return `The file format is invalid. Please check that you're using a supported format.`;
        
      case ErrorCategory.STORAGE:
        return `There was a problem with the file storage. The file may be too large or corrupted.`;
        
      case ErrorCategory.PERMISSION:
        return `You don't have permission to ${feature.includes('export') ? 'export' : 'import'} files. ${role === 'admin' ? 'You can manage permissions in the admin panel.' : 'Please contact an administrator.'}`;
        
      default:
        return error.message;
    }
  }
  
  // Dashboard-specific error messages
  if (feature.includes('dashboard')) {
    switch (error.category) {
      case ErrorCategory.NETWORK:
        return `We're having trouble loading your dashboard data. Please check your connection.`;
        
      case ErrorCategory.RESOURCE_NOT_FOUND:
        return `Some dashboard resources couldn't be found. ${role === 'admin' ? 'Check the resource configuration.' : 'The resources may have been moved or deleted.'}`;
        
      default:
        return error.message;
    }
  }
  
  // Default to the basic error message
  return error.message;
}

/**
 * Get feature-specific recovery steps
 * 
 * @param error The classified error
 * @param feature The feature where the error occurred
 * @param role The user's role
 * @returns Array of recovery steps specific to the feature
 */
export function getFeatureSpecificRecoverySteps(
  error: ClassifiedError,
  feature: string,
  role: string | null | undefined
): string[] {
  // Editor-specific recovery steps
  if (feature.includes('editor') || feature.includes('document')) {
    switch (error.category) {
      case ErrorCategory.STORAGE:
        return [
          'Try saving with a different document name',
          'Check that you have sufficient storage space',
          'Try exporting the document and re-importing it'
        ];
      
      case ErrorCategory.NETWORK:
        return [
          'Check your internet connection',
          'Wait a few moments and try again',
          'Try working in offline mode until your connection is restored'
        ];
        
      case ErrorCategory.VALIDATION:
        return [
          'Remove any complex formatting',
          'Check for invalid characters or symbols',
          'Try creating a new document with simpler content'
        ];
        
      default:
        return ['Try refreshing the page', 'Contact support if the issue persists'];
    }
  }
  
  // Handle other feature types...
  
  // Default recovery steps
  return [
    'Try refreshing the page',
    'Check your internet connection',
    'Contact support if the issue persists'
  ];
}
