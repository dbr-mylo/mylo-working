
import { 
  UserRole,
  NavigationEvent 
} from '@/utils/navigation/types';
import { 
  getDefaultRouteForRole,
  getFallbackRouteForRole
} from '@/utils/navigation/routeConfig';

/**
 * Navigation Service Core
 * 
 * Core functionality for handling navigation logic
 */
export class NavigationServiceCore {
  private navigationHistory: NavigationEvent[] = [];
  
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
