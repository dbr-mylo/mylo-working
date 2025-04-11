
/**
 * Route validation and navigation utilities
 * 
 * This file serves as the main export point for the refactored navigation utilities.
 */

// Re-export all relevant functions
export { isValidRoute, isTestingRoute, canAccessTestingRoute, isDevelopmentEnvironment } from './routeValidation/core';
export { getPathDescription } from './routeConfig';
export { logNavigation, logNavigationEvent, getNavigationEvents, navigateWithValidation } from './analytics';
export { getRoutePerformanceMetrics, getRoleNavigationPatterns } from './metrics';
export type { RouteConfig, NavigationEvent } from './types';
