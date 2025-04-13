
import { UserRole } from '@/utils/navigation/types';
import { navigationService } from '../NavigationService';
import { toast } from "sonner";

/**
 * Service for handling role transitions and related navigation
 */
export class RoleTransitionHandler {
  /**
   * Handle a role transition by redirecting to the appropriate route
   * @param previousRole Previous user role
   * @param newRole New user role
   * @returns The destination route for the new role
   */
  public handleRoleTransition(previousRole: UserRole | null, newRole: UserRole | null): string {
    // Skip if roles are the same
    if (previousRole === newRole) {
      return '';
    }
    
    // Get default route for new role
    const destinationRoute = navigationService.getDefaultRoute(newRole);
    
    // Log the role transition
    console.info(`Role transition: ${previousRole} -> ${newRole}, redirecting to: ${destinationRoute}`);
    
    // Track this as a special navigation event
    navigationService.logNavigationEvent(
      window.location.pathname,
      destinationRoute,
      true,
      newRole,
      `Role transition from ${previousRole} to ${newRole}`
    );
    
    // Show notification about role change
    this.notifyRoleChange(previousRole, newRole);
    
    return destinationRoute;
  }
  
  /**
   * Show a notification about the role change
   * @param previousRole Previous user role
   * @param newRole New user role
   */
  private notifyRoleChange(previousRole: UserRole | null, newRole: UserRole | null): void {
    // Don't notify for initial role assignment
    if (!previousRole && newRole) {
      return;
    }
    
    // Get human-readable role names
    const getRoleName = (role: UserRole | null): string => {
      if (role === null) return 'Logged Out';
      return role.charAt(0).toUpperCase() + role.slice(1);
    };
    
    // Show toast notification
    toast.info(`Role Changed: ${getRoleName(newRole)}`, {
      description: `Your access level has been updated from ${getRoleName(previousRole)} to ${getRoleName(newRole)}`,
      duration: 4000,
    });
  }
  
  /**
   * Check if a user needs to be redirected after a role change
   * @param currentPath Current route path
   * @param newRole New user role
   * @returns Boolean indicating if a redirect is needed
   */
  public needsRedirectAfterRoleChange(currentPath: string, newRole: UserRole | null): boolean {
    // Check if current path is valid for the new role
    return !navigationService.validateRoute(currentPath, newRole);
  }
  
  /**
   * Get suggested routes for a specific role
   * @param role User role
   * @param count Maximum number of suggestions
   * @returns Array of suggested routes
   */
  public getRoleSuggestedRoutes(role: UserRole | null, count: number = 5): { path: string; description: string }[] {
    // This would typically come from a more sophisticated recommendation engine
    // For now, we'll return some static suggestions based on role
    
    if (role === 'writer' || role === 'editor') {
      return [
        { path: '/editor', description: 'Document Editor' },
        { path: '/writer-dashboard', description: 'Writer Dashboard' },
        { path: '/content/drafts', description: 'My Drafts' },
        { path: '/templates', description: 'Templates' },
        { path: '/documents', description: 'All Documents' }
      ].slice(0, count);
    }
    
    if (role === 'designer') {
      return [
        { path: '/designer-dashboard', description: 'Designer Dashboard' },
        { path: '/design/layout', description: 'Layout Editor' },
        { path: '/design/design-settings', description: 'Design Settings' },
        { path: '/templates', description: 'Template Management' }
      ].slice(0, count);
    }
    
    if (role === 'admin') {
      return [
        { path: '/admin', description: 'Admin Dashboard' },
        { path: '/admin/system-health', description: 'System Health' },
        { path: '/admin/recovery-metrics', description: 'Recovery Metrics' },
        { path: '/admin/users', description: 'User Management' }
      ].slice(0, count);
    }
    
    // For unauthenticated users
    return [
      { path: '/auth', description: 'Login' }
    ].slice(0, count);
  }
}

export const roleTransitionHandler = new RoleTransitionHandler();
