
/**
 * Navigation Utility Functions
 * 
 * This module provides helper functions to ensure consistent navigation
 * throughout the application with proper validation and role checking.
 */

import { UserRole } from '@/lib/types';
import { isValidRoute } from './routeValidation/core';
import { validRoutes } from './routeConfig';

/**
 * Gets a list of valid routes for a specific user role
 * @param role User role
 * @returns Array of routes accessible to this role
 */
export const getValidRoutesForRole = (role: UserRole | null): string[] => {
  return validRoutes
    .filter(route => {
      // If no role requirements, anyone can access
      if (!route.requiredRole) {
        return true;
      }
      
      // If role requirements and user has a role, check if allowed
      if (role && route.requiredRole.includes(role)) {
        return true;
      }
      
      return false;
    })
    .map(route => route.path);
};

/**
 * Checks if a path is a valid route for navigation
 * @param path Path to check
 * @param role User role
 * @returns Boolean indicating if the path is valid for the role
 */
export const isValidNavigation = (path: string, role: UserRole | null): boolean => {
  return isValidRoute(path, role);
};

/**
 * Gets a safe fallback route for a role when current route is invalid
 * @param role User role
 * @returns Safe fallback path
 */
export const getSafeFallbackRoute = (role: UserRole | null): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'designer':
      return '/design';
    case 'writer':
    case 'editor':
      return '/editor';
    default:
      return '/';
  }
};
