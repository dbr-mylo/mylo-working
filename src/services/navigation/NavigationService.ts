import { 
  UserRole,
  NavigationError, 
  NavigationErrorType, 
  NavigationEvent 
} from '@/utils/navigation/types';
import { 
  validRoutes,
  getDefaultRouteForRole,
  getFallbackRouteForRole
} from '@/utils/navigation/routeConfig';
import { toast } from 'sonner';

/**
 * Navigation Service
 * 
 * Centralized service for handling all navigation-related logic including
 * route validation, role-based routing, and navigation error handling.
 */
export class NavigationService {
  private static instance: NavigationService;
  private navigationHistory: NavigationEvent[] = [];
  
  /**
   * Get the singleton instance of NavigationService
   */
  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }
  
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
  
  /**
   * Get the default route for a user role
   * @param role User role
   * @returns Default route path
   */
  public getDefaultRoute(role: UserRole): string {
    return getDefaultRouteForRole(role);
  }
  
  /**
   * Get the fallback route for a user role
   * @param role User role
   * @returns Fallback route path
   */
  public getFallbackRoute(role: UserRole): string {
    return getFallbackRouteForRole(role);
  }
  
  /**
   * Log a navigation event
   * @param from Source path
   * @param to Destination path
   * @param success Whether navigation succeeded
   * @param role User role
   * @param failureReason Optional reason for failure
   */
  public logNavigationEvent(
    from: string,
    to: string,
    success: boolean,
    role?: UserRole,
    failureReason?: string
  ): void {
    const event: NavigationEvent = {
      from,
      to,
      success,
      timestamp: new Date().toISOString(),
      userRole: role,
      failureReason
    };
    
    this.navigationHistory.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Navigation: ${from} → ${to} (${success ? 'success' : 'failed'}${failureReason ? `: ${failureReason}` : ''})`
      );
    }
    
    // In production, this would send to analytics service
    // analyticsService.trackNavigation(event);
  }
  
  /**
   * Handle navigation errors
   * @param error Navigation error
   */
  public handleNavigationError(error: NavigationError): void {
    // Log the error
    console.error('Navigation Error:', error);
    
    // Show toast notification with appropriate message
    switch (error.type) {
      case NavigationErrorType.UNAUTHORIZED:
        toast.error("Access Denied", {
          description: "You don't have permission to access this page",
          duration: 3000,
        });
        break;
      
      case NavigationErrorType.NOT_FOUND:
        toast.error("Page Not Found", {
          description: `The page "${error.path}" does not exist`,
          duration: 3000,
        });
        break;
      
      case NavigationErrorType.VALIDATION_ERROR:
        toast.error("Navigation Error", {
          description: error.message || "Invalid navigation request",
          duration: 3000,
        });
        break;
      
      default:
        toast.error("Navigation Error", {
          description: "There was a problem navigating to the requested page",
          duration: 3000,
        });
    }
  }
  
  /**
   * Get navigation history
   * @returns Array of navigation events
   */
  public getNavigationHistory(): NavigationEvent[] {
    return [...this.navigationHistory];
  }
  
  /**
   * Clear navigation history
   */
  public clearNavigationHistory(): void {
    this.navigationHistory = [];
  }
}

// Export a singleton instance
export const navigationService = NavigationService.getInstance();
