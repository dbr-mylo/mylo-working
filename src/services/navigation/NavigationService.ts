
import { 
  UserRole,
  NavigationError, 
  NavigationEvent
} from '@/utils/navigation/types';
import { navigationAnalyticsService } from './core/NavigationAnalyticsService';
import { navigationValidationService } from './core/NavigationValidationService';
import { NavigationErrorHandler } from './errors/NavigationErrorHandler';
import { navigationHistoryService } from './history/NavigationHistoryService';
import { roleTransitionHandler } from './role/RoleTransitionHandler';

export class NavigationService {
  private static instance: NavigationService;
  private errorHandler: NavigationErrorHandler;
  
  constructor() {
    this.errorHandler = new NavigationErrorHandler();
  }
  
  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }
  
  public validateRoute(path: string, role: UserRole): boolean {
    return navigationValidationService.validateRoute(path, role);
  }
  
  public getDefaultRoute(role: UserRole): string {
    return roleTransitionHandler.getRoleSuggestedRoutes(role, 1)[0]?.path || '/';
  }
  
  public getFallbackRoute(role: UserRole): string {
    return this.getDefaultRoute(role);
  }
  
  public logNavigationEvent(
    from: string,
    to: string,
    success: boolean,
    role?: UserRole,
    failureReason?: string
  ): void {
    const now = new Date();
    const startTime = performance.now();
    
    const event: NavigationEvent = {
      from,
      to,
      success,
      timestamp: now.toISOString(),
      userRole: role,
      failureReason,
      analytics: {
        durationMs: Math.round(performance.now() - startTime),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        dayOfWeek: now.getDay(),
        hourOfDay: now.getHours(),
      }
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Navigation: ${from} → ${to} (${success ? 'success' : 'failed'}${failureReason ? `: ${failureReason}` : ''})`
      );
    }
    
    navigationHistoryService.addToHistory(event);
    
    if (role === 'writer') {
      navigationAnalyticsService.logWriterNavigation(event);
    }
  }
  
  public handleNavigationError(error: NavigationError): void {
    this.errorHandler.handleNavigationError(error);
  }
  
  public getNavigationHistory(): NavigationEvent[] {
    return navigationHistoryService.getHistory();
  }
  
  public getRecentNavigationHistory(limit: number = 10): NavigationEvent[] {
    return navigationHistoryService.getRecentHistory(limit);
  }
  
  public clearNavigationHistory(): void {
    navigationHistoryService.clearHistory();
  }
  
  public handleRoleTransition(previousRole: UserRole | null, newRole: UserRole | null): string {
    return roleTransitionHandler.handleRoleTransition(previousRole, newRole);
  }
  
  public needsRedirect(path: string, role: UserRole | null): boolean {
    return roleTransitionHandler.needsRedirectAfterRoleChange(path, role);
  }
  
  public getRoleSuggestedRoutes(role: UserRole | null, count: number = 5): { path: string; description: string }[] {
    return roleTransitionHandler.getRoleSuggestedRoutes(role, count);
  }
  
  public extractRouteParameters(definedPath: string, actualPath: string): Record<string, string> | null {
    return navigationValidationService.extractRouteParameters(definedPath, actualPath);
  }
  
  public getMostFrequentRoutes(limit: number = 5): { path: string; count: number }[] {
    return navigationAnalyticsService.getMostFrequentRoutes(this.getNavigationHistory(), limit);
  }

  public getWriterNavigationMetrics(): Record<string, number> {
    return navigationAnalyticsService.getWriterNavigationMetrics();
  }
}

export const navigationService = NavigationService.getInstance();
