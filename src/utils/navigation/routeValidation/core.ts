import { validRoutes, getPathDescription } from '../routeConfig';

/**
 * Validates if a route is valid for the application
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if the route is valid
 */
export const isValidRoute = (path: string, userRole?: string | null): boolean => {
  // Check if path matches any of the valid routes
  for (const route of validRoutes) {
    // Handle exact matches
    if (route.path === path) {
      // Check role requirements if specified
      if (route.requiredRole && userRole) {
        return route.requiredRole.includes(userRole);
      }
      return true;
    }
    
    // Handle routes with parameters
    if (route.path.includes(':') && route.params) {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      
      // Different length means it's not matching this route pattern
      if (routeParts.length !== pathParts.length) continue;
      
      let isMatch = true;
      for (let i = 0; i < routeParts.length; i++) {
        // If this part is a parameter, it matches anything
        if (routeParts[i].startsWith(':')) continue;
        // Otherwise, it must match exactly
        if (routeParts[i] !== pathParts[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        // Check role requirements if specified
        if (route.requiredRole && userRole) {
          return route.requiredRole.includes(userRole);
        }
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Check if a route is a testing route
 * @param path - The path to check
 * @returns Boolean indicating if the route is a testing route
 */
export const isTestingRoute = (path: string): boolean => {
  return path.startsWith('/testing/');
};

/**
 * Check if the current environment is development
 * @returns Boolean indicating if the environment is development
 */
export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Special validation for testing routes
 * In development, we allow access to testing routes for easier debugging
 * In production, we enforce role-based access
 * 
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if access is allowed
 */
export const canAccessTestingRoute = (path: string, userRole?: string | null): boolean => {
  // Always allow in development for easier debugging
  if (isDevelopmentEnvironment()) {
    return true;
  }
  
  // In production, enforce role-based access (admin only by default)
  return isValidRoute(path, userRole);
};
