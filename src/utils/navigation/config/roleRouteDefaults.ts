
import { UserRole, RoleRouteMap } from '../types';

/**
 * Default routes for each role
 * These are the routes users are directed to after login or when accessing the root URL
 */
export const DEFAULT_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/design',
  'writer': '/',
  'editor': '/',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Fallback routes for each role
 * These are the routes users are directed to when their requested route is invalid
 */
export const FALLBACK_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/design',
  'writer': '/',
  'editor': '/',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Get the default route for a specific user role
 * @param role User role
 * @returns The default route for the role
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  return DEFAULT_ROUTES[String(role)] || '/';
};

/**
 * Get the fallback route for a specific user role
 * @param role User role
 * @returns The fallback route for the role
 */
export const getFallbackRouteForRole = (role: UserRole): string => {
  return FALLBACK_ROUTES[String(role)] || '/not-found';
};
