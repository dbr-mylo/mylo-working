
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
    // No redirect if no role
    if (!newRole) {
      return false;
    }

    // Check if current path is valid for the new role
    const isValidPath = navigationService.validateRoute(currentPath, newRole);

    // If path is valid, no need to redirect
    if (isValidPath) {
      return false;
    }

    console.info(`Path ${currentPath} is not valid for role ${newRole}, redirect needed`);
    return true;
  }

  /**
   * Get suggested routes for a specific role
   * @param role User role
   * @param count Maximum number of suggestions
   * @returns Array of suggested routes
   */
  public getRoleSuggestedRoutes(role: UserRole | null, count: number = 5): { path: string; description: string }[] {
    if (!role) {
      return [
        { path: "/auth", description: "Authentication" }
      ];
    }

    // Get routes based on role
    switch (role) {
      case "writer":
        return [
          { path: "/writer-dashboard", description: "Writer Dashboard" },
          { path: "/editor", description: "Document Editor" },
          { path: "/content/drafts", description: "Your Drafts" },
          { path: "/documents", description: "All Documents" },
          { path: "/profile", description: "Your Profile" }
        ].slice(0, count);
        
      case "designer":
        return [
          { path: "/designer-dashboard", description: "Designer Dashboard" },
          { path: "/templates", description: "Templates" },
          { path: "/design/layout", description: "Layout Editor" },
          { path: "/design/design-settings", description: "Design Settings" },
          { path: "/profile", description: "Your Profile" }
        ].slice(0, count);
        
      case "admin":
        return [
          { path: "/admin", description: "Admin Dashboard" },
          { path: "/admin/users", description: "User Management" },
          { path: "/admin/system-health", description: "System Health" },
          { path: "/admin/recovery-metrics", description: "Recovery Metrics" },
          { path: "/profile", description: "Your Profile" }
        ].slice(0, count);
        
      default:
        return [
          { path: "/", description: "Dashboard" },
          { path: "/profile", description: "Your Profile" },
          { path: "/settings", description: "Settings" },
          { path: "/help", description: "Help & Support" },
          { path: "/documents", description: "Documents" }
        ].slice(0, count);
    }
  }
}

export const roleTransitionHandler = new RoleTransitionHandler();
