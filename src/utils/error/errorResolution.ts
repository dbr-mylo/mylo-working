
/**
 * Error Resolution System
 * 
 * Provides guidance and steps for resolving different types of errors.
 */
import { ErrorCategory } from './errorClassifier';
import { ErrorPattern, ResolutionStep } from './troubleshootingPatterns';

// Define resolution steps for different error categories
export function getErrorResolutionSteps(category: ErrorCategory): ResolutionStep[] {
  switch (category) {
    case ErrorCategory.NETWORK:
      return [
        {
          id: 'network_check_connection',
          description: 'Check your internet connection',
          instruction: 'Verify that your device is connected to the internet',
          automatable: true,
          completed: false
        },
        {
          id: 'network_try_reload',
          description: 'Reload the application',
          instruction: 'Try refreshing the page or restarting the application',
          automatable: false,
          completed: false
        },
        {
          id: 'network_check_server',
          description: 'Check server status',
          instruction: 'Verify that the server is online and accessible',
          automatable: true,
          completed: false
        }
      ];
      
    case ErrorCategory.AUTHENTICATION:
    case ErrorCategory.AUTH:
    case ErrorCategory.SESSION:
      return [
        {
          id: 'auth_refresh_session',
          description: 'Refresh your session',
          instruction: 'Attempting to refresh your authentication session',
          automatable: true,
          completed: false
        },
        {
          id: 'auth_login_again',
          description: 'Log in again',
          instruction: 'You may need to log in again to continue',
          automatable: false,
          completed: false
        },
        {
          id: 'auth_clear_cookies',
          description: 'Clear cookies and cache',
          instruction: 'Try clearing your browser cookies and cache',
          automatable: false,
          completed: false
        }
      ];
      
    case ErrorCategory.PERMISSION:
      return [
        {
          id: 'permission_verify_access',
          description: 'Verify your access level',
          instruction: 'Check that you have the necessary permissions',
          automatable: true,
          completed: false
        },
        {
          id: 'permission_request_access',
          description: 'Request access',
          instruction: 'Contact an administrator to request access',
          automatable: false,
          completed: false
        },
        {
          id: 'permission_try_different_resource',
          description: 'Try a different resource',
          instruction: 'Try accessing a different resource or feature',
          automatable: false,
          completed: false
        }
      ];
      
    case ErrorCategory.VALIDATION:
      return [
        {
          id: 'validation_check_input',
          description: 'Check your input',
          instruction: 'Verify that all required fields are filled correctly',
          automatable: false,
          completed: false
        },
        {
          id: 'validation_format_data',
          description: 'Format data correctly',
          instruction: 'Ensure your data matches the required format',
          automatable: false,
          completed: false
        },
        {
          id: 'validation_try_example',
          description: 'Try example data',
          instruction: 'Try using example data to understand the required format',
          automatable: false,
          completed: false
        }
      ];
      
    default:
      return [
        {
          id: 'general_retry',
          description: 'Retry the operation',
          instruction: 'Try the operation again',
          automatable: true,
          completed: false
        },
        {
          id: 'general_refresh_page',
          description: 'Refresh the page',
          instruction: 'Reload the application',
          automatable: false,
          completed: false
        },
        {
          id: 'general_restart_browser',
          description: 'Restart your browser',
          instruction: 'Close and reopen your browser',
          automatable: false,
          completed: false
        }
      ];
  }
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
