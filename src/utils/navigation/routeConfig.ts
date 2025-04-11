
import { RouteConfig } from './types';

// Define all valid routes in the application
export const validRoutes: RouteConfig[] = [
  { path: "/", description: "Home page" },
  { path: "/auth", description: "Authentication page" },
  { path: "/editor", requiredRole: ["writer", "designer", "admin"], description: "Document editor" },
  { path: "/editor/:documentId", requiredRole: ["writer", "designer", "admin"], params: ["documentId"], description: "Edit specific document" },
  { path: "/design", requiredRole: ["designer", "admin"], description: "Design hub" },
  { path: "/design/layout", requiredRole: ["designer", "admin"], description: "Layout designer" },
  { path: "/design/design-settings", requiredRole: ["designer", "admin"], description: "Design settings" },
  { path: "/design/templates", requiredRole: ["designer", "admin"], description: "Template management" },
  { path: "/content", requiredRole: ["writer", "admin"], description: "Content management" },
  { path: "/content/documents", requiredRole: ["writer", "admin"], description: "Document list" },
  { path: "/content/drafts", requiredRole: ["writer", "admin"], description: "Draft documents" },
  { path: "/templates", requiredRole: ["designer", "admin"], description: "Template library" },
  { path: "/profile", description: "User profile page" },
  { path: "/settings", description: "Application settings" },
  { path: "/help", description: "Help and support" },
  { path: "/admin", requiredRole: ["admin"], description: "Admin panel" },
  { path: "/admin/system-health", requiredRole: ["admin"], description: "System health monitoring", trackAdvancedMetrics: true },
  { path: "/admin/recovery-metrics", requiredRole: ["admin"], description: "Error recovery metrics", trackAdvancedMetrics: true },
  { path: "/admin/users", requiredRole: ["admin"], description: "User management" },
  { path: "/admin/security", requiredRole: ["admin"], description: "Security settings" },
  { path: "/admin/settings", requiredRole: ["admin"], description: "Admin settings" },
  { path: "/testing/regression", description: "Regression test suite" },
  { path: "/testing/smoke", requiredRole: ["admin"], description: "Smoke tests", trackAdvancedMetrics: true },
];

/**
 * Get path description if available
 * @param path Path to get description for
 * @returns Description or undefined if not found
 */
export const getPathDescription = (path: string): string | undefined => {
  const route = validRoutes.find(r => r.path === path);
  return route?.description;
};
