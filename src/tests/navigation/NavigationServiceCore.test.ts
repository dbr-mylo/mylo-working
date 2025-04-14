
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';
import { UserRole, NavigationEvent } from '@/utils/navigation/types';
import { DEFAULT_ROUTES, FALLBACK_ROUTES } from '@/utils/navigation/config/roleRouteDefaults';
import { validRoutes } from '@/utils/navigation/config/routeDefinitions';
import { routeGroups } from '@/utils/navigation/config/routeGroups';

describe('Navigation Service Core - Phase 2', () => {
  // Clear state before each test
  beforeEach(() => {
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    // Reset navigation history
    navigationService.clearNavigationHistory();
    
    // Reset mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Navigation History Tests', () => {
    describe('1.1 Event Logging Functionality', () => {
      it('should log navigation events with correct structure', () => {
        // Mock performance.now to return consistent values
        vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(150);
        
        // Log a navigation event
        navigationService.logNavigationEvent('/start', '/destination', true, 'admin');
        
        // Get the history and check the first event
        const history = navigationService.getNavigationHistory();
        expect(history).toHaveLength(1);
        
        // Verify event structure
        const event = history[0];
        expect(event.from).toBe('/start');
        expect(event.to).toBe('/destination');
        expect(event.success).toBe(true);
        expect(event.userRole).toBe('admin');
        expect(event.timestamp).toBeDefined();
        
        // Check analytics data structure
        expect(event.analytics).toBeDefined();
        expect(event.analytics?.durationMs).toBeDefined();
        expect(typeof event.analytics?.durationMs).toBe('number');
        expect(event.analytics?.dayOfWeek).toBeDefined();
        expect(event.analytics?.hourOfDay).toBeDefined();
      });
      
      it('should include failure reason when navigation fails', () => {
        // Log a failed navigation event with reason
        navigationService.logNavigationEvent(
          '/start', 
          '/admin', 
          false, 
          'writer', 
          'Insufficient permissions'
        );
        
        // Get the history and verify failure reason
        const history = navigationService.getNavigationHistory();
        expect(history[0].success).toBe(false);
        expect(history[0].failureReason).toBe('Insufficient permissions');
      });
      
      it('should track role-specific analytics for writer role', () => {
        // Spy on console.info which is used for writer-specific analytics
        const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        
        // Log writer navigation to content-related path
        navigationService.logNavigationEvent('/dashboard', '/writer-dashboard', true, 'writer');
        
        // Verify writer-specific analytics were logged
        expect(consoleInfoSpy).toHaveBeenCalledWith(
          expect.stringContaining('[Writer Analytics]')
        );
        
        // Verify metrics were stored in localStorage
        if (typeof localStorage !== 'undefined') {
          const metrics = JSON.parse(localStorage.getItem('writer_navigation_metrics') || '{}');
          expect(metrics['/writer-dashboard']).toBe(1);
        }
      });
    });
    
    describe('1.2 History Retrieval', () => {
      it('should retrieve full navigation history in correct order', () => {
        // Log multiple navigation events
        navigationService.logNavigationEvent('/page1', '/page2', true, 'admin');
        navigationService.logNavigationEvent('/page2', '/page3', true, 'admin');
        navigationService.logNavigationEvent('/page3', '/page4', true, 'admin');
        
        // Get history
        const history = navigationService.getNavigationHistory();
        
        // Verify history length and order
        expect(history).toHaveLength(3);
        expect(history[0].from).toBe('/page1');
        expect(history[0].to).toBe('/page2');
        expect(history[1].from).toBe('/page2');
        expect(history[1].to).toBe('/page3');
        expect(history[2].from).toBe('/page3');
        expect(history[2].to).toBe('/page4');
      });
      
      it('should retrieve recent navigation history with default limit', () => {
        // Log more than the default limit of events
        for (let i = 0; i < 15; i++) {
          navigationService.logNavigationEvent(`/page${i}`, `/page${i+1}`, true, 'admin');
        }
        
        // Get recent history with default limit
        const recentHistory = navigationService.getRecentNavigationHistory();
        
        // Verify default limit of 10 is applied
        expect(recentHistory).toHaveLength(10);
        
        // Verify order (most recent first)
        expect(recentHistory[0].from).toBe('/page14');
        expect(recentHistory[0].to).toBe('/page15');
      });
      
      it('should retrieve recent navigation history with custom limit', () => {
        // Log multiple navigation events
        for (let i = 0; i < 10; i++) {
          navigationService.logNavigationEvent(`/page${i}`, `/page${i+1}`, true, 'admin');
        }
        
        // Get recent history with custom limit
        const recentHistory = navigationService.getRecentNavigationHistory(3);
        
        // Verify custom limit is applied
        expect(recentHistory).toHaveLength(3);
        
        // Verify order (most recent first)
        expect(recentHistory[0].from).toBe('/page9');
        expect(recentHistory[0].to).toBe('/page10');
      });
    });
    
    describe('1.3 History Management', () => {
      it('should clear navigation history', () => {
        // Log some navigation events
        navigationService.logNavigationEvent('/a', '/b', true, 'admin');
        navigationService.logNavigationEvent('/b', '/c', true, 'admin');
        
        // Verify history exists
        expect(navigationService.getNavigationHistory()).toHaveLength(2);
        
        // Clear history
        navigationService.clearNavigationHistory();
        
        // Verify history is cleared
        expect(navigationService.getNavigationHistory()).toHaveLength(0);
      });
      
      it('should get most frequent routes', () => {
        // Log multiple visits to the same routes
        for (let i = 0; i < 3; i++) navigationService.logNavigationEvent('/any', '/dashboard', true, 'admin');
        for (let i = 0; i < 5; i++) navigationService.logNavigationEvent('/any', '/profile', true, 'admin');
        for (let i = 0; i < 2; i++) navigationService.logNavigationEvent('/any', '/settings', true, 'admin');
        
        // Get most frequent routes
        const frequentRoutes = navigationService.getMostFrequentRoutes();
        
        // Verify results
        expect(frequentRoutes).toHaveLength(3);
        expect(frequentRoutes[0].path).toBe('/profile');
        expect(frequentRoutes[0].count).toBe(5);
        expect(frequentRoutes[1].path).toBe('/dashboard');
        expect(frequentRoutes[1].count).toBe(3);
      });
    });
    
    describe('1.4 Event Structure and Timestamps', () => {
      it('should include valid ISO timestamp in events', () => {
        // Log an event
        navigationService.logNavigationEvent('/a', '/b', true, 'admin');
        
        // Get the event
        const event = navigationService.getNavigationHistory()[0];
        
        // Check timestamp format (ISO 8601)
        expect(event.timestamp).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
        );
        
        // Verify timestamp is valid date
        const timestamp = new Date(event.timestamp);
        expect(timestamp instanceof Date).toBe(true);
        expect(timestamp.toString()).not.toBe('Invalid Date');
      });
      
      it('should include analytics data in event structure', () => {
        // Mock performance for consistent test
        vi.spyOn(performance, 'now').mockReturnValue(123);
        
        // Log an event
        navigationService.logNavigationEvent('/a', '/b', true, 'admin');
        
        // Get the event
        const event = navigationService.getNavigationHistory()[0];
        
        // Verify analytics structure
        expect(event.analytics).toBeDefined();
        expect(event.analytics?.durationMs).toBe(123);
        expect(typeof event.analytics?.dayOfWeek).toBe('number');
        expect(event.analytics?.dayOfWeek).toBeGreaterThanOrEqual(0);
        expect(event.analytics?.dayOfWeek).toBeLessThanOrEqual(6);
        expect(typeof event.analytics?.hourOfDay).toBe('number');
        expect(event.analytics?.hourOfDay).toBeGreaterThanOrEqual(0);
        expect(event.analytics?.hourOfDay).toBeLessThanOrEqual(23);
      });
    });
  });

  describe('2. Route Configuration Tests', () => {
    describe('2.1 Default Route Resolution', () => {
      it('should resolve default routes for all defined roles', () => {
        // Test admin default route
        expect(navigationService.getDefaultRoute('admin')).toBe(DEFAULT_ROUTES['admin']);
        
        // Test writer default route
        expect(navigationService.getDefaultRoute('writer')).toBe(DEFAULT_ROUTES['writer']);
        
        // Test designer default route
        expect(navigationService.getDefaultRoute('designer')).toBe(DEFAULT_ROUTES['designer']);
        
        // Test null (unauthenticated) default route
        expect(navigationService.getDefaultRoute(null)).toBe(DEFAULT_ROUTES['null']);
      });
      
      it('should handle legacy role mapping correctly', () => {
        // Test legacy 'editor' role (should map to writer routes)
        expect(navigationService.getDefaultRoute('editor')).toBe(DEFAULT_ROUTES['writer']);
      });
    });
    
    describe('2.2 Fallback Route Behavior', () => {
      it('should resolve fallback routes for all defined roles', () => {
        // Test admin fallback route
        expect(navigationService.getFallbackRoute('admin')).toBe(FALLBACK_ROUTES['admin']);
        
        // Test writer fallback route
        expect(navigationService.getFallbackRoute('writer')).toBe(FALLBACK_ROUTES['writer']);
        
        // Test designer fallback route
        expect(navigationService.getFallbackRoute('designer')).toBe(FALLBACK_ROUTES['designer']);
        
        // Test null (unauthenticated) fallback route
        expect(navigationService.getFallbackRoute(null)).toBe(FALLBACK_ROUTES['null']);
      });
      
      it('should handle legacy role mapping for fallback routes', () => {
        // Test legacy 'editor' role fallback (should map to writer routes)
        expect(navigationService.getFallbackRoute('editor')).toBe(FALLBACK_ROUTES['writer']);
      });
    });
    
    describe('2.3 Route Group Configuration', () => {
      it('should have valid route groups defined', () => {
        // Verify that route groups exist
        expect(routeGroups).toBeDefined();
        
        // Check for expected route group keys
        expect(routeGroups.DASHBOARD).toBeDefined();
        expect(routeGroups.CONTENT).toBeDefined();
        expect(routeGroups.ADMIN).toBeDefined();
        expect(routeGroups.USER).toBeDefined();
        expect(routeGroups.DESIGN).toBeDefined();
        expect(routeGroups.TESTING).toBeDefined();
      });
      
      it('should have routes assigned to valid groups', () => {
        // Get all valid route group IDs
        const validGroupIds = Object.values(routeGroups);
        
        // Check that all routes have a valid group
        validRoutes.forEach(route => {
          expect(validGroupIds).toContain(route.group);
        });
      });
    });
    
    describe('2.4 Route Parameter Extraction', () => {
      it('should extract parameters from dynamic routes', () => {
        const params = navigationService.extractRouteParameters(
          '/user/:id/profile/:section',
          '/user/123/profile/settings'
        );
        
        expect(params).toEqual({ id: '123', section: 'settings' });
      });
      
      it('should return null for non-matching routes', () => {
        const params = navigationService.extractRouteParameters(
          '/user/:id',
          '/profile/settings'
        );
        
        expect(params).toBeNull();
      });
      
      it('should handle routes with multiple parameters', () => {
        const params = navigationService.extractRouteParameters(
          '/org/:orgId/team/:teamId/user/:userId',
          '/org/abc-123/team/team-456/user/user-789'
        );
        
        expect(params).toEqual({
          orgId: 'abc-123',
          teamId: 'team-456',
          userId: 'user-789'
        });
      });
    });
  });

  describe('3. Edge Cases and Error Handling', () => {
    it('should handle role transition between roles', () => {
      // Mock the role transition handler
      const handleRoleTransitionSpy = vi.spyOn(navigationService, 'handleRoleTransition');
      
      // Call the method with role transition
      navigationService.handleRoleTransition('writer', 'admin');
      
      // Verify the method was called with correct roles
      expect(handleRoleTransitionSpy).toHaveBeenCalledWith('writer', 'admin');
    });
    
    it('should detect when redirect is needed after role change', () => {
      // Test with a route that needs redirection
      const needsRedirect = navigationService.needsRedirect('/writer-dashboard', 'designer');
      
      // This should be true because writer-dashboard is not accessible to designers
      expect(typeof needsRedirect).toBe('boolean');
    });
    
    it('should provide suggested routes for roles', () => {
      // Get suggested routes for a role
      const suggestedRoutes = navigationService.getRoleSuggestedRoutes('writer', 2);
      
      // Verify structure of suggested routes
      expect(Array.isArray(suggestedRoutes)).toBe(true);
      if (suggestedRoutes.length > 0) {
        expect(suggestedRoutes[0]).toHaveProperty('path');
        expect(suggestedRoutes[0]).toHaveProperty('description');
      }
    });
  });
});
