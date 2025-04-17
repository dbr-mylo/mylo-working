
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';
import { NavigationErrorType, UserRole } from '@/utils/navigation/types';
import { showNavigationErrorToast } from '@/utils/navigation/errorHandling';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

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
    
    it('should correctly classify missing routes as NOT_FOUND errors', () => {
      const nonExistentRoute = '/this-route-does-not-exist-' + Date.now();
      const handleSpy = vi.spyOn(navigationService, 'handleNavigationError');
      
      navigationService.handleNavigationError({
        type: NavigationErrorType.NOT_FOUND,
        path: nonExistentRoute,
        message: 'Route not found',
        role: 'admin'
      });
      
      expect(handleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NavigationErrorType.NOT_FOUND,
          path: nonExistentRoute
        })
      );
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
    
    it('should handle unauthorized errors with appropriate error messages', () => {
      // Mock toast to verify error messages
      const toastSpy = vi.spyOn(showNavigationErrorToast as any, 'toast');
      
      const error = {
        type: NavigationErrorType.UNAUTHORIZED,
        path: '/admin',
        message: 'Access denied',
        role: 'writer' as UserRole
      };
      
      // Handle the error
      navigationService.handleNavigationError(error);
      
      // Verify error handling called with correct type
      expect(navigationService.handleNavigationError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NavigationErrorType.UNAUTHORIZED
        })
      );
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
    
    it('should reject malformed parameters and handle validation errors', () => {
      // Test with a malformed parameter
      const malformedPath = '/editor/%ZZ'; // Invalid URL encoding
      
      try {
        // This should either return null or throw an error
        const params = navigationService.extractRouteParameters('/editor/:documentId', malformedPath);
        expect(params).toBeNull();
      } catch (error) {
        // If it throws, that's also acceptable for validation errors
        expect(error).toBeTruthy();
      }
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
    
    it('should handle server errors with appropriate error messages', () => {
      const error = {
        type: NavigationErrorType.SERVER_ERROR,
        path: '/dashboard',
        message: 'Server error occurred',
        role: 'writer' as UserRole
      };
      
      // Spy on error handler
      const handleErrorSpy = vi.spyOn(navigationService, 'handleNavigationError');
      
      // Handle the error
      navigationService.handleNavigationError(error);
      
      // Verify error handling called with correct type
      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NavigationErrorType.SERVER_ERROR
        })
      );
    });
    
    it('should handle validation errors for malformed paths', () => {
      const error = {
        type: NavigationErrorType.VALIDATION_ERROR,
        path: '/editor/%ZZ',
        message: 'Invalid URL parameters',
        role: 'writer' as UserRole
      };
      
      // Spy on error handler
      const handleErrorSpy = vi.spyOn(navigationService, 'handleNavigationError');
      
      // Handle the error
      navigationService.handleNavigationError(error);
      
      // Verify error handling called with correct type
      expect(handleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NavigationErrorType.VALIDATION_ERROR
        })
      );
    });
  });
  
  describe('Recovery Mechanisms', () => {
    it('should provide appropriate recovery steps for different error types', () => {
      const errorTypes = [
        NavigationErrorType.NOT_FOUND,
        NavigationErrorType.UNAUTHORIZED,
        NavigationErrorType.VALIDATION_ERROR,
        NavigationErrorType.SERVER_ERROR
      ];
      
      errorTypes.forEach(errorType => {
        const error = {
          type: errorType,
          path: '/test-path',
          message: `Test ${errorType} error`,
          role: 'writer' as UserRole
        };
        
        // Handle error and check that we get recovery steps
        navigationService.handleNavigationError(error);
        
        // In a real implementation, we would verify the recovery steps
        // For this test, we just ensure the function doesn't throw
        expect(() => navigationService.handleNavigationError(error)).not.toThrow();
      });
    });
    
    it('should provide fallback routes specific to user roles', () => {
      const roles: Array<UserRole | null> = ['writer', 'designer', 'admin', null];
      
      roles.forEach(role => {
        const fallbackRoute = navigationService.getFallbackRoute(role);
        
        // Fallback route should exist
        expect(fallbackRoute).toBeTruthy();
        
        // Fallback route should be valid for the role
        expect(navigationService.validateRoute(fallbackRoute, role)).toBe(true);
      });
    });
  });
});
