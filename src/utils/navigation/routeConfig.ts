
/**
 * Route configuration module
 * 
 * This file serves as the main export point for route configuration.
 * It centralizes all route-related functionality by re-exporting from
 * more specialized modules.
 */

// Re-export route groups
export { routeGroups, type RouteGroupType } from './config/routeGroups';

// Re-export route definitions
export { validRoutes } from './config/routeDefinitions';

// Re-export default and fallback routes
export { 
  DEFAULT_ROUTES,
  FALLBACK_ROUTES,
  getDefaultRouteForRole,
  getFallbackRouteForRole 
} from './config/roleRouteDefaults';

// Re-export route utility functions
export { 
  getPathDescription,
  getRoutesByGroup,
  getRoutesForRole 
} from './config/routeUtils';
