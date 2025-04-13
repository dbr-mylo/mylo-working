
import { routeGroups, type RouteGroupType } from './config/routeGroups';

/**
 * User role
 */
export type UserRole = 'admin' | 'designer' | 'writer' | null;

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
 * Access level for routes
 */
export type AccessLevel = 'public' | 'protected' | 'role-specific' | 'admin-only';

/**
 * Navigation importance level
 */
export type Importance = 'critical' | 'high' | 'medium' | 'low';

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  description: string;
  requiredRole?: UserRole[];
  defaultForRole?: UserRole[];
  params?: string[];
  fallbackRoute?: string;
  parentRoute?: string;
  group: RouteGroupType;
  accessLevel: AccessLevel;
  importance?: Importance;
  trackAdvancedMetrics?: boolean;
  metadata?: {
    showInNavigation?: boolean;
    showInSidebar?: boolean;
    parentPath?: string;
    icon?: string;
    isRedirect?: boolean;
    requiresAuth?: boolean;
    isAuthEntry?: boolean;
    dynamicRoute?: boolean;
    isErrorPage?: boolean;
  };
}

/**
 * Navigation error interface
 */
export interface NavigationError {
  type: NavigationErrorType;
  message: string;
  path: string;
  role?: UserRole;
  timestamp?: string;
  context?: any;
}

/**
 * Navigation event interface
 */
export interface NavigationEvent {
  from: string;
  to: string;
  success: boolean;
  timestamp: string;
  userRole?: UserRole;
  failureReason?: string;
  analytics?: NavigationAnalyticsData;
}

/**
 * Navigation analytics data
 */
export interface NavigationAnalyticsData {
  durationMs: number;
  userAgent?: string;
  dayOfWeek?: number;
  hourOfDay?: number;
  pageDepth?: number;
  referrer?: string;
}

/**
 * Deep link definition
 */
export interface DeepLinkDefinition {
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  title?: string;
  description?: string;
}
