
import { NavigationEvent } from './types';
import { getPathDescription } from './routeConfig';
import { trackError } from '@/utils/errorHandling';

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
 * @param userRole - The user's role
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
    // Import here to avoid circular dependency
    const { isValidRoute } = require('./routeValidation/core');
    
    if (isValidRoute(path, userRole)) {
      success = true;
      navigate(path);
    } else {
      success = false;
      failureReason = userRole 
        ? `User with role '${userRole}' does not have permission for ${path}`
        : `Path ${path} is not valid`;
      
      console.error(`Navigation rejected: ${failureReason}`);
      
      // Import toast here to avoid circular dependency
      const { toast } = require('sonner');
      toast.error("Navigation error", {
        description: "You don't have permission to access this page or the page doesn't exist.",
      });
      
      // Navigate to 404 instead
      navigate("/not-found");
    }
  } catch (error: any) {
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
