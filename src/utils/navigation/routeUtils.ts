
import { validRoutes } from './config/routeDefinitions';

/**
 * Extract path parameters from a URL path
 * @param definedPath - Route path with parameters (e.g., "/user/:id")
 * @param actualPath - Actual path with values (e.g., "/user/123")
 * @returns Object with extracted parameters or null if paths don't match
 */
export const extractPathParameters = (
  definedPath: string,
  actualPath: string
): Record<string, string> | null => {
  // Split paths into segments
  const definedSegments = definedPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  // If different number of segments, paths don't match
  if (definedSegments.length !== actualSegments.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  // Compare each segment
  for (let i = 0; i < definedSegments.length; i++) {
    const definedSeg = definedSegments[i];
    const actualSeg = actualSegments[i];
    
    // If this is a parameter segment (starts with :)
    if (definedSeg.startsWith(':')) {
      const paramName = definedSeg.slice(1); // Remove the colon
      params[paramName] = actualSeg;
    } 
    // If segments don't match and it's not a parameter
    else if (definedSeg !== actualSeg) {
      return null;
    }
  }
  
  return params;
};

/**
 * Parse query parameters from a URL search string
 * @param search - Query string (e.g., "?name=john&age=25")
 * @returns Object with parsed query parameters
 */
export const parseQueryParams = (search: string): Record<string, string> => {
  if (!search || search === '?' || search === '') {
    return {};
  }
  
  const searchParams = new URLSearchParams(search.startsWith('?') ? search.substring(1) : search);
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Create a deep link URL with route parameters and query parameters
 * @param path - Base path (e.g., "/user/:id")
 * @param params - Route parameters (e.g., { id: '123' })
 * @param query - Query parameters (e.g., { tab: 'profile' })
 * @returns Complete URL with parameters (e.g., "/user/123?tab=profile")
 */
export const createDeepLink = (
  path: string,
  params: Record<string, string> = {},
  query: Record<string, string> = {}
): string => {
  // Replace route parameters
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters
  const queryParams = Object.entries(query)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  if (queryParams) {
    result += `?${queryParams}`;
  }
  
  return result;
};

/**
 * Find route configuration that matches a specific path
 * @param path - Path to find configuration for
 * @returns Route configuration or undefined if not found
 */
export const findRouteByPath = (path: string) => {
  // First try exact match
  let route = validRoutes.find(r => r.path === path);
  if (route) return route;
  
  // Then try matching with parameters
  return validRoutes.find(r => {
    if (!r.path.includes(':')) return false;
    
    const params = extractPathParameters(r.path, path);
    return params !== null;
  });
};

/**
 * Check if a path exists in the application routes
 * @param path - Path to check
 * @returns Boolean indicating if the path exists
 */
export const routePathExists = (path: string): boolean => {
  return validRoutes.some(route => {
    // Exact match
    if (route.path === path) return true;
    
    // Check for parametrized routes
    if (route.path.includes(':')) {
      return extractPathParameters(route.path, path) !== null;
    }
    
    return false;
  });
};
