
import { RouteConfig, AccessLevel } from '../types';
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
    defaultForRole: ['writer', 'editor'],
    accessLevel: 'protected',
    importance: 'critical',
    metadata: {
      showInNavigation: true,
      icon: 'dashboard'
    }
  },
  {
    path: "/dashboard",
    description: "Dashboard redirect",
    fallbackRoute: "/",
    group: routeGroups.DASHBOARD,
    accessLevel: 'protected',
    metadata: {
      isRedirect: true
    }
  },
  
  // Writer-specific dashboard routes
  {
    path: "/writer-dashboard",
    description: "Writer workspace dashboard",
    requiredRole: ["writer", "editor"],
    group: routeGroups.DASHBOARD,
    defaultForRole: ["writer", "editor"],
    accessLevel: 'role-specific',
    importance: 'high',
    metadata: {
      showInNavigation: true,
      icon: 'edit-document'
    }
  },
  {
    path: "/writer-dashboard/recent",
    description: "Recently edited documents",
    requiredRole: ["writer", "editor"],
    group: routeGroups.DASHBOARD,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/writer-dashboard"
    }
  },
  {
    path: "/writer-dashboard/assigned",
    description: "Documents assigned to writer",
    requiredRole: ["writer", "editor"],
    group: routeGroups.DASHBOARD,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/writer-dashboard"
    }
  },
  
  // Designer-specific dashboard routes
  {
    path: "/designer-dashboard",
    description: "Designer workspace dashboard",
    requiredRole: ["designer"],
    group: routeGroups.DASHBOARD,
    defaultForRole: ["designer"],
    accessLevel: 'role-specific',
    importance: 'high',
    metadata: {
      showInNavigation: true,
      icon: 'palette'
    }
  },
  {
    path: "/designer-dashboard/templates",
    description: "Template management dashboard",
    requiredRole: ["designer"],
    group: routeGroups.DASHBOARD,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/designer-dashboard"
    }
  },
  {
    path: "/designer-dashboard/styles",
    description: "Style management dashboard",
    requiredRole: ["designer"],
    group: routeGroups.DASHBOARD,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/designer-dashboard"
    }
  },
  
  // Authentication routes
  { 
    path: "/auth", 
    description: "Authentication page", 
    group: routeGroups.USER,
    accessLevel: 'public',
    importance: 'critical',
    metadata: {
      requiresAuth: false,
      isAuthEntry: true,
      showInNavigation: false
    }
  },
  
  // Editor routes
  { 
    path: "/editor", 
    requiredRole: ["writer", "designer", "admin"], 
    description: "Document editor",
    group: routeGroups.CONTENT,
    accessLevel: 'protected',
    importance: 'high',
    metadata: {
      showInNavigation: true,
      icon: 'edit'
    }
  },
  { 
    path: "/editor/:documentId", 
    requiredRole: ["writer", "designer", "admin"], 
    params: ["documentId"], 
    description: "Edit specific document",
    group: routeGroups.CONTENT,
    accessLevel: 'protected',
    importance: 'high',
    metadata: {
      dynamicRoute: true
    }
  },
  
  // Designer routes
  { 
    path: "/design", 
    requiredRole: ["designer", "admin"], 
    description: "Design hub",
    defaultForRole: ["designer"],
    group: routeGroups.DESIGN,
    accessLevel: 'role-specific',
    importance: 'high',
    metadata: {
      showInNavigation: true,
      icon: 'design'
    }
  },
  { 
    path: "/design/layout", 
    requiredRole: ["designer", "admin"], 
    description: "Layout designer",
    group: routeGroups.DESIGN,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/design"
    }
  },
  { 
    path: "/design/design-settings", 
    requiredRole: ["designer", "admin"], 
    description: "Design settings",
    group: routeGroups.DESIGN,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/design" 
    }
  },
  { 
    path: "/design/templates", 
    requiredRole: ["designer", "admin"], 
    description: "Template management",
    group: routeGroups.DESIGN,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/design"
    }
  },
  
  // Content management routes
  { 
    path: "/content", 
    requiredRole: ["writer", "admin"], 
    description: "Content management",
    group: routeGroups.CONTENT,
    accessLevel: 'role-specific',
    importance: 'medium',
    metadata: {
      showInNavigation: true,
      icon: 'documents'
    }
  },
  { 
    path: "/content/documents", 
    requiredRole: ["writer", "admin"], 
    description: "Document list",
    group: routeGroups.CONTENT,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/content"
    }
  },
  { 
    path: "/content/drafts", 
    requiredRole: ["writer", "admin"], 
    description: "Draft documents",
    group: routeGroups.CONTENT,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/content"
    }
  },
  {
    path: "/content/archive",
    requiredRole: ["writer", "admin"],
    description: "Archived content",
    group: routeGroups.CONTENT,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/content"
    }
  },
  {
    path: "/content/workflow",
    requiredRole: ["writer", "admin"],
    description: "Content workflow",
    group: routeGroups.CONTENT,
    accessLevel: 'role-specific',
    metadata: {
      showInSidebar: true,
      parentPath: "/content"
    }
  },
  
  // Template routes
  { 
    path: "/templates", 
    requiredRole: ["designer", "admin"], 
    description: "Template library",
    group: routeGroups.DESIGN,
    accessLevel: 'role-specific',
    importance: 'medium',
    metadata: {
      showInNavigation: true,
      icon: 'template'
    }
  },
  
  // User routes
  { 
    path: "/profile", 
    description: "User profile page",
    group: routeGroups.USER,
    accessLevel: 'protected',
    importance: 'medium',
    metadata: {
      showInNavigation: true,
      icon: 'user'
    }
  },
  { 
    path: "/settings", 
    description: "Application settings",
    group: routeGroups.USER,
    accessLevel: 'protected',
    metadata: {
      showInNavigation: true,
      icon: 'settings'
    }
  },
  { 
    path: "/help", 
    description: "Help and support",
    group: routeGroups.USER,
    accessLevel: 'public',
    metadata: {
      showInNavigation: true,
      icon: 'help'
    }
  },
  
  // Admin routes
  { 
    path: "/admin", 
    requiredRole: ["admin"], 
    description: "Admin panel",
    defaultForRole: ["admin"],
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    importance: 'critical',
    metadata: {
      showInNavigation: true,
      icon: 'admin'
    }
  },
  { 
    path: "/admin/system-health", 
    requiredRole: ["admin"], 
    description: "System health monitoring", 
    trackAdvancedMetrics: true,
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  { 
    path: "/admin/recovery-metrics", 
    requiredRole: ["admin"], 
    description: "Error recovery metrics", 
    trackAdvancedMetrics: true,
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  { 
    path: "/admin/users", 
    requiredRole: ["admin"], 
    description: "User management",
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  { 
    path: "/admin/security", 
    requiredRole: ["admin"], 
    description: "Security settings",
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  { 
    path: "/admin/settings", 
    requiredRole: ["admin"], 
    description: "Admin settings",
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  {
    path: "/admin/logs", 
    requiredRole: ["admin"], 
    description: "System logs viewer",
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    trackAdvancedMetrics: true,
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  {
    path: "/admin/analytics", 
    requiredRole: ["admin"], 
    description: "Usage analytics",
    group: routeGroups.ADMIN,
    accessLevel: 'admin-only',
    trackAdvancedMetrics: true,
    metadata: {
      showInSidebar: true,
      parentPath: "/admin"
    }
  },
  
  // Testing routes
  { 
    path: "/testing/regression", 
    description: "Regression test suite",
    group: routeGroups.TESTING,
    accessLevel: 'protected',
    metadata: {
      showInNavigation: false
    }
  },
  { 
    path: "/testing/smoke", 
    requiredRole: ["admin"], 
    description: "Smoke tests", 
    trackAdvancedMetrics: true,
    group: routeGroups.TESTING,
    accessLevel: 'admin-only',
    metadata: {
      showInNavigation: false
    }
  },
  
  // Error routes
  {
    path: "/not-found",
    description: "404 Page not found",
    group: routeGroups.USER,
    accessLevel: 'public',
    metadata: {
      showInNavigation: false,
      isErrorPage: true
    }
  },
  {
    path: "/unauthorized",
    description: "401 Unauthorized access",
    group: routeGroups.USER,
    accessLevel: 'public',
    metadata: {
      showInNavigation: false,
      isErrorPage: true
    }
  },
  {
    path: "/error",
    description: "Generic error page",
    group: routeGroups.USER,
    accessLevel: 'public',
    metadata: {
      showInNavigation: false,
      isErrorPage: true
    }
  }
];
