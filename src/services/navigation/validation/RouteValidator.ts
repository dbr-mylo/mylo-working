import { UserRole } from '@/utils/navigation/types';
import { validRoutes } from '@/utils/navigation/routeConfig';

/**
 * Route validation functionality
 */
export class RouteValidator {
  /**
   * Check if a route is valid for a specific role
   * @param path Route path to validate
   * @param role User role
   * @returns Boolean indicating if route is valid
   */
  public validateRoute(path: string, role: UserRole): boolean {
    // Special case for 404 page
    if (path === '/not-found') {
      return true;
    }
    
    // Check for exact route match
    for (const route of validRoutes) {
      if (route.path === path) {
        // If the route has role requirements, check them
        if (route.requiredRole && role) {
          return route.requiredRole.includes(role);
        }
        // No role requirements means anyone can access
        return true;
      }
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
        // If the matched route has role requirements, check them
        if (route.requiredRole && role) {
          return route.requiredRole.includes(role);
        }
        // No role requirements means anyone can access
        return true;
      }
    }
    
    // No match found
    return false;
  }
}
