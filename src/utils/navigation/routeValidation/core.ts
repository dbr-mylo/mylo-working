
import { validRoutes } from '../routeConfig';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole } from '@/lib/types';

/**
 * Validates if a route is valid for the application
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if the route is valid
 */
export const isValidRoute = (path: string, userRole?: string | null): boolean => {
  return navigationService.validateRoute(path, userRole as UserRole);
};

/**
 * Check if a route is a testing route
 * @param path - The path to check
 * @returns Boolean indicating if the route is a testing route
 */
export const isTestingRoute = (path: string): boolean => {
  return path.startsWith('/testing/');
};

/**
 * Check if the current environment is development
 * @returns Boolean indicating if the environment is development
 */
export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Special validation for testing routes
 * In development, we allow access to testing routes for easier debugging
 * In production, we enforce role-based access
 * 
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if access is allowed
 */
export const canAccessTestingRoute = (path: string, userRole?: string | null): boolean => {
  // Always allow in development for easier debugging
  if (isDevelopmentEnvironment()) {
    return true;
  }
  
  // In production, enforce role-based access (admin only by default)
  return isValidRoute(path, userRole);
};
