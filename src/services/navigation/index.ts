
/**
 * Navigation Service Barrel File
 * 
 * This file simplifies imports by exporting all navigation-related
 * functionality from a single source.
 */

// Re-export the main service and singleton instance
export { NavigationService, navigationService } from './NavigationService';

// Re-export core functionality
export { NavigationServiceCore } from './core/NavigationServiceCore';

// Re-export validation functionality
export { RouteValidator } from './validation/RouteValidator';

// Re-export error handling functionality
export { NavigationErrorHandler } from './errors/NavigationErrorHandler';

// Export types
export { 
  NavigationError, 
  NavigationErrorType,
  NavigationEvent,
  UserRole
} from '@/utils/navigation/types';
