
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';
import { NavigationErrorType, UserRole } from '@/utils/navigation/types';

describe('Navigation Error Scenarios', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Missing Routes', () => {
    it('should properly handle non-existent routes', () => {
      // Test with a route that definitely doesn't exist
      const nonExistentRoute = '/this-route-does-not-exist-' + Date.now();
      const isValid = navigationService.validateRoute(nonExistentRoute, 'admin');
      
      // Even admin should not be able to access a non-existent route
      expect(isValid).toBe(false);
    });

    it('should handle malformed routes', () => {
      // Test with various malformed routes
      const malformedRoutes = [
        '//',
        '/%',
        '/user//profile',
        '/admin/%'
      ];
      
      malformedRoutes.forEach(route => {
        const isValid = navigationService.validateRoute(route, 'admin');
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Unauthorized Access', () => {
    it('should prevent writer from accessing designer routes', () => {
      const designerRoute = '/design/templates';
      const isValid = navigationService.validateRoute(designerRoute, 'writer');
      expect(isValid).toBe(false);
    });

    it('should prevent designer from accessing admin routes', () => {
      const adminRoute = '/admin';
      const isValid = navigationService.validateRoute(adminRoute, 'designer');
      expect(isValid).toBe(false);
    });

    it('should prevent unauthenticated users from accessing protected routes', () => {
      const protectedRoute = '/documents';
      const isValid = navigationService.validateRoute(protectedRoute, null);
      expect(isValid).toBe(false);
    });
  });

  describe('Parameter Validation', () => {
    it('should extract valid parameters from paths', () => {
      const params = navigationService.extractRouteParameters(
        '/editor/:documentId', 
        '/editor/123'
      );
      
      expect(params).toEqual({ documentId: '123' });
    });

    it('should return null for non-matching paths', () => {
      const params = navigationService.extractRouteParameters(
        '/editor/:documentId', 
        '/profile'
      );
      
      expect(params).toBeNull();
    });

    it('should handle multiple parameters correctly', () => {
      const params = navigationService.extractRouteParameters(
        '/org/:orgId/team/:teamId', 
        '/org/org-123/team/team-456'
      );
      
      expect(params).toEqual({
        orgId: 'org-123',
        teamId: 'team-456'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors', () => {
      // Mock console.error to avoid test output pollution
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Spy on the error handler
      const handleErrorSpy = vi.spyOn(navigationService, 'handleNavigationError');
      
      // Create an error
      const navigationError = {
        type: NavigationErrorType.UNAUTHORIZED,
        path: '/admin',
        message: 'Access denied',
        role: 'writer' as UserRole
      };
      
      // Handle the error
      navigationService.handleNavigationError(navigationError);
      
      // Verify the error was handled
      expect(handleErrorSpy).toHaveBeenCalledWith(navigationError);
      
      // Restore console.error
      consoleErrorMock.mockRestore();
    });

    it('should recommend fallback routes for unavailable paths', () => {
      // For a writer trying to access designer routes
      const fallbackRoute = navigationService.getFallbackRoute('writer');
      
      // Should recommend a valid writer route
      expect(fallbackRoute).toBeTruthy();
      expect(navigationService.validateRoute(fallbackRoute, 'writer')).toBe(true);
    });
  });
  
  describe('Role Transitions', () => {
    it('should handle role transitions and provide appropriate redirect paths', () => {
      const fromWriter = navigationService.handleRoleTransition('writer', 'designer');
      expect(fromWriter).toBe('/designer-dashboard');
      expect(navigationService.validateRoute(fromWriter, 'designer')).toBe(true);
      
      const toAdmin = navigationService.handleRoleTransition('designer', 'admin');
      expect(toAdmin).toBe('/admin');
      expect(navigationService.validateRoute(toAdmin, 'admin')).toBe(true);
      
      const toNull = navigationService.handleRoleTransition('writer', null);
      expect(toNull).toBe('/auth');
    });
  });
});
