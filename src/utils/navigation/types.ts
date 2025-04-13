
/**
 * Types for route validation and navigation
 */

/**
 * Valid user roles in the application
 */
export type UserRole = 'admin' | 'designer' | 'writer' | 'editor' | null;

/**
 * Valid route groups
 */
export type RouteGroup = 'dashboard' | 'content' | 'design' | 'admin' | 'user' | 'testing';

/**
 * Configuration for a valid route
 */
export interface RouteConfig {
  path: string;
  description: string;
  requiredRole?: UserRole[];
  params?: string[];
  /** Whether to track additional metrics for this route */
  trackAdvancedMetrics?: boolean;
  /** Mark this route as the default landing page for a specific role */
  defaultForRole?: UserRole[];
  /** Specify a fallback route if this route is inaccessible */
  fallbackRoute?: string;
  /** Route group for organizational purposes */
  group?: RouteGroup;
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

/**
 * Navigation error types
 */
export enum NavigationErrorType {
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  VALIDATION_ERROR = 'validation_error',
}

/**
 * Navigation error
 */
export interface NavigationError {
  type: NavigationErrorType;
  path: string;
  message: string;
  role?: UserRole;
}

/**
 * Role-based route mapping
 */
export interface RoleRouteMap {
  [key: string]: string; // role -> default route
}

/**
 * Route validation error information
 */
export interface RouteValidationError {
  path: string;
  type: string;
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

