
import { UserRole } from '@/lib/types';

/**
 * Default routes for each role
 */
export const DEFAULT_ROUTES: Record<string, string> = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard', // Legacy support for "editor" role
  null: '/auth' // Default for unauthenticated users
};

/**
 * Fallback routes for each role
 * Used when a navigation error occurs and we need a safe destination
 */
export const FALLBACK_ROUTES: Record<string, string> = {
  'admin': '/admin',
  'designer': '/designer-dashboard',
  'writer': '/writer-dashboard',
  'editor': '/writer-dashboard', // Legacy support for "editor" role
  null: '/auth' // Fallback for unauthenticated users
};

/**
 * Get the default route for a user role
 * @param role User role
 * @returns Default route path
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  // Handle null role explicitly
  if (role === null) {
    return DEFAULT_ROUTES.null;
  }
  
  return DEFAULT_ROUTES[role] || DEFAULT_ROUTES.null;
};

/**
 * Get the fallback route for a user role
 * @param role User role
 * @returns Fallback route path
 */
export const getFallbackRouteForRole = (role: UserRole): string => {
  // Handle null role explicitly
  if (role === null) {
    return FALLBACK_ROUTES.null;
  }
  
  return FALLBACK_ROUTES[role] || FALLBACK_ROUTES.null;
};

/**
 * Role to route configuration interfaces
 */
export interface RoleRouteConfig {
  defaultRoute: string;
  fallbackRoute: string;
  homeRoute: string;
  authRequiredRedirect: string;
  adminRoute?: string;
  dashboardRoute: string;
}

export const ROLE_ROUTE_CONFIG: Record<string, RoleRouteConfig> = {
  'admin': {
    defaultRoute: '/admin',
    fallbackRoute: '/admin',
    homeRoute: '/admin',
    authRequiredRedirect: '/auth',
    dashboardRoute: '/admin'
  },
  'designer': {
    defaultRoute: '/designer-dashboard',
    fallbackRoute: '/designer-dashboard',
    homeRoute: '/designer-dashboard',
    authRequiredRedirect: '/auth',
    adminRoute: '/admin',
    dashboardRoute: '/designer-dashboard'
  },
  'writer': {
    defaultRoute: '/writer-dashboard',
    fallbackRoute: '/writer-dashboard',
    homeRoute: '/writer-dashboard',
    authRequiredRedirect: '/auth',
    adminRoute: '/admin',
    dashboardRoute: '/writer-dashboard'
  },
  'editor': { // Legacy support
    defaultRoute: '/writer-dashboard',
    fallbackRoute: '/writer-dashboard',
    homeRoute: '/writer-dashboard',
    authRequiredRedirect: '/auth',
    adminRoute: '/admin',
    dashboardRoute: '/writer-dashboard'
  },
  'null': {
    defaultRoute: '/auth',
    fallbackRoute: '/auth',
    homeRoute: '/auth',
    authRequiredRedirect: '/auth',
    dashboardRoute: '/'
  }
};

/**
 * Get full route configuration for a role
 * @param role User role
 * @returns Complete route configuration
 */
export const getRoleRouteConfig = (role: UserRole): RoleRouteConfig => {
  const roleKey = role || 'null';
  return ROLE_ROUTE_CONFIG[roleKey] || ROLE_ROUTE_CONFIG.null;
};
