
import { 
  UserRole,
  NavigationError, 
  NavigationErrorType,
  NavigationEvent
} from '@/utils/navigation/types';
import { NavigationServiceCore } from './core/NavigationServiceCore';
import { RouteValidator } from './validation/RouteValidator';
import { NavigationErrorHandler } from './errors/NavigationErrorHandler';
import { navigationHistoryService } from './history/NavigationHistoryService';
import { roleTransitionHandler } from './role/RoleTransitionHandler';
import { extractPathParameters } from '@/utils/navigation/routeUtils';

/**
 * Navigation Service
 * 
 * Centralized service for handling all navigation-related logic including
 * route validation, role-based routing, navigation error handling, and history tracking.
 */
export class NavigationService {
  private static instance: NavigationService;
  private core: NavigationServiceCore;
  private validator: RouteValidator;
  private errorHandler: NavigationErrorHandler;
  
  /**
   * Create a new NavigationService instance
   */
  constructor() {
    this.core = new NavigationServiceCore();
    this.validator = new RouteValidator();
    this.errorHandler = new NavigationErrorHandler();
  }
  
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
    return this.validator.validateRoute(path, role);
  }
  
  /**
   * Get the default route for a user role
   * @param role User role
   * @returns Default route path
   */
  public getDefaultRoute(role: UserRole): string {
    return this.core.getDefaultRoute(role);
  }
  
  /**
   * Get the fallback route for a user role
   * @param role User role
   * @returns Fallback route path
   */
  public getFallbackRoute(role: UserRole): string {
    return this.core.getFallbackRoute(role);
  }
  
  /**
   * Log a navigation event and add it to history
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
    // Calculate duration for analytics
    const startTime = performance.now();
    const now = new Date();
    
    // Create navigation event
    const event: NavigationEvent = {
      from,
      to,
      success,
      timestamp: now.toISOString(),
      userRole: role,
      failureReason,
      // Add additional analytics data
      analytics: {
        durationMs: Math.round(performance.now() - startTime),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        dayOfWeek: now.getDay(),
        hourOfDay: now.getHours(),
      }
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Navigation: ${from} → ${to} (${success ? 'success' : 'failed'}${failureReason ? `: ${failureReason}` : ''})`
      );
    }
    
    // Add to history
    navigationHistoryService.addToHistory(event);
    
    // Special handling for writer roles to improve writer-specific analytics
    if (role === 'writer') {
      this.logWriterNavigation(event);
    }
  }
  
  /**
   * Special handling for writer navigation events to track writer-specific flows
   * @param event Navigation event
   */
  private logWriterNavigation(event: NavigationEvent): void {
    // Track writer-specific navigation patterns
    const isContentRelated = event.to.includes('/content/') || 
                               event.to.includes('/editor') || 
                               event.to === '/writer-dashboard';
                               
    if (isContentRelated) {
      // In a real app, this would send to a dedicated analytics service
      console.info(`[Writer Analytics] Content interaction: ${event.to}`);
      
      // You could add specific writer metrics to localStorage for tracking
      if (typeof localStorage !== 'undefined') {
        try {
          // Get existing writer metrics
          const metrics = JSON.parse(localStorage.getItem('writer_navigation_metrics') || '{}');
          
          // Update path count
          metrics[event.to] = (metrics[event.to] || 0) + 1;
          
          // Store back
          localStorage.setItem('writer_navigation_metrics', JSON.stringify(metrics));
        } catch (e) {
          console.error('Error storing writer metrics:', e);
        }
      }
    }
  }
  
  /**
   * Get writer navigation metrics
   * @returns Writer navigation metrics
   */
  public getWriterNavigationMetrics(): Record<string, number> {
    if (typeof localStorage === 'undefined') {
      return {};
    }
    
    try {
      return JSON.parse(localStorage.getItem('writer_navigation_metrics') || '{}');
    } catch (e) {
      console.error('Error retrieving writer metrics:', e);
      return {};
    }
  }
  
  /**
   * Handle navigation errors
   * @param error Navigation error
   */
  public handleNavigationError(error: NavigationError): void {
    this.errorHandler.handleNavigationError(error);
  }
  
  /**
   * Get navigation history
   * @returns Array of navigation events
   */
  public getNavigationHistory(): NavigationEvent[] {
    return navigationHistoryService.getHistory();
  }
  
  /**
   * Get recent navigation history
   * @param limit Maximum number of items to return
   * @returns Array of recent navigation events
   */
  public getRecentNavigationHistory(limit: number = 10): NavigationEvent[] {
    return navigationHistoryService.getRecentHistory(limit);
  }
  
  /**
   * Clear navigation history
   */
  public clearNavigationHistory(): void {
    navigationHistoryService.clearHistory();
  }
  
  /**
   * Handle a role transition and return the appropriate route
   * @param previousRole Previous user role
   * @param newRole New user role
   * @returns The destination route for the new role
   */
  public handleRoleTransition(previousRole: UserRole | null, newRole: UserRole | null): string {
    return roleTransitionHandler.handleRoleTransition(previousRole, newRole);
  }
  
  /**
   * Check if a route needs redirection after role change
   * @param path Current route path
   * @param role User role
   * @returns Boolean indicating if redirection is needed
   */
  public needsRedirect(path: string, role: UserRole | null): boolean {
    return roleTransitionHandler.needsRedirectAfterRoleChange(path, role);
  }
  
  /**
   * Get suggested routes for a specific role
   * @param role User role
   * @param count Maximum number of suggestions
   * @returns Array of suggested routes
   */
  public getRoleSuggestedRoutes(role: UserRole | null, count: number = 5): { path: string; description: string }[] {
    return roleTransitionHandler.getRoleSuggestedRoutes(role, count);
  }
  
  /**
   * Extract parameters from a route path
   * @param definedPath Route path with parameters (e.g., "/user/:id")
   * @param actualPath Actual path with values (e.g., "/user/123")
   * @returns Object with extracted parameters or null if paths don't match
   */
  public extractRouteParameters(definedPath: string, actualPath: string): Record<string, string> | null {
    return extractPathParameters(definedPath, actualPath);
  }
  
  /**
   * Get most frequently visited routes
   * @param limit Maximum number of routes to return
   * @returns Array of routes sorted by visit frequency
   */
  public getMostFrequentRoutes(limit: number = 5): { path: string; count: number }[] {
    return navigationHistoryService.getMostFrequentRoutes(limit);
  }
}

// Export a singleton instance
export const navigationService = NavigationService.getInstance();
