
import { toast } from "sonner";
import { trackError } from "@/utils/errorHandling";

interface RouteConfig {
  path: string;
  requiredRole?: string[];
  params?: string[];
  /** Document this route for comprehensive analytics */
  description?: string;
  /** Whether to track additional metrics for this route */
  trackAdvancedMetrics?: boolean;
}

// Define all valid routes in the application
const validRoutes: RouteConfig[] = [
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
 * Navigation analytics event
 */
interface NavigationEvent {
  /** From path */
  from: string;
  /** To path */
  to: string;
  /** Whether navigation was allowed */
  success: boolean;
  /** Timestamp of the event */
  timestamp: string;
  /** User role if available */
  userRole?: string | null;
  /** Path description from route config */
  pathDescription?: string;
  /** Information about why navigation failed if applicable */
  failureReason?: string;
}

/** In-memory store of recent navigation events */
const navigationEvents: NavigationEvent[] = [];

/** Max number of navigation events to store */
const MAX_NAVIGATION_EVENTS = 100;

/**
 * Get all navigation events
 * @returns Array of navigation events
 */
export const getNavigationEvents = (): NavigationEvent[] => {
  return [...navigationEvents];
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
  let success = false;
  let failureReason: string | undefined;
  
  try {
    if (isValidRoute(path, userRole)) {
      success = true;
      navigate(path);
    } else {
      success = false;
      failureReason = userRole 
        ? `User with role '${userRole}' does not have permission for ${path}`
        : `Path ${path} is not valid`;
      
      console.error(`Navigation rejected: ${failureReason}`);
      
      toast.error("Navigation error", {
        description: "You don't have permission to access this page or the page doesn't exist.",
      });
      
      // Navigate to 404 instead
      navigate("/not-found");
    }
  } catch (error) {
    success = false;
    failureReason = `Exception during navigation: ${error instanceof Error ? error.message : 'Unknown error'}`;
    trackError(error, "navigateWithValidation");
    
    // Try to navigate to 404 in case of error
    try {
      navigate("/not-found");
    } catch (e) {
      console.error("Failed to navigate to 404 page after error:", e);
    }
  }
  
  // Analytics tracking
  logNavigationEvent({
    from: "unknown", // We don't know where we came from in this function
    to: path,
    success,
    timestamp: new Date().toISOString(),
    userRole,
    failureReason,
    pathDescription: getPathDescription(path)
  });
};

/**
 * Store a navigation event in memory and potentially send to analytics
 * @param event Navigation event to log
 */
export const logNavigationEvent = (event: NavigationEvent): void => {
  // Add to in-memory store with size limit
  navigationEvents.unshift(event);
  if (navigationEvents.length > MAX_NAVIGATION_EVENTS) {
    navigationEvents.pop();
  }
  
  // This would typically send to an analytics service in production
  // analytics.track('navigation', event);
};

/**
 * Logs navigation for analytics and debugging
 * @param from - Starting path
 * @param to - Destination path
 * @param success - Whether navigation was successful
 */
export const logNavigation = (from: string, to: string, success: boolean, userRole?: string | null): void => {
  console.info(`Navigation: ${from} → ${to} | Success: ${success}`);
  
  // Store the event
  const event: NavigationEvent = {
    from,
    to,
    success,
    timestamp: new Date().toISOString(),
    userRole,
    pathDescription: getPathDescription(to)
  };
  
  logNavigationEvent(event);
  
  if (!success) {
    console.error(`Failed navigation attempt from ${from} to ${to}`);
  }
  
  // Check for unusual patterns - this would be more advanced in production
  if (to === from) {
    console.info("[Analytics] Navigation to the same page detected");
  }
  
  // Check for rapid navigations which might indicate a problem
  const recentEvents = navigationEvents.slice(0, 5);
  if (recentEvents.length >= 3) {
    const last3Timestamps = recentEvents.slice(0, 3).map(e => new Date(e.timestamp).getTime());
    if (Math.max(...last3Timestamps) - Math.min(...last3Timestamps) < 1000) {
      console.warn("[Analytics] Rapid navigation detected - possible UI issue or user confusion");
    }
  }
};

/**
 * Check if a route is a testing route
 * @param path - The path to check
 * @returns Boolean indicating if the route is a testing route
 */
export const isTestingRoute = (path: string): boolean => {
  return path.startsWith('/testing/');
};

/**
 * Check if the current environment is development
 * @returns Boolean indicating if the environment is development
 */
export const isDevelopmentEnvironment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Special validation for testing routes
 * In development, we allow access to testing routes for easier debugging
 * In production, we enforce role-based access
 * 
 * @param path - The path to validate
 * @param userRole - The current user's role
 * @returns Boolean indicating if access is allowed
 */
export const canAccessTestingRoute = (path: string, userRole?: string | null): boolean => {
  // Always allow in development for easier debugging
  if (isDevelopmentEnvironment()) {
    // Still log access for analytics even in development
    logNavigationEvent({
      from: "unknown",
      to: path,
      success: true,
      timestamp: new Date().toISOString(),
      userRole,
      pathDescription: "Testing route (dev environment)",
    });
    return true;
  }
  
  // In production, enforce role-based access (admin only by default)
  return isValidRoute(path, userRole);
};

/**
 * Get performance metrics for routes
 * Used for monitoring navigation performance
 */
export const getRoutePerformanceMetrics = () => {
  // This would be populated with actual metrics in a production app
  const routeMetrics = validRoutes.reduce((acc, route) => {
    if (route.trackAdvancedMetrics) {
      acc[route.path] = {
        averageLoadTime: Math.floor(Math.random() * 300 + 100), // Placeholder data
        errorRate: Math.random() * 0.05, // Placeholder data
        trafficVolume: Math.floor(Math.random() * 100), // Placeholder data
      };
    }
    return acc;
  }, {} as Record<string, { averageLoadTime: number, errorRate: number, trafficVolume: number }>);
  
  return routeMetrics;
};

/**
 * Get navigation patterns for a specific user role
 * Used for analytics and UX improvements
 */
export const getRoleNavigationPatterns = (role?: string | null) => {
  if (!role) return [];
  
  // Filter events to only include those for the specified role
  const roleEvents = navigationEvents.filter(e => e.userRole === role && e.success);
  
  // Calculate common paths
  const pathCounts: Record<string, number> = {};
  roleEvents.forEach(event => {
    pathCounts[event.to] = (pathCounts[event.to] || 0) + 1;
  });
  
  // Calculate common transitions (from -> to)
  const transitionCounts: Record<string, number> = {};
  roleEvents.forEach(event => {
    const transition = `${event.from} -> ${event.to}`;
    transitionCounts[transition] = (transitionCounts[transition] || 0) + 1;
  });
  
  // Return the most common paths and transitions
  return {
    commonPaths: Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count })),
    commonTransitions: Object.entries(transitionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([transition, count]) => ({ transition, count }))
  };
};
