
import { UserRole } from '@/lib/types';

/**
 * Navigation types module
 */

// Re-export UserRole for compatibility with existing imports
export type { UserRole };

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
 * Route group type
 */
export type RouteGroup = 'dashboard' | 'content' | 'design' | 'admin' | 'user' | 'testing';

/**
 * Route permission mapping
 */
export interface RoutePermission {
  path: string;
  roles: Record<UserRole, boolean>;
  accessLevel: AccessLevel;
}

/**
 * Related route definition
 */
export interface RelatedRoute {
  path: string;
  relationship: 'parent' | 'child' | 'sibling' | 'alternative';
}

/**
 * Role to route mapping
 * Explicitly allows null key for unauthenticated users
 */
export interface RoleRouteMap {
  [key: string]: string; // Use string as index signature type
  null: string; // Explicit null entry for unauthenticated users
}

/**
 * Navigation validation error
 */
export interface RouteValidationError {
  path: string;
  role: UserRole;
  message: string;
  code: string;
  timestamp: string;
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
  group: RouteGroup;
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
    alternatives?: string[];
  };
}

/**
 * Route group definition
 */
export interface RouteGroupDefinition {
  name: string;
  id: RouteGroup;
  description: string;
  priority?: number;
  icon?: string;
}

/**
 * Navigation metrics data
 */
export interface NavigationMetrics {
  avgLoadTime: number;
  errorRate: number;
  mostVisited: { path: string; count: number }[];
  pageVisits: Record<string, number>;
  roleMetrics: Record<string, {
    visitCount: number;
    timeSpent: number;
    uniquePaths: number;
  }>;
}

/**
 * Navigation cookie options
 */
export interface NavigationCookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Route test result
 */
export interface RouteTestResult {
  path: string;
  rolesTested: UserRole[];
  passed: boolean;
  errorType?: NavigationErrorType;
  timestamp: string;
  metadata?: Record<string, any>;
}
