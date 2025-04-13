
import { RouteConfig, UserRole } from '../types';
import { validRoutes } from './routeDefinitions';

/**
 * Get path description if available
 * @param path Path to get description for
 * @returns Description or undefined if not found
 */
export const getPathDescription = (path: string): string | undefined => {
  const route = validRoutes.find(r => r.path === path);
  return route?.description;
};

/**
 * Get routes grouped by category
 * @param group Optional group to filter by
 * @returns Routes organized by group
 */
export const getRoutesByGroup = (group?: string): RouteConfig[] => {
  return group 
    ? validRoutes.filter(route => route.group === group)
    : validRoutes;
};

/**
 * Get all routes available for a specific role
 * @param role User role
 * @returns Array of routes available to the role
 */
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return validRoutes.filter(route => {
    // If no role requirements, anyone can access
    if (!route.requiredRole) {
      return true;
    }
    
    // If role requirements and user has a role, check if allowed
    if (role && route.requiredRole.includes(role)) {
      return true;
    }
    
    return false;
  });
};
