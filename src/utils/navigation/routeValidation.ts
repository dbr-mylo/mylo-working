
/**
 * Route validation and navigation utilities
 * 
 * This file serves as the main export point for the navigation utilities.
 */

// Re-export all relevant functions
export { isValidRoute, isTestingRoute, canAccessTestingRoute, isDevelopmentEnvironment } from './routeValidation/core';
export { 
  getPathDescription, 
  getDefaultRouteForRole as getDefaultRoute, 
  getFallbackRouteForRole as getFallbackRoute
} from './routeConfig';
export { logNavigation, getNavigationEvents, navigateWithValidation } from './analytics';
export { getRoutePerformanceMetrics, getRoleNavigationPatterns } from './metrics';
export type { RouteConfig, NavigationEvent, NavigationError, NavigationErrorType } from './types';
