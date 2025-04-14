
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';
import { NavigationErrorType, UserRole } from '@/utils/navigation/types';
import { extractPathParameters, isActivePath, formatPathForDisplay } from '@/utils/navigation/routeUtils';

describe('Navigation Service', () => {
  beforeEach(() => {
    // Clear localStorage and reset any stored values between tests
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    // Clear navigation history for clean tests
    navigationService.clearNavigationHistory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Core Functionality', () => {
    it('should validate routes correctly', () => {
      // Test with exact route matches
      expect(navigationService.validateRoute('/', 'writer')).toBe(true);
      expect(navigationService.validateRoute('/admin', 'writer')).toBe(false);
      expect(navigationService.validateRoute('/admin', 'admin')).toBe(true);
      
      // Test with dynamic routes
      expect(navigationService.validateRoute('/editor/123', 'writer')).toBe(true);
      expect(navigationService.validateRoute('/editor/abc', 'designer')).toBe(true);
    });

    it('should return correct default routes for each role', () => {
      expect(navigationService.getDefaultRoute('admin')).toBe('/admin');
      expect(navigationService.getDefaultRoute('writer')).toBe('/writer-dashboard');
      expect(navigationService.getDefaultRoute('designer')).toBe('/designer-dashboard');
      expect(navigationService.getDefaultRoute(null)).toBe('/auth');
    });

    it('should return correct fallback routes for each role', () => {
      expect(navigationService.getFallbackRoute('admin')).toBe('/admin');
      expect(navigationService.getFallbackRoute('writer')).toBe('/writer-dashboard');
      expect(navigationService.getFallbackRoute('designer')).toBe('/designer-dashboard');
      expect(navigationService.getFallbackRoute(null)).toBe('/auth');
    });
  });

  describe('Navigation History', () => {
    it('should log navigation events correctly', () => {
      // Log some navigation events
      navigationService.logNavigationEvent('/', '/editor', true, 'writer');
      navigationService.logNavigationEvent('/editor', '/content', true, 'writer');
      navigationService.logNavigationEvent('/content', '/admin', false, 'writer', 'Access denied');
      
      // Get history and verify
      const history = navigationService.getNavigationHistory();
      expect(history).toHaveLength(3);
      expect(history[0].from).toBe('/');
      expect(history[0].to).toBe('/editor');
      expect(history[0].success).toBe(true);
      
      expect(history[2].from).toBe('/content');
      expect(history[2].to).toBe('/admin');
      expect(history[2].success).toBe(false);
      expect(history[2].failureReason).toBe('Access denied');
    });

    it('should retrieve recent navigation history', () => {
      // Log multiple navigation events
      for (let i = 0; i < 15; i++) {
        navigationService.logNavigationEvent(`/page${i}`, `/page${i+1}`, true, 'admin');
      }
      
      // Get recent history with default limit (10)
      const recentHistory = navigationService.getRecentNavigationHistory();
      expect(recentHistory).toHaveLength(10);
      
      // Get recent history with custom limit
      const limitedHistory = navigationService.getRecentNavigationHistory(5);
      expect(limitedHistory).toHaveLength(5);
      
      // Verify order (most recent first)
      expect(limitedHistory[0].from).toBe('/page14');
      expect(limitedHistory[0].to).toBe('/page15');
    });

    it('should clear navigation history', () => {
      // Log some navigation events
      navigationService.logNavigationEvent('/', '/editor', true, 'writer');
      navigationService.logNavigationEvent('/editor', '/content', true, 'writer');
      
      // Verify history exists
      expect(navigationService.getNavigationHistory()).toHaveLength(2);
      
      // Clear history
      navigationService.clearNavigationHistory();
      
      // Verify history is cleared
      expect(navigationService.getNavigationHistory()).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors', () => {
      // Mock the errorHandler.handleNavigationError method
      const handleErrorSpy = vi.spyOn(navigationService['errorHandler'], 'handleNavigationError');
      
      // Create a test error
      const testError = {
        type: NavigationErrorType.UNAUTHORIZED,
        path: '/admin',
        message: 'Access denied',
        role: 'writer' as UserRole // Fix here with type assertion
      };
      
      // Call the method
      navigationService.handleNavigationError(testError);
      
      // Verify the method was called with the correct arguments
      expect(handleErrorSpy).toHaveBeenCalledWith(testError);
    });
  });

  describe('Parameter Extraction', () => {
    it('should extract parameters from route paths correctly', () => {
      // Test cases from utils
      const params1 = extractPathParameters('/user/:id', '/user/123');
      expect(params1).toEqual({ id: '123' });
      
      const params2 = extractPathParameters('/user/:id/profile/:section', '/user/123/profile/settings');
      expect(params2).toEqual({ id: '123', section: 'settings' });
      
      const params3 = extractPathParameters('/static/path', '/different/path');
      expect(params3).toBeNull();
    });

    it('should extract parameters using the service method', () => {
      const params = navigationService.extractRouteParameters('/user/:id/profile/:section', '/user/123/profile/settings');
      expect(params).toEqual({ id: '123', section: 'settings' });
    });
  });

  describe('Route Utils', () => {
    it('should correctly identify active paths', () => {
      // Exact matching
      expect(isActivePath('/dashboard', '/dashboard', true)).toBe(true);
      expect(isActivePath('/dashboard/users', '/dashboard', true)).toBe(false);
      
      // Partial matching
      expect(isActivePath('/dashboard/users', '/dashboard')).toBe(true);
      expect(isActivePath('/settings', '/dashboard')).toBe(false);
      
      // Root path special case
      expect(isActivePath('/dashboard', '/')).toBe(false);
      expect(isActivePath('/', '/')).toBe(true);
    });

    it('should format paths for display correctly', () => {
      expect(formatPathForDisplay('/')).toBe('Home');
      expect(formatPathForDisplay('/user-profile')).toBe('User Profile');
      expect(formatPathForDisplay('/admin/user-management')).toBe('Admin / User Management');
    });
  });
});
