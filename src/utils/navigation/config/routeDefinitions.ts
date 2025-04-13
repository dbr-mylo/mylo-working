
import { RouteConfig } from '../types';
import { routeGroups } from './routeGroups';

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
