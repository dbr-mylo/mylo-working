
import { vi } from 'vitest';
import { UserRole, NavigationEvent, RouteConfig, AccessLevel } from '@/utils/navigation/types';

/**
 * Creates a mock navigation event
 */
export const createMockNavigationEvent = (
  from: string,
  to: string,
  success: boolean = true,
  role?: UserRole,
  failureReason?: string
): NavigationEvent => {
  return {
    from,
    to,
    success,
    timestamp: new Date().toISOString(),
    userRole: role,
    failureReason,
    analytics: {
      durationMs: 100,
      dayOfWeek: 1,
      hourOfDay: 12
    }
  };
};

/**
 * Creates a mock route configuration
 */
export const createMockRouteConfig = (
  path: string,
  requiredRole?: UserRole[],
  accessLevel: AccessLevel = 'protected'
): RouteConfig => {
  return {
    path,
    requiredRole,
    accessLevel,
    description: `Mock route for ${path}`,
    group: 'testing',
    importance: 'medium',
    metadata: {
      showInNavigation: true
    }
  };
};

/**
 * Creates a mock navigation service with configurable behavior
 */
export const createMockNavigationService = () => {
  return {
    validateRoute: vi.fn().mockReturnValue(true),
    getDefaultRoute: vi.fn().mockReturnValue('/dashboard'),
    getFallbackRoute: vi.fn().mockReturnValue('/dashboard'),
    logNavigationEvent: vi.fn(),
    handleNavigationError: vi.fn(),
    getNavigationHistory: vi.fn().mockReturnValue([]),
    getRecentNavigationHistory: vi.fn().mockReturnValue([]),
    clearNavigationHistory: vi.fn(),
    handleRoleTransition: vi.fn().mockReturnValue('/dashboard'),
    needsRedirect: vi.fn().mockReturnValue(false),
    getRoleSuggestedRoutes: vi.fn().mockReturnValue([]),
    extractRouteParameters: vi.fn().mockReturnValue({}),
    getMostFrequentRoutes: vi.fn().mockReturnValue([])
  };
};

/**
 * Setup a specific role configuration for tests
 */
export const setupRoleTestEnvironment = (role: UserRole) => {
  // Mock the validateRoute function based on role
  const mockValidateRoute = vi.fn().mockImplementation((path) => {
    if (role === 'admin') {
      return true; // Admin can access everything
    }
    
    if (role === 'writer') {
      // Writer-specific route access
      return path.startsWith('/writer') || 
             path.startsWith('/content') || 
             path === '/editor' ||
             path === '/profile' ||
             path === '/';
    }
    
    if (role === 'designer') {
      // Designer-specific route access
      return path.startsWith('/designer') || 
             path.startsWith('/design') || 
             path === '/editor' ||
             path === '/templates' ||
             path === '/profile' ||
             path === '/';
    }
    
    // Unauthenticated user access
    return path === '/auth' || path === '/help' || path.startsWith('/error');
  });
  
  return { mockValidateRoute };
};
