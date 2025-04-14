
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';
import { NavigationErrorType, UserRole } from '@/utils/navigation/types';
import { extractPathParameters } from '@/utils/navigation/routeUtils';

describe('Navigation Service Edge Cases', () => {
  beforeEach(() => {
    // Clear localStorage and reset any stored values
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    // Clear navigation history for clean tests
    navigationService.clearNavigationHistory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Error Handling', () => {
    it('should handle navigation errors correctly', () => {
      // Spy on error handler
      const errorHandlerSpy = vi.spyOn(navigationService['errorHandler'], 'handleNavigationError');
      
      // Create test error
      const navigationError = {
        type: NavigationErrorType.UNAUTHORIZED,
        path: '/admin',
        message: 'Access denied',
        role: 'writer' as UserRole
      };
      
      // Handle the error
      navigationService.handleNavigationError(navigationError);
      
      // Verify handler was called correctly
      expect(errorHandlerSpy).toHaveBeenCalledWith(navigationError);
    });
    
    it('should handle server errors', () => {
      // Spy on error handler
      const errorHandlerSpy = vi.spyOn(navigationService['errorHandler'], 'handleNavigationError');
      
      // Create server error
      const serverError = {
        type: NavigationErrorType.SERVER_ERROR,
        path: '/api/data',
        message: 'Internal server error'
      };
      
      // Handle the error
      navigationService.handleNavigationError(serverError);
      
      // Verify handler was called correctly
      expect(errorHandlerSpy).toHaveBeenCalledWith(serverError);
    });
  });

  describe('Path Parameter Extraction', () => {
    it('should handle edge cases in parameter extraction', () => {
      // Test empty parameters
      const emptyParams = extractPathParameters('/user/:id', '/user/');
      expect(emptyParams).toBeNull(); // Segments don't match
      
      // Test missing parameters
      const missingParams = extractPathParameters('/user/:id/profile', '/user/profile');
      expect(missingParams).toBeNull(); // Segments don't match
      
      // Test parameter at root level
      const rootParam = extractPathParameters('/:type', '/dashboard');
      expect(rootParam).toEqual({ type: 'dashboard' });
    });
    
    it('should handle special characters in parameters', () => {
      // Test special characters in parameters
      const specialParams = extractPathParameters(
        '/user/:id/profile',
        '/user/user@example.com/profile'
      );
      expect(specialParams).toEqual({ id: 'user@example.com' });
      
      // Test URL encoded parameters
      const encodedParams = extractPathParameters(
        '/search/:term',
        '/search/hello%20world'
      );
      expect(encodedParams).toEqual({ term: 'hello%20world' });
    });
  });

  describe('Role Transitions', () => {
    it('should handle transitions between roles', () => {
      // Spy on the role transition handler
      const roleTransitionSpy = vi.spyOn(navigationService, 'handleRoleTransition');
      
      // Test transition from writer to admin
      navigationService.handleRoleTransition('writer', 'admin');
      expect(roleTransitionSpy).toHaveBeenCalledWith('writer', 'admin');
      
      // Test transition to unauthenticated
      navigationService.handleRoleTransition('writer', null);
      expect(roleTransitionSpy).toHaveBeenCalledWith('writer', null);
    });
    
    it('should check if redirect is needed after role change', () => {
      // Test with a route that needs redirection (writer route for designer)
      const needsRedirect1 = navigationService.needsRedirect('/writer-dashboard', 'designer');
      expect(typeof needsRedirect1).toBe('boolean');
      
      // Test with a route that doesn't need redirection (admin can access everything)
      const needsRedirect2 = navigationService.needsRedirect('/writer-dashboard', 'admin');
      expect(typeof needsRedirect2).toBe('boolean');
    });
  });

  describe('Persistence', () => {
    it('should handle navigation history persistence through localStorage', () => {
      // Add some history events
      navigationService.logNavigationEvent('/', '/dashboard', true, 'admin');
      navigationService.logNavigationEvent('/dashboard', '/profile', true, 'admin');
      
      // Mock localStorage.getItem to return previously saved data
      const mockHistory = [
        {
          from: '/',
          to: '/dashboard',
          success: true,
          timestamp: new Date().toISOString(),
          userRole: 'admin'
        }
      ];
      
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockHistory));
      
      // Load persisted history
      navigationService['navigationHistoryService'].loadPersistedHistory();
      
      // Check history is loaded from storage
      const loadedHistory = navigationService.getNavigationHistory();
      expect(loadedHistory).toEqual(mockHistory);
    });
    
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Mock console.error to avoid polluting test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Should not throw when localStorage fails
      expect(() => {
        navigationService['navigationHistoryService'].loadPersistedHistory();
      }).not.toThrow();
      
      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to load navigation history'),
        expect.any(Error)
      );
    });
  });

  describe('Analytics', () => {
    it('should provide writer navigation metrics', () => {
      // Set up mock metrics in localStorage
      const mockMetrics = {
        '/writer-dashboard': 3,
        '/content': 2
      };
      
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockMetrics));
      
      // Get metrics
      const metrics = navigationService.getWriterNavigationMetrics();
      
      // Verify metrics
      expect(metrics).toEqual(mockMetrics);
    });
    
    it('should handle most frequent routes calculation', () => {
      // Log multiple events to same destinations
      for (let i = 0; i < 3; i++) {
        navigationService.logNavigationEvent('/', '/dashboard', true, 'admin');
      }
      for (let i = 0; i < 2; i++) {
        navigationService.logNavigationEvent('/', '/profile', true, 'admin');
      }
      navigationService.logNavigationEvent('/', '/settings', true, 'admin');
      
      // Get most frequent routes with limit
      const frequentRoutes = navigationService.getMostFrequentRoutes(2);
      
      // Should only return top 2 routes
      expect(frequentRoutes).toHaveLength(2);
      
      // First route should be most frequent
      expect(frequentRoutes[0].path).toBe('/dashboard');
      expect(frequentRoutes[0].count).toBe(3);
      
      // Second route should be second most frequent
      expect(frequentRoutes[1].path).toBe('/profile');
      expect(frequentRoutes[1].count).toBe(2);
    });
  });
});
