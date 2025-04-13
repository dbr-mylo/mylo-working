
import { UserRole } from '@/lib/types';

/**
 * Extracts parameters from a route path
 * @param definedPath Route path with parameters (e.g., "/user/:id")
 * @param actualPath Actual path with values (e.g., "/user/123")
 * @returns Object with extracted parameters or null if paths don't match
 */
export const extractPathParameters = (
  definedPath: string, 
  actualPath: string
): Record<string, string> | null => {
  // Split both paths into segments
  const definedSegments = definedPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  // If the number of segments doesn't match, the paths don't match
  if (definedSegments.length !== actualSegments.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  // Compare each segment
  for (let i = 0; i < definedSegments.length; i++) {
    const definedSegment = definedSegments[i];
    const actualSegment = actualSegments[i];
    
    // If the defined segment is a parameter (starts with a colon)
    if (definedSegment.startsWith(':')) {
      const paramName = definedSegment.substring(1);
      params[paramName] = actualSegment;
    } 
    // If the segments don't match and it's not a parameter, the paths don't match
    else if (definedSegment !== actualSegment) {
      return null;
    }
  }
  
  return params;
};

/**
 * Check if a path is active, accounting for exact and partial matches
 * @param currentPath Current route path
 * @param targetPath Path to check against
 * @param exact Whether to check for exact match
 * @returns Boolean indicating if path is active
 */
export const isActivePath = (
  currentPath: string,
  targetPath: string,
  exact = false
): boolean => {
  if (exact) {
    return currentPath === targetPath;
  }
  
  // Handle root path special case
  if (targetPath === '/' && currentPath !== '/') {
    return false;
  }
  
  return currentPath.startsWith(targetPath);
};

/**
 * Format a path for display
 * @param path Route path
 * @returns Formatted path for display
 */
export const formatPathForDisplay = (path: string): string => {
  // Remove leading and trailing slashes
  let formatted = path.replace(/^\/|\/$/g, '');
  
  // Replace remaining slashes with spaces
  formatted = formatted.replace(/\//g, ' / ');
  
  // Replace hyphens with spaces
  formatted = formatted.replace(/-/g, ' ');
  
  // Handle empty path (root)
  if (!formatted) {
    return 'Home';
  }
  
  // Capitalize each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Types for route utils
 */

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  isExact: boolean;
}

export interface BreadcrumbItem {
  path: string;
  label: string;
  isActive: boolean;
}

export interface RouteTransition {
  from: string;
  to: string;
  params?: Record<string, string>;
  timestamp: string;
  userRole?: UserRole;
}

/**
 * Create a deep link URL
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
  let processedPath = path;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    processedPath = processedPath.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters if any
  if (Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    ).toString();
    
    if (queryString) {
      processedPath = `${processedPath}${processedPath.includes('?') ? '&' : '?'}${queryString}`;
    }
  }
  
  return processedPath;
};

/**
 * Parse query parameters from a URL search string
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
 * Get route configuration by path
 * @param path Route path
 * @returns Route configuration if found
 */
export const getRouteConfig = (path: string) => {
  // Import from config to avoid circular dependency
  const { validRoutes } = require('./config/routeDefinitions');
  return validRoutes.find(route => route.path === path);
};

/**
 * Get path description
 * @param path Route path
 * @returns Description of the path
 */
export const getPathDescription = (path: string): string => {
  const config = getRouteConfig(path);
  if (config) {
    return config.description;
  }
  
  // If no config is found, generate a description from the path
  return formatPathForDisplay(path);
};
