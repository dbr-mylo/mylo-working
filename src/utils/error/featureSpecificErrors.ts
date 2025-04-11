
/**
 * Feature-specific error handling functions
 */
import { ClassifiedError, ErrorCategory } from './errorClassifier';

/**
 * Get feature-specific error message based on error classification 
 * and user role
 * 
 * @param error The classified error
 * @param feature The feature context (e.g., 'editor', 'dashboard', etc.)
 * @param role The user's role (optional)
 * @returns A user-friendly error message
 */
export function getFeatureSpecificErrorMessage(
  error: ClassifiedError,
  feature: string,
  role?: string | null
): string {
  // Default to the classified message
  let message = error.message;
  
  // Document Editor Errors
  if (feature === 'editor' || feature === 'document') {
    if (error.category === ErrorCategory.NETWORK) {
      return "Can't save your document right now. We've stored your changes locally and will automatically save when you're back online.";
    }
    
    if (error.category === ErrorCategory.PERMISSION) {
      return "You don't have permission to edit this document. Changes won't be saved.";
    }
    
    if (error.category === ErrorCategory.VALIDATION && role === 'writer') {
      return "This document contains elements that can't be modified in the writer view.";
    }
    
    if (error.category === ErrorCategory.SERVER) {
      return "The document server is currently unavailable. Your work is being saved locally.";
    }
  }
  
  // Template Designer Errors
  else if (feature === 'template' || feature === 'designer') {
    if (error.category === ErrorCategory.NETWORK) {
      return "Unable to update template. Changes are stored locally and will sync when you're back online.";
    }
    
    if (error.category === ErrorCategory.COMPATIBILITY) {
      return "This template includes features that aren't compatible with your current permissions.";
    }
    
    if (error.category === ErrorCategory.VALIDATION) {
      return "The template structure is invalid. Please check your style definitions.";
    }
  }
  
  // Auth-related Errors
  else if (feature === 'auth') {
    if (error.category === ErrorCategory.NETWORK) {
      return "Authentication service is unavailable. You can continue working in offline mode.";
    }
    
    if (error.category === ErrorCategory.SESSION) {
      return "Your session has expired. We've saved your work locally.";
    }
  }
  
  // Export/Import Errors
  else if (feature === 'export' || feature === 'import') {
    if (error.category === ErrorCategory.FILE_SIZE) {
      return "This file exceeds the maximum size limit. Please compress or split it.";
    }
    
    if (error.category === ErrorCategory.VALIDATION) {
      return "The file format is invalid or corrupted. Check our documentation for supported formats.";
    }
  }
  
  return message;
}

/**
 * Get feature-specific recovery steps for a given error
 * 
 * @param error The classified error
 * @param feature The feature context
 * @param role The user's role (optional)
 * @returns Array of recovery steps
 */
export function getFeatureSpecificRecoverySteps(
  error: ClassifiedError,
  feature: string,
  role?: string | null
): string[] {
  const commonSteps = [
    'Refresh the page and try again',
    'Check your internet connection',
    'Try clearing your browser cache'
  ];
  
  // Document Editor Recovery Steps
  if (feature === 'editor' || feature === 'document') {
    if (error.category === ErrorCategory.NETWORK) {
      return [
        'Continue working - your changes are saved locally',
        'Reconnect to the internet to sync changes',
        'Check if you can access other websites'
      ];
    }
    
    if (error.category === ErrorCategory.PERMISSION) {
      return [
        'Request edit access from the document owner',
        'Make a copy of the document to edit it',
        'Check if you\'re signed in with the correct account'
      ];
    }
  }
  
  // Template Designer Recovery Steps
  else if (feature === 'template' || feature === 'designer') {
    if (error.category === ErrorCategory.VALIDATION) {
      return [
        'Check for invalid style definitions',
        'Remove recently added custom styles',
        'Try resetting to the default template'
      ];
    }
    
    if (error.category === ErrorCategory.COMPATIBILITY) {
      return [
        'Update to the latest version',
        'Remove advanced features not supported in this mode',
        'Contact support for compatibility assistance'
      ];
    }
  }
  
  // Auth-related Recovery Steps
  else if (feature === 'auth') {
    if (error.category === ErrorCategory.SESSION) {
      return [
        'Sign in again to restore your session',
        'Your work is automatically saved locally',
        'Check if your account requires reverification'
      ];
    }
  }
  
  // Export/Import Recovery Steps
  else if (feature === 'export' || feature === 'import') {
    if (error.category === ErrorCategory.FILE_SIZE) {
      return [
        'Compress the file before uploading',
        'Split the document into smaller parts',
        'Remove unnecessary elements to reduce size'
      ];
    }
    
    if (error.category === ErrorCategory.VALIDATION) {
      return [
        'Verify the file is in the correct format',
        'Check if the file is corrupted',
        'Try exporting again with default settings'
      ];
    }
  }
  
  return commonSteps;
}
