
import { UserRole, RouteValidationError } from '@/utils/navigation/types';
import { validRoutes } from './routeConfig';

/**
 * Check if a route exists in the application
 * @param path Path to check
 * @returns Boolean indicating if the route exists
 */
export const doesRouteExist = (path: string): boolean => {
  // Direct match
  const exactMatch = validRoutes.some(route => route.path === path);
  if (exactMatch) return true;
  
  // Dynamic route match (with parameters)
  const pathSegments = path.split('/');
  
  return validRoutes.some(route => {
    if (!route.path.includes(':')) return false;
    
    const routeSegments = route.path.split('/');
    if (routeSegments.length !== pathSegments.length) return false;
    
    // Compare each segment, allowing parameters to match anything
    for (let i = 0; i < routeSegments.length; i++) {
      if (routeSegments[i].startsWith(':')) continue; // Parameter matches anything
      if (routeSegments[i] !== pathSegments[i]) return false;
    }
    
    return true;
  });
};

/**
 * Check if a route is accessible for a specific user role
 * @param path Route path
 * @param role User role
 * @returns Boolean indicating if the route is accessible
 */
export const isRouteAccessibleForRole = (path: string, role: UserRole): boolean => {
  // Special case for error pages
  if (path === '/not-found' || path === '/unauthorized' || path === '/error') {
    return true;
  }
  
  // Find matching route
  const route = validRoutes.find(r => {
    // Exact match
    if (r.path === path) return true;
    
    // Dynamic route match
    if (!r.path.includes(':')) return false;
    
    const routeSegments = r.path.split('/');
    const pathSegments = path.split('/');
    
    if (routeSegments.length !== pathSegments.length) return false;
    
    for (let i = 0; i < routeSegments.length; i++) {
      if (routeSegments[i].startsWith(':')) continue;
      if (routeSegments[i] !== pathSegments[i]) return false;
    }
    
    return true;
  });
  
  if (!route) return false;
  
  // Admin can access everything
  if (role === 'admin') return true;
  
  // If the route has role requirements
  if (route.requiredRole && role) {
    return route.requiredRole.includes(role);
  }
  
  // Public routes are accessible to everyone
  if (route.accessLevel === 'public') return true;
  
  // Protected routes require authentication
  return role !== null;
};

/**
 * Generate a validation error for access issues
 * @param path Path that was requested
 * @param role User role
 * @returns Validation error object
 */
export const generateRouteValidationError = (path: string, role: UserRole): RouteValidationError => {
  return {
    path,
    role,
    message: `User with role ${role || 'unauthenticated'} does not have permission to access ${path}`,
    code: 'ROUTE_ACCESS_DENIED',
    timestamp: new Date().toISOString()
  };
};
