
/**
 * Route validation utility
 * 
 * This module provides tools to validate route configurations and identify
 * inconsistencies or navigation issues.
 */

import { validRoutes } from './routeConfig';
import { NavigationEvent } from './types';

/**
 * Check if the path exists in the validRoutes configuration
 * @param path Path to validate
 */
export const doesRouteExist = (path: string): boolean => {
  // Handle exact matches
  if (validRoutes.some(route => route.path === path)) {
    return true;
  }
  
  // Handle dynamic routes with parameters
  const dynamicRoutes = validRoutes.filter(route => route.path.includes(':'));
  
  for (const dynamicRoute of dynamicRoutes) {
    const routeParts = dynamicRoute.path.split('/');
    const pathParts = path.split('/');
    
    if (routeParts.length !== pathParts.length) continue;
    
    let isMatch = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) continue;
      if (routeParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }
    
    if (isMatch) return true;
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
