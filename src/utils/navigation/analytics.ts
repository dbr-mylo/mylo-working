
import { NavigationEvent } from './types';
import { getPathDescription } from './routeConfig';

// Store navigation events for analytics
const navigationEvents: NavigationEvent[] = [];

/**
 * Log a navigation event for analytics
 * @param from From path
 * @param to To path
 * @param success Whether navigation was allowed
 * @param userRole User role if available
 * @param failureReason Optional reason if navigation failed
 */
export const logNavigation = (
  from: string,
  to: string,
  success: boolean,
  userRole?: string | null,
  failureReason?: string
): void => {
  const event: NavigationEvent = {
    from,
    to,
    success,
    timestamp: new Date().toISOString(),
    userRole,
    pathDescription: getPathDescription(to),
    failureReason
  };
  
  navigationEvents.push(event);
  logNavigationEvent(event);
};

/**
 * Log a navigation event to console or analytics service
 * @param event Navigation event to log
 */
export const logNavigationEvent = (event: NavigationEvent): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Navigation: ${event.from} -> ${event.to} (${event.success ? 'success' : 'failed'})`);
    if (!event.success && event.failureReason) {
      console.warn(`Navigation failed: ${event.failureReason}`);
    }
  }
  
  // In production, this would send data to an analytics service
  // analyticsService.trackNavigation(event);
};

/**
 * Get all recorded navigation events
 * @returns Array of navigation events
 */
export const getNavigationEvents = (): NavigationEvent[] => {
  return [...navigationEvents];
};

/**
 * Navigate with validation, ensuring the user can access the route
 * This is used by the useRouteValidation hook
 */
export const navigateWithValidation = (
  path: string,
  validateFn: (path: string) => boolean,
  navigateFn: (path: string, options?: any) => void,
  onInvalidPath?: (path: string) => void
): boolean => {
  if (validateFn(path)) {
    navigateFn(path);
    return true;
  } else {
    if (onInvalidPath) {
      onInvalidPath(path);
    }
    return false;
  }
};
