
/**
 * Error Resolution System
 * 
 * Provides guidance and steps for resolving different types of errors.
 */
import { ErrorCategory } from './errorClassifier';
import { ResolutionStep } from './types';

// Define resolution steps for different error categories
export function getErrorResolutionSteps(category: ErrorCategory): string[] {
  switch (category) {
    case ErrorCategory.NETWORK:
      return [
        'Check your internet connection',
        'Reload the application',
        'Check server status'
      ];
      
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      return [
        'Refresh your session',
        'Log in again',
        'Clear cookies and cache'
      ];
      
    case ErrorCategory.PERMISSION:
      return [
        'Verify your access level',
        'Request access',
        'Try a different resource'
      ];
      
    case ErrorCategory.VALIDATION:
      return [
        'Check your input',
        'Format data correctly',
        'Try example data'
      ];
      
    default:
      return [
        'Retry the operation',
        'Refresh the page',
        'Restart your browser'
      ];
  }
}

// For backward compatibility with old error signature
export function getErrorResolutionSteps2(error: unknown, context: string): string[] {
  // This function serves as an adapter for code that still expects the old function signature
  // In a real project, you would gradually migrate all callers to the new signature
  return [
    'Retry the operation',
    'Check your internet connection',
    'Clear browser cache',
    'Contact support if the issue persists'
  ];
}

// Get a human-readable title for the resolution workflow
export function getResolutionTitle(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Connection Troubleshooter';
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      return 'Authentication Troubleshooter';
    case ErrorCategory.PERMISSION:
      return 'Permissions Troubleshooter';
    case ErrorCategory.VALIDATION:
      return 'Validation Helper';
    case ErrorCategory.STORAGE:
      return 'Storage Troubleshooter';
    case ErrorCategory.DATABASE:
      return 'Database Troubleshooter';
    case ErrorCategory.TIMEOUT:
      return 'Timeout Resolver';
    case ErrorCategory.SERVER:
      return 'Server Issues Troubleshooter';
    case ErrorCategory.RESOURCE_NOT_FOUND:
      return 'Missing Resource Helper';
    default:
      return 'Problem Solver';
  }
}

// Get friendly description for a resolution workflow
export function getResolutionDescription(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Let\'s check your connection and help you get back online.';
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      return 'We\'ll help you resolve your login session issues.';
    case ErrorCategory.PERMISSION:
      return 'Let\'s troubleshoot your access permissions.';
    case ErrorCategory.VALIDATION:
      return 'We\'ll help you fix any issues with your input data.';
    case ErrorCategory.STORAGE:
      return 'Let\'s solve problems with your storage or disk space.';
    case ErrorCategory.DATABASE:
      return 'We\'ll troubleshoot database connection issues.';
    case ErrorCategory.TIMEOUT:
      return 'Let\'s resolve timeout issues that might be affecting your experience.';
    case ErrorCategory.SERVER:
      return 'We\'ll help identify and resolve server-related issues.';
    case ErrorCategory.RESOURCE_NOT_FOUND:
      return 'Let\'s find what you\'re looking for or restore missing resources.';
    default:
      return 'Let\'s work through this issue step by step.';
  }
}
