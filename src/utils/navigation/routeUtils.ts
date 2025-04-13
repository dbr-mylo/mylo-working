
import { UserRole, RouteConfig, RoutePermission, RouteGroup } from './types';
import { validRoutes } from './config/routeDefinitions';

/**
 * Check if a route exists in the application
 * @param path Route path to check
 * @returns Boolean indicating if the route exists
 */
export const routeExists = (path: string): boolean => {
  return validRoutes.some(route => route.path === path);
};

/**
 * Get route metadata for a specific path
 * @param path Route path to get metadata for
 * @returns Route configuration or null if not found
 */
export const getRouteConfig = (path: string): RouteConfig | null => {
  return validRoutes.find(route => route.path === path) || null;
};

/**
 * Get route description for a specific path
 * @param path Route path to get description for
 * @returns Route description or the path if not found
 */
export const getPathDescription = (path: string): string => {
  const route = getRouteConfig(path);
  return route ? route.description : path;
};

/**
 * Get default route for a specific role
 * @param role User role
 * @returns Default route for the role
 */
export const getDefaultRouteForRole = (role: UserRole | null): string => {
  if (!role) {
    return "/auth";
  }
  
  // Find a route with this role as defaultForRole
  const defaultRoute = validRoutes.find(route => 
    route.defaultForRole && route.defaultForRole.includes(role)
  );
  
  // Return the default if found, otherwise fallback to home
  return defaultRoute ? defaultRoute.path : "/";
};

/**
 * Get fallback route for a specific role
 * @param role User role
 * @returns Fallback route for the role
 */
export const getFallbackRouteForRole = (role: UserRole | null): string => {
  if (!role) {
    return "/auth";
  }
  
  // Use role defaults as fallback
  return getDefaultRouteForRole(role);
};

/**
 * Extract path parameters from a route definition and actual path
 * @param definedPath Route definition with parameters (e.g., /user/:id)
 * @param actualPath Actual path with values (e.g., /user/123)
 * @returns Object with parameter values or null if paths don't match
 */
export const extractPathParameters = (
  definedPath: string, 
  actualPath: string
): Record<string, string> | null => {
  // Split paths into segments
  const definedSegments = definedPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  // If segment counts don't match, paths don't match
  if (definedSegments.length !== actualSegments.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  // Compare segments and extract parameters
  for (let i = 0; i < definedSegments.length; i++) {
    const definedSegment = definedSegments[i];
    const actualSegment = actualSegments[i];
    
    // Check if this is a parameter segment
    if (definedSegment.startsWith(':')) {
      const paramName = definedSegment.substring(1);
      params[paramName] = actualSegment;
    } 
    // If not a parameter, segments must match
    else if (definedSegment !== actualSegment) {
      return null;
    }
  }
  
  return params;
};

/**
 * Parse query parameters from URL search string
 * @param search URL search string
 * @returns Object with query parameters
 */
export const parseQueryParams = (search: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(search);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Create a deep link URL from path, parameters, and query
 * @param path Base path
 * @param params Route parameters
 * @param query Query parameters
 * @returns Deep link URL
 */
export const createDeepLink = (
  path: string,
  params: Record<string, string> = {},
  query: Record<string, string> = {}
): string => {
  // Replace path parameters
  let url = path;
  
  // Replace path parameters (e.g., :id with actual value)
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters if any
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(query)
        .filter(([_, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    
    url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
  }
  
  return url;
};

/**
 * Get route group for a specific path
 * @param path Route path
 * @returns Route group or null if not found
 */
export const getRouteGroup = (path: string): RouteGroup | null => {
  const route = getRouteConfig(path);
  return route ? route.group : null;
};

/**
 * Check if a route requires a specific role
 * @param path Route path
 * @param role User role to check
 * @returns Boolean indicating if the route is available for the role
 */
export const isRouteAvailableForRole = (path: string, role: UserRole | null): boolean => {
  const route = getRouteConfig(path);
  
  // If route doesn't exist, it's not available
  if (!route) {
    return false;
  }
  
  // If no role requirements, route is available to all authenticated users
  if (!route.requiredRole) {
    // For public routes, allow null role
    if (route.accessLevel === 'public') {
      return true;
    }
    
    // For other routes, require authentication
    return role !== null;
  }
  
  // If role is required but user has no role, route is not available
  if (!role) {
    return false;
  }
  
  // Check if user role is in required roles
  return route.requiredRole.includes(role);
};
