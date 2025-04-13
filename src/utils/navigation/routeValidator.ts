
/**
 * Route validation utility
 * 
 * This module provides tools to validate route configurations and identify
 * inconsistencies or navigation issues.
 */

import { validRoutes } from './config/routeDefinitions';
import { NavigationEvent, RouteValidationError } from '@/utils/navigation/types';

/**
 * Error types specific to route validation
 */
export enum RouteValidationErrorType {
  INVALID_PATH = 'invalid_path',
  MALFORMED_PATH = 'malformed_path',
  PARAMETER_MISMATCH = 'parameter_mismatch',
  VALIDATION_FAILED = 'validation_failed'
}

/**
 * Check if a route exists in the route configuration
 * @param path The route path to check
 * @returns Boolean indicating if the route exists
 * @throws {Error} If path is not a string
 */
export const doesRouteExist = (path: string): boolean => {
  // Input validation
  if (typeof path !== 'string') {
    throw new Error(`Invalid path: expected string but got ${typeof path}`);
  }

  if (path.trim() === '') {
    console.warn('Empty path provided to doesRouteExist');
    return false;
  }
  
  // Check for exact route match
  if (validRoutes.some(route => route.path === path)) {
    return true;
  }
  
  // Check for dynamic routes with parameters
  const pathParts = path.split('/');
  
  for (const route of validRoutes) {
    if (!route.path.includes(':')) continue;
    
    const routeParts = route.path.split('/');
    if (routeParts.length !== pathParts.length) continue;
    
    let isMatch = true;
    for (let i = 0; i < routeParts.length; i++) {
      // If this part is a parameter, it matches anything
      if (routeParts[i].startsWith(':')) continue;
      // Otherwise parts must match exactly
      if (routeParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }
    
    if (isMatch) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get information about navigation failures
 * @param events Navigation events
 * @returns Array of failed navigation events
 * @throws {Error} If events parameter is not an array
 */
export const getNavigationFailures = (events: NavigationEvent[]): NavigationEvent[] => {
  // Input validation
  if (!Array.isArray(events)) {
    throw new Error(`Invalid events: expected array but got ${typeof events}`);
  }
  
  return events.filter(event => !event.success);
};

/**
 * Find patterns in failed navigations to identify systemic issues
 * @param events Navigation events
 * @returns Record mapping destination paths to failure count
 * @throws {Error} If events parameter is not an array
 */
export const analyzeNavigationFailures = (events: NavigationEvent[]): Record<string, number> => {
  // Input validation
  if (!Array.isArray(events)) {
    throw new Error(`Invalid events: expected array but got ${typeof events}`);
  }

  const failures = getNavigationFailures(events);
  const patterns: Record<string, number> = {};
  
  failures.forEach(failure => {
    if (!patterns[failure.to]) {
      patterns[failure.to] = 0;
    }
    patterns[failure.to]++;
  });
  
  return patterns;
};

/**
 * Check a list of navigation paths against valid routes
 * @param paths Array of paths to check
 * @returns Object containing valid and invalid paths
 * @throws {Error} If paths parameter is not an array
 */
export const validateNavigationPaths = (paths: string[]): { 
  valid: string[], 
  invalid: string[],
  validationErrors?: Record<string, RouteValidationErrorType>
} => {
  // Input validation
  if (!Array.isArray(paths)) {
    throw new Error(`Invalid paths: expected array but got ${typeof paths}`);
  }

  const valid: string[] = [];
  const invalid: string[] = [];
  const validationErrors: Record<string, RouteValidationErrorType> = {};
  
  paths.forEach(path => {
    try {
      if (doesRouteExist(path)) {
        valid.push(path);
      } else {
        invalid.push(path);
        validationErrors[path] = RouteValidationErrorType.INVALID_PATH;
      }
    } catch (error) {
      invalid.push(path);
      validationErrors[path] = RouteValidationErrorType.MALFORMED_PATH;
      console.error(`Route validation error for path "${path}":`, error);
    }
  });
  
  return { valid, invalid, validationErrors };
};

/**
 * Checks if a path matches a dynamic route pattern and extracts parameters
 * @param path The actual path to check
 * @param routePattern The route pattern to match against
 * @returns Object with match status and extracted parameters
 */
export const extractRouteParameters = (
  path: string, 
  routePattern: string
): { isMatch: boolean; params: Record<string, string> } => {
  const params: Record<string, string> = {};
  
  if (!path || !routePattern) {
    return { isMatch: false, params };
  }
  
  const pathParts = path.split('/');
  const routeParts = routePattern.split('/');
  
  if (pathParts.length !== routeParts.length) {
    return { isMatch: false, params };
  }
  
  let isMatch = true;
  
  for (let i = 0; i < routeParts.length; i++) {
    // Extract parameter
    if (routeParts[i].startsWith(':')) {
      const paramName = routeParts[i].substring(1);
      params[paramName] = pathParts[i];
      continue;
    }
    
    // Match static parts
    if (routeParts[i] !== pathParts[i]) {
      isMatch = false;
      break;
    }
  }
  
  return { isMatch, params };
};

/**
 * Logs route validation errors for analytics and monitoring
 * @param path The path that failed validation
 * @param errorType The type of validation error
 * @param details Additional error details
 */
export const logRouteValidationError = (
  path: string,
  errorType: RouteValidationErrorType,
  details?: string
): void => {
  console.error(
    `Route validation error [${errorType}] for path "${path}"${details ? ': ' + details : ''}`
  );
  
  // In a production environment, this would send the error to an analytics or monitoring service
  // Example: analyticsService.trackError('route_validation', { path, errorType, details });
};
