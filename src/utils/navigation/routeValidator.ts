/**
 * Route validation utility
 * 
 * This module provides tools to validate route configurations and identify
 * inconsistencies or navigation issues.
 */

import { validRoutes } from './config/routeDefinitions';

/**
 * Check if a route exists in the route configuration
 * @param path The route path to check
 * @returns Boolean indicating if the route exists
 */
export const doesRouteExist = (path: string): boolean => {
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
 */
export const getNavigationFailures = (events: NavigationEvent[]): NavigationEvent[] => {
  return events.filter(event => !event.success);
};

/**
 * Find patterns in failed navigations to identify systemic issues
 * @param events Navigation events
 */
export const analyzeNavigationFailures = (events: NavigationEvent[]): Record<string, number> => {
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
 */
export const validateNavigationPaths = (paths: string[]): { valid: string[], invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  paths.forEach(path => {
    if (doesRouteExist(path)) {
      valid.push(path);
    } else {
      invalid.push(path);
    }
  });
  
  return { valid, invalid };
};
