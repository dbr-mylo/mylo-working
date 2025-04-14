
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isValidRoute, isTestingRoute, canAccessTestingRoute } from '@/utils/navigation/routeValidation';
import { doesRouteExist, isRouteAccessibleForRole } from '@/utils/navigation/routeValidator';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole } from '@/lib/types';

// Mock the navigation service validateRoute method
vi.mock('@/services/navigation/NavigationService', () => ({
  navigationService: {
    validateRoute: vi.fn(),
    // Mock other methods as needed
  }
}));

describe('Route Validator', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Basic Route Validation Tests
  describe('Basic Route Validation', () => {
    it('should validate exact route matches', () => {
      // Setup mock implementation for this test
      vi.mocked(navigationService.validateRoute).mockImplementation((path) => {
        return ['/auth', '/', '/admin', '/editor'].includes(path);
      });
      
      // Test cases
      expect(isValidRoute('/auth', null)).toBe(true);
      expect(isValidRoute('/', 'writer')).toBe(true);
      expect(isValidRoute('/admin', 'admin')).toBe(true);
      expect(isValidRoute('/editor', 'writer')).toBe(true);
      expect(isValidRoute('/non-existent', 'admin')).toBe(false);
    });

    it('should correctly identify testing routes', () => {
      expect(isTestingRoute('/testing/regression')).toBe(true);
      expect(isTestingRoute('/testing/smoke')).toBe(true);
      expect(isTestingRoute('/not-testing')).toBe(false);
      expect(isTestingRoute('/testing')).toBe(false);
    });

    it('should allow access to testing routes based on environment and role', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // In development, anyone can access testing routes
      expect(canAccessTestingRoute('/testing/regression', null)).toBe(true);
      
      // Restore environment and mock production
      process.env.NODE_ENV = 'production';
      
      // Setup mock implementation for production environment validation
      vi.mocked(navigationService.validateRoute).mockImplementation((path, role) => {
        if (path.startsWith('/testing/') && role !== 'admin') {
          return false;
        }
        return true;
      });
      
      // In production, only admin should have access
      expect(canAccessTestingRoute('/testing/regression', 'admin')).toBe(true);
      expect(canAccessTestingRoute('/testing/regression', 'writer')).toBe(false);
      expect(canAccessTestingRoute('/testing/smoke', null)).toBe(false);
      
      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  // Direct Tests for Route Existence and Accessibility
  describe('Route Existence and Dynamic Routes', () => {
    it('should correctly identify if a route exists', () => {
      // These tests call the actual implementation
      expect(doesRouteExist('/')).toBe(true);
      expect(doesRouteExist('/auth')).toBe(true);
      expect(doesRouteExist('/non-existent-route')).toBe(false);
    });

    it('should handle dynamic route parameters correctly', () => {
      // Test dynamic routes with parameters
      expect(doesRouteExist('/editor/123')).toBe(true); // matches /editor/:documentId
      expect(doesRouteExist('/editor/abc')).toBe(true); // matches /editor/:documentId
      
      // Test non-matching dynamic routes
      expect(doesRouteExist('/editor/123/settings')).toBe(false); // no matching route pattern
    });
  });

  // Role-Based Access Tests
  describe('Role-Based Access Control', () => {
    it('should grant admin access to all routes', () => {
      // Sample routes for testing
      const testRoutes = [
        '/admin',
        '/admin/users',
        '/design',
        '/design/templates',
        '/content',
        '/content/documents',
        '/editor',
        '/profile'
      ];
      
      // Setup mock implementation
      vi.mocked(navigationService.validateRoute).mockImplementation((path, role) => {
        return role === 'admin' || ['/', '/auth', '/profile'].includes(path);
      });
      
      // Admin should have access to all routes
      testRoutes.forEach(route => {
        expect(isValidRoute(route, 'admin')).toBe(true);
      });
    });

    it('should enforce writer-specific route restrictions', () => {
      // Setup mock implementation for writer access
      vi.mocked(navigationService.validateRoute).mockImplementation((path, role) => {
        if (role === 'writer') {
          // Writer can access these routes
          return path.startsWith('/content') || 
                 path === '/editor' || 
                 path === '/writer-dashboard' || 
                 path === '/profile' ||
                 path === '/';
        }
        return false;
      });
      
      // Writer access tests - allowed routes
      expect(isValidRoute('/content', 'writer')).toBe(true);
      expect(isValidRoute('/content/documents', 'writer')).toBe(true);
      expect(isValidRoute('/editor', 'writer')).toBe(true);
      expect(isValidRoute('/writer-dashboard', 'writer')).toBe(true);
      
      // Writer access tests - restricted routes
      expect(isValidRoute('/admin', 'writer')).toBe(false);
      expect(isValidRoute('/design', 'writer')).toBe(false);
      expect(isValidRoute('/design/templates', 'writer')).toBe(false);
    });

    it('should enforce designer-specific route restrictions', () => {
      // Setup mock implementation for designer access
      vi.mocked(navigationService.validateRoute).mockImplementation((path, role) => {
        if (role === 'designer') {
          // Designer can access these routes
          return path.startsWith('/design') || 
                 path === '/editor' || 
                 path === '/designer-dashboard' || 
                 path === '/profile' ||
                 path === '/templates' ||
                 path === '/';
        }
        return false;
      });
      
      // Designer access tests - allowed routes
      expect(isValidRoute('/design', 'designer')).toBe(true);
      expect(isValidRoute('/design/templates', 'designer')).toBe(true);
      expect(isValidRoute('/templates', 'designer')).toBe(true);
      expect(isValidRoute('/editor', 'designer')).toBe(true);
      expect(isValidRoute('/designer-dashboard', 'designer')).toBe(true);
      
      // Designer access tests - restricted routes
      expect(isValidRoute('/admin', 'designer')).toBe(false);
      expect(isValidRoute('/content', 'designer')).toBe(false);
      expect(isValidRoute('/writer-dashboard', 'designer')).toBe(false);
    });

    it('should restrict unauthenticated user access to public routes only', () => {
      // Setup mock implementation for unauthenticated access
      vi.mocked(navigationService.validateRoute).mockImplementation((path, role) => {
        if (role === null) {
          // Unauthenticated users can only access these routes
          return path === '/auth' || 
                 path === '/help' || 
                 path === '/not-found' || 
                 path === '/unauthorized' || 
                 path === '/error';
        }
        return false;
      });
      
      // Unauthenticated access tests - allowed routes
      expect(isValidRoute('/auth', null)).toBe(true);
      expect(isValidRoute('/help', null)).toBe(true);
      expect(isValidRoute('/not-found', null)).toBe(true);
      
      // Unauthenticated access tests - restricted routes
      expect(isValidRoute('/', null)).toBe(false);
      expect(isValidRoute('/admin', null)).toBe(false);
      expect(isValidRoute('/content', null)).toBe(false);
      expect(isValidRoute('/editor', null)).toBe(false);
    });
  });

  // Error Page Access Tests
  describe('Error Page Access', () => {
    it('should allow all users to access error pages', () => {
      // Setup mock implementation
      vi.mocked(navigationService.validateRoute).mockImplementation((path) => {
        return path === '/not-found' || path === '/unauthorized' || path === '/error';
      });
      
      // All users should have access to error pages
      const errorPages = ['/not-found', '/unauthorized', '/error'];
      const userRoles: (UserRole)[] = ['admin', 'writer', 'designer', null];
      
      errorPages.forEach(page => {
        userRoles.forEach(role => {
          expect(isValidRoute(page, role)).toBe(true);
        });
      });
    });
  });

  // Role Transition Tests
  describe('Role Transition Scenarios', () => {
    it('should handle role transitions correctly', () => {
      // For role transitions, we'll test the actual RouteValidator implementation
      
      // First as writer
      expect(isRouteAccessibleForRole('/content/documents', 'writer')).toBe(true);
      expect(isRouteAccessibleForRole('/design/templates', 'writer')).toBe(false);
      
      // Then as designer
      expect(isRouteAccessibleForRole('/content/documents', 'designer')).toBe(false);
      expect(isRouteAccessibleForRole('/design/templates', 'designer')).toBe(true);
      
      // Then as admin (should have access to both)
      expect(isRouteAccessibleForRole('/content/documents', 'admin')).toBe(true);
      expect(isRouteAccessibleForRole('/design/templates', 'admin')).toBe(true);
    });
  });
});
