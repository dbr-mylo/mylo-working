
/**
 * Types for route validation and navigation
 */

/**
 * Configuration for a valid route
 */
export interface RouteConfig {
  path: string;
  requiredRole?: string[];
  params?: string[];
  /** Document this route for comprehensive analytics */
  description?: string;
  /** Whether to track additional metrics for this route */
  trackAdvancedMetrics?: boolean;
}

/**
 * Navigation analytics event
 */
export interface NavigationEvent {
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
