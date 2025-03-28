import { toast } from "sonner";

interface RouteConfig {
  path: string;
  requiredRole?: string[];
  params?: string[];
}

// Define all valid routes in the application
const validRoutes: RouteConfig[] = [
  { path: "/" },
  { path: "/auth" },
  { path: "/editor", requiredRole: ["writer", "designer", "admin"] },
  { path: "/editor/:documentId", requiredRole: ["writer", "designer", "admin"], params: ["documentId"] },
  { path: "/design", requiredRole: ["designer", "admin"] },
  { path: "/design/layout", requiredRole: ["designer", "admin"] },
  { path: "/design/design-settings", requiredRole: ["designer", "admin"] },
  { path: "/design/templates", requiredRole: ["designer", "admin"] },
  { path: "/content", requiredRole: ["writer", "admin"] },
  { path: "/content/documents", requiredRole: ["writer", "admin"] },
  { path: "/content/drafts", requiredRole: ["writer", "admin"] },
  { path: "/templates", requiredRole: ["designer", "admin"] },
  { path: "/admin", requiredRole: ["admin"] },
  { path: "/testing/regression" },
];

/**
 * Validates if a route is valid for the application
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if the route is valid
 */
export const isValidRoute = (path: string, userRole?: string | null): boolean => {
  // Check if path matches any of the valid routes
  for (const route of validRoutes) {
    // Handle exact matches
    if (route.path === path) {
      // Check role requirements if specified
      if (route.requiredRole && userRole) {
        return route.requiredRole.includes(userRole);
      }
      return true;
    }
    
    // Handle routes with parameters
    if (route.path.includes(':') && route.params) {
      const routeParts = route.path.split('/');
      const pathParts = path.split('/');
      
      // Different length means it's not matching this route pattern
      if (routeParts.length !== pathParts.length) continue;
      
      let isMatch = true;
      for (let i = 0; i < routeParts.length; i++) {
        // If this part is a parameter, it matches anything
        if (routeParts[i].startsWith(':')) continue;
        // Otherwise, it must match exactly
        if (routeParts[i] !== pathParts[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        // Check role requirements if specified
        if (route.requiredRole && userRole) {
          return route.requiredRole.includes(userRole);
        }
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Navigate to a route with validation
 * @param navigate - React Router navigate function
 * @param path - Path to navigate to
 * @param userRole - Current user's role
 */
export const navigateWithValidation = (
  navigate: (path: string) => void, 
  path: string, 
  userRole?: string | null
): void => {
  if (isValidRoute(path, userRole)) {
    navigate(path);
  } else {
    console.error(`Navigation rejected: Invalid route or insufficient permissions for ${path}`);
    toast.error("Navigation error", {
      description: "You don't have permission to access this page or the page doesn't exist.",
    });
    // Navigate to 404 instead
    navigate("/not-found");
  }
};

/**
 * Logs navigation for analytics and debugging
 * @param from - Starting path
 * @param to - Destination path
 * @param success - Whether navigation was successful
 */
export const logNavigation = (from: string, to: string, success: boolean): void => {
  console.log(`Navigation: ${from} → ${to} | Success: ${success}`);
  
  // This is where you would integrate with an analytics service
  // analytics.logEvent('navigation', { from, to, success });
  
  if (!success) {
    console.error(`Failed navigation attempt from ${from} to ${to}`);
  }
};
