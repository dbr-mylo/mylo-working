
import { RouteConfig, UserRole, AccessLevel, RoutePermission, RouteGroup } from '../types';
import { validRoutes } from './routeDefinitions';

/**
 * Get path description if available
 * @param path Path to get description for
 * @returns Description or undefined if not found
 */
export const getPathDescription = (path: string): string | undefined => {
  const route = validRoutes.find(r => r.path === path);
  return route?.description;
};

/**
 * Get routes grouped by category
 * @param group Optional group to filter by
 * @returns Routes organized by group
 */
export const getRoutesByGroup = (group?: RouteGroup): RouteConfig[] => {
  return group 
    ? validRoutes.filter(route => route.group === group)
    : validRoutes;
};

/**
 * Get all routes available for a specific role
 * @param role User role
 * @returns Array of routes available to the role
 */
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return validRoutes.filter(route => {
    // If no role requirements, anyone can access
    if (!route.requiredRole) {
      return true;
    }
    
    // If role requirements and user has a role, check if allowed
    if (role && route.requiredRole.includes(role)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Get navigation menu items for a role
 * @param role User role
 * @returns Array of routes suitable for navigation display
 */
export const getNavigationRoutesForRole = (role: UserRole): RouteConfig[] => {
  return getRoutesForRole(role).filter(route => 
    route.metadata && route.metadata.showInNavigation === true
  );
};

/**
 * Get sidebar navigation items for a parent route
 * @param parentPath The parent route path
 * @param role User role
 * @returns Array of child routes for the sidebar
 */
export const getSidebarRoutesForParent = (parentPath: string, role: UserRole): RouteConfig[] => {
  const availableRoutes = getRoutesForRole(role);
  
  return availableRoutes.filter(route => 
    route.metadata && 
    route.metadata.showInSidebar === true && 
    route.metadata.parentPath === parentPath
  );
};

/**
 * Generate a complete role permission matrix for all routes
 * @returns Array of route permissions with role access details
 */
export const generateRolePermissionMatrix = (): RoutePermission[] => {
  const allRoles: UserRole[] = ['admin', 'designer', 'writer', 'editor', null];
  
  return validRoutes.map(route => {
    const roles: Record<UserRole, boolean> = {} as Record<UserRole, boolean>;
    
    allRoles.forEach(role => {
      if (role === null) {
        // Null role (unauthenticated) can only access public routes
        roles[role] = route.accessLevel === 'public';
        return;
      }
      
      // Admin has access to everything
      if (role === 'admin') {
        roles[role] = true;
        return;
      }
      
      // Check if this role can access this route
      if (!route.requiredRole) {
        // No requirements means anyone can access
        roles[role] = true;
      } else {
        roles[role] = route.requiredRole.includes(role);
      }
    });
    
    return {
      path: route.path,
      roles,
      accessLevel: route.accessLevel || 'protected'
    };
  });
};

/**
 * Check if a route has trackable metrics
 * @param path Route path
 * @returns Boolean indicating if the route should have advanced tracking
 */
export const shouldTrackAdvancedMetrics = (path: string): boolean => {
  const route = validRoutes.find(r => r.path === path);
  return route?.trackAdvancedMetrics === true;
};

/**
 * Get a route's importance level for monitoring and analytics
 * @param path Route path
 * @returns Importance level or undefined if not specified
 */
export const getRouteImportance = (path: string): string | undefined => {
  const route = validRoutes.find(r => r.path === path);
  return route?.importance;
};

/**
 * Check if a route is an error page
 * @param path Route path
 * @returns Boolean indicating if the route is an error page
 */
export const isErrorRoute = (path: string): boolean => {
  const route = validRoutes.find(r => r.path === path);
  return route?.metadata?.isErrorPage === true;
};

/**
 * Find parent route for a given path
 * @param path Child route path
 * @returns Parent route or undefined
 */
export const getParentRoute = (path: string): RouteConfig | undefined => {
  const route = validRoutes.find(r => r.path === path);
  if (!route?.metadata?.parentPath) return undefined;
  
  return validRoutes.find(r => r.path === route.metadata.parentPath);
};

/**
 * Get all child routes for a given path
 * @param parentPath Parent route path
 * @returns Array of child routes
 */
export const getChildRoutes = (parentPath: string): RouteConfig[] => {
  return validRoutes.filter(route => 
    route.metadata && route.metadata.parentPath === parentPath
  );
};

/**
 * Get routes by access level
 * @param accessLevel The access level to filter by
 * @returns Array of routes with the specified access level
 */
export const getRoutesByAccessLevel = (accessLevel: AccessLevel): RouteConfig[] => {
  return validRoutes.filter(route => route.accessLevel === accessLevel);
};

/**
 * Get a complete route by path
 * @param path Route path
 * @returns Full route configuration or undefined if not found
 */
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return validRoutes.find(route => route.path === path);
};
