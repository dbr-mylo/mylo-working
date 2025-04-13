
import { 
  UserRole,
  NavigationError, 
  NavigationErrorType
} from '@/utils/navigation/types';
import { NavigationServiceCore } from './core/NavigationServiceCore';
import { RouteValidator } from './validation/RouteValidator';
import { NavigationErrorHandler } from './errors/NavigationErrorHandler';
import { NavigationEvent } from '@/utils/navigation/types';

/**
 * Navigation Service
 * 
 * Centralized service for handling all navigation-related logic including
 * route validation, role-based routing, and navigation error handling.
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
    this.core.logNavigationEvent(from, to, success, role, failureReason);
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
    return this.core.getNavigationHistory();
  }
  
  /**
   * Clear navigation history
   */
  public clearNavigationHistory(): void {
    this.core.clearNavigationHistory();
  }
}

// Export a singleton instance
export const navigationService = NavigationService.getInstance();
