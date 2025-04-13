
import { UserRole, RoleRouteMap } from '../types';

/**
 * Default routes for each role
 */
export const DEFAULT_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard',
  null: '/auth'
};

/**
 * Fallback routes to use when a user doesn't have access to a requested route
 */
export const FALLBACK_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard',
  null: '/auth'
};

/**
 * Get the default route for a given role
 * @param role User role
 * @returns Default route for the role
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  return DEFAULT_ROUTES[role] || '/auth';
};

/**
 * Get the fallback route for a given role
 * @param role User role
 * @returns Fallback route for the role
 */
export const getFallbackRouteForRole = (role: UserRole): string => {
  return FALLBACK_ROUTES[role] || '/auth';
};
