
import { RouteConfig, UserRole, RoleRouteMap } from './types';

/**
 * Route groups for better organization
 * Each key represents a group of related routes
 */
export const routeGroups = {
  DASHBOARD: 'dashboard',
  CONTENT: 'content',
  DESIGN: 'design',
  ADMIN: 'admin',
  USER: 'user',
  TESTING: 'testing',
};

/**
 * Define all valid routes in the application with enhanced metadata
 */
export const validRoutes: RouteConfig[] = [
  // Dashboard routes
  { 
    path: "/", 
    description: "Main dashboard", 
    group: routeGroups.DASHBOARD,
    defaultForRole: ['writer', 'editor']
  },
  {
    path: "/dashboard",
    description: "Dashboard redirect",
    fallbackRoute: "/",
    group: routeGroups.DASHBOARD
  },
  
  // Authentication routes
  { 
    path: "/auth", 
    description: "Authentication page", 
    group: routeGroups.USER
  },
  
  // Editor routes
  { 
    path: "/editor", 
    requiredRole: ["writer", "designer", "admin"], 
    description: "Document editor",
    group: routeGroups.CONTENT
  },
  { 
    path: "/editor/:documentId", 
    requiredRole: ["writer", "designer", "admin"], 
    params: ["documentId"], 
    description: "Edit specific document",
    group: routeGroups.CONTENT
  },
  
  // Designer routes
  { 
    path: "/design", 
    requiredRole: ["designer", "admin"], 
    description: "Design hub",
    defaultForRole: ["designer"],
    group: routeGroups.DESIGN
  },
  { 
    path: "/design/layout", 
    requiredRole: ["designer", "admin"], 
    description: "Layout designer",
    group: routeGroups.DESIGN
  },
  { 
    path: "/design/design-settings", 
    requiredRole: ["designer", "admin"], 
    description: "Design settings",
    group: routeGroups.DESIGN
  },
  { 
    path: "/design/templates", 
    requiredRole: ["designer", "admin"], 
    description: "Template management",
    group: routeGroups.DESIGN
  },
  
  // Content management routes
  { 
    path: "/content", 
    requiredRole: ["writer", "admin"], 
    description: "Content management",
    group: routeGroups.CONTENT
  },
  { 
    path: "/content/documents", 
    requiredRole: ["writer", "admin"], 
    description: "Document list",
    group: routeGroups.CONTENT
  },
  { 
    path: "/content/drafts", 
    requiredRole: ["writer", "admin"], 
    description: "Draft documents",
    group: routeGroups.CONTENT
  },
  
  // Template routes
  { 
    path: "/templates", 
    requiredRole: ["designer", "admin"], 
    description: "Template library",
    group: routeGroups.DESIGN
  },
  
  // User routes
  { 
    path: "/profile", 
    description: "User profile page",
    group: routeGroups.USER
  },
  { 
    path: "/settings", 
    description: "Application settings",
    group: routeGroups.USER
  },
  { 
    path: "/help", 
    description: "Help and support",
    group: routeGroups.USER
  },
  
  // Admin routes
  { 
    path: "/admin", 
    requiredRole: ["admin"], 
    description: "Admin panel",
    defaultForRole: ["admin"],
    group: routeGroups.ADMIN
  },
  { 
    path: "/admin/system-health", 
    requiredRole: ["admin"], 
    description: "System health monitoring", 
    trackAdvancedMetrics: true,
    group: routeGroups.ADMIN
  },
  { 
    path: "/admin/recovery-metrics", 
    requiredRole: ["admin"], 
    description: "Error recovery metrics", 
    trackAdvancedMetrics: true,
    group: routeGroups.ADMIN
  },
  { 
    path: "/admin/users", 
    requiredRole: ["admin"], 
    description: "User management",
    group: routeGroups.ADMIN
  },
  { 
    path: "/admin/security", 
    requiredRole: ["admin"], 
    description: "Security settings",
    group: routeGroups.ADMIN
  },
  { 
    path: "/admin/settings", 
    requiredRole: ["admin"], 
    description: "Admin settings",
    group: routeGroups.ADMIN
  },
  
  // Testing routes
  { 
    path: "/testing/regression", 
    description: "Regression test suite",
    group: routeGroups.TESTING
  },
  { 
    path: "/testing/smoke", 
    requiredRole: ["admin"], 
    description: "Smoke tests", 
    trackAdvancedMetrics: true,
    group: routeGroups.TESTING
  },
  
  // Error routes
  {
    path: "/not-found",
    description: "404 Page not found",
    group: routeGroups.USER
  }
];

/**
 * Default routes for each role
 * These are the routes users are directed to after login or when accessing the root URL
 */
export const DEFAULT_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/design',
  'writer': '/',
  'editor': '/',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Fallback routes for each role
 * These are the routes users are directed to when their requested route is invalid
 */
export const FALLBACK_ROUTES: RoleRouteMap = {
  'admin': '/admin',
  'designer': '/design',
  'writer': '/',
  'editor': '/',
  'null': '/auth'  // For unauthenticated users
};

/**
 * Get the default route for a specific user role
 * @param role User role
 * @returns The default route for the role
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  return DEFAULT_ROUTES[String(role)] || '/';
};

/**
 * Get the fallback route for a specific user role
 * @param role User role
 * @returns The fallback route for the role
 */
export const getFallbackRouteForRole = (role: UserRole): string => {
  return FALLBACK_ROUTES[String(role)] || '/not-found';
};

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
export const getRoutesByGroup = (group?: string): RouteConfig[] => {
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

