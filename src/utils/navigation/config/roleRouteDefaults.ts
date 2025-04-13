
import { UserRole, RoleRouteMap } from '../types';

/**
 * Default routes for each role
 * These are the routes users are directed to after login or when accessing the root URL
 */
export const DEFAULT_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Fallback routes for each role
 * These are the routes users are directed to when their requested route is invalid
 */
export const FALLBACK_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Secondary fallback routes (used when primary fallback is also inaccessible)
 * These should be very basic routes that are guaranteed to exist
 */
export const SECONDARY_FALLBACK_ROUTES: RoleRouteMap = {
  'admin': '/',
  'designer': '/',
  'writer': '/',
  'editor': '/',
  'null': '/auth'
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

/**
 * Get the secondary fallback route for a specific user role
 * Used when both the requested route and primary fallback route are inaccessible
 * @param role User role
 * @returns The secondary fallback route for the role
 */
export const getSecondaryFallbackRouteForRole = (role: UserRole): string => {
  return SECONDARY_FALLBACK_ROUTES[String(role)] || '/error';
};

/**
 * Check if a route is a default route for any role
 * @param path Route path
 * @returns Boolean indicating if the route is a default route
 */
export const isDefaultRoute = (path: string): boolean => {
  return Object.values(DEFAULT_ROUTES).includes(path);
};

/**
 * Get the role for which this route is the default
 * @param path Route path
 * @returns Array of roles or empty array if none
 */
export const getRolesForDefaultRoute = (path: string): UserRole[] => {
  return Object.entries(DEFAULT_ROUTES)
    .filter(([_, route]) => route === path)
    .map(([role]) => role as UserRole);
};
