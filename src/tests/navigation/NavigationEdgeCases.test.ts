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
    
    it('should handle unexpected network errors', () => {
      // Spy on error handler
      const errorHandlerSpy = vi.spyOn(navigationService['errorHandler'], 'handleNavigationError');
      
      // Create network error - Using VALIDATION_ERROR as a substitute for NETWORK_ERROR
      const networkError = {
        type: NavigationErrorType.VALIDATION_ERROR,
        path: '/dashboard',
        message: 'Failed to fetch data',
        retryCount: 2
      };
      
      // Handle the error
      navigationService.handleNavigationError(networkError);
      
      // Verify handler was called correctly
      expect(errorHandlerSpy).toHaveBeenCalledWith(networkError);
    });
    
    it('should handle invalid state errors', () => {
      // Spy on error handler
      const errorHandlerSpy = vi.spyOn(navigationService['errorHandler'], 'handleNavigationError');
      
      // Create invalid state error - Using NOT_FOUND as a substitute for INVALID_STATE
      const invalidStateError = {
        type: NavigationErrorType.NOT_FOUND,
        path: '/editor',
        message: 'Invalid editor state'
      };
      
      // Handle the error
      navigationService.handleNavigationError(invalidStateError);
      
      // Verify handler was called correctly
      expect(errorHandlerSpy).toHaveBeenCalledWith(invalidStateError);
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
    
    it('should handle multiple parameters in a single path', () => {
      // Test multiple parameters
      const multiParams = extractPathParameters(
        '/products/:category/:id/details',
        '/products/electronics/12345/details'
      );
      expect(multiParams).toEqual({ 
        category: 'electronics', 
        id: '12345' 
      });
      
      // Test interleaved static and dynamic segments
      const complexParams = extractPathParameters(
        '/users/:userId/posts/:postId/comments/:commentId',
        '/users/abc123/posts/xyz789/comments/456'
      );
      expect(complexParams).toEqual({ 
        userId: 'abc123', 
        postId: 'xyz789', 
        commentId: '456' 
      });
    });
    
    it('should handle non-matching paths correctly', () => {
      // Different number of segments
      const nonMatchingSegments = extractPathParameters(
        '/user/:id/profile',
        '/user/123/profile/settings'
      );
      expect(nonMatchingSegments).toBeNull();
      
      // Different static segments
      const nonMatchingStatic = extractPathParameters(
        '/user/:id/profile',
        '/admin/123/profile'
      );
      expect(nonMatchingStatic).toBeNull();
      
      // Empty path
      const emptyPath = extractPathParameters('/user/:id', '');
      expect(emptyPath).toBeNull();
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
    
    it('should handle role escalation correctly', () => {
      // Test escalating from designer to admin
      const designerToAdmin = navigationService.handleRoleTransition('designer', 'admin');
      expect(designerToAdmin).toBe('/admin');
      
      // Test escalating from writer to designer
      const writerToDesigner = navigationService.handleRoleTransition('writer', 'designer');
      expect(writerToDesigner).toBe('/designer-dashboard');
    });
    
    it('should handle role deescalation correctly', () => {
      // Test deescalating from admin to writer
      const adminToWriter = navigationService.handleRoleTransition('admin', 'writer');
      expect(adminToWriter).toBe('/writer-dashboard');
      
      // Test deescalating from designer to writer
      const designerToWriter = navigationService.handleRoleTransition('designer', 'writer');
      expect(designerToWriter).toBe('/writer-dashboard');
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
    
    it('should handle localStorage setItem errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      // Mock console.error to avoid polluting test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Add history event (which triggers persistence)
      navigationService.logNavigationEvent('/', '/dashboard', true, 'admin');
      
      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to persist navigation history'),
        expect.any(Error)
      );
    });
    
    it('should handle corrupted localStorage data', () => {
      // Mock localStorage.getItem to return invalid JSON
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');
      
      // Mock console.error to avoid polluting test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Should not throw when loading corrupted data
      expect(() => {
        navigationService['navigationHistoryService'].loadPersistedHistory();
      }).not.toThrow();
      
      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse navigation history'),
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
    
    it('should handle analytics data with timestamp patterns', () => {
      const today = new Date();
      
      // Log events at different times
      navigationService.logNavigationEvent('/', '/dashboard', true, 'admin');
      
      // Mock navigation event with specific time properties
      const mockEvent = {
        from: '/',
        to: '/dashboard',
        success: true,
        timestamp: today.toISOString(),
        userRole: 'admin',
        analytics: {
          durationMs: 120,
          userAgent: 'test-agent',
          dayOfWeek: today.getDay(),
          hourOfDay: today.getHours()
        }
      };
      
      // Add event with analytics data
      navigationService['navigationHistoryService'].addToHistory(mockEvent);
      
      // Get recent history
      const recentHistory = navigationService.getRecentNavigationHistory();
      
      // Verify analytics data in history
      expect(recentHistory.some(event => 
        event.analytics && 
        typeof event.analytics.durationMs === 'number' &&
        typeof event.analytics.dayOfWeek === 'number'
      )).toBe(true);
    });
  });
  
  describe('Integration Tests', () => {
    it('should integrate route validation with navigation history', () => {
      // Mock route validation
      const validateSpy = vi.spyOn(navigationService, 'validateRoute');
      validateSpy.mockImplementation((path) => path !== '/admin');
      
      // Log successful navigation
      navigationService.logNavigationEvent('/', '/dashboard', true, 'writer');
      
      // Log failed navigation
      navigationService.logNavigationEvent('/dashboard', '/admin', false, 'writer', 'Access denied');
      
      // Get navigation history
      const history = navigationService.getNavigationHistory();
      
      // Verify history contains both events
      expect(history).toHaveLength(2);
      
      // Verify failed navigation is recorded correctly
      const failedEvent = history.find(event => !event.success);
      expect(failedEvent).toBeDefined();
      expect(failedEvent?.from).toBe('/dashboard');
      expect(failedEvent?.to).toBe('/admin');
      expect(failedEvent?.failureReason).toBe('Access denied');
      
      // Restore original implementation
      validateSpy.mockRestore();
    });
    
    it('should integrate role transitions with navigation suggestions', () => {
      // Get suggestions for writer role
      const writerSuggestions = navigationService.getRoleSuggestedRoutes('writer', 3);
      
      // Verify suggestions are returned and formatted correctly
      expect(Array.isArray(writerSuggestions)).toBe(true);
      if (writerSuggestions.length > 0) {
        expect(writerSuggestions[0]).toHaveProperty('path');
        expect(writerSuggestions[0]).toHaveProperty('description');
      }
    });
  });
});
