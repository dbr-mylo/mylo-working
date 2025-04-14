
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigationService } from '@/services/navigation/NavigationService';

describe('Role Routing Scenarios', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Role Transitions', () => {
    it('should handle transition from writer to designer correctly', () => {
      // When a writer becomes a designer, they should be redirected to designer's default route
      const redirectRoute = navigationService.handleRoleTransition('writer', 'designer');
      expect(redirectRoute).toBe('/designer-dashboard');
    });

    it('should handle transition from designer to writer correctly', () => {
      // When a designer becomes a writer, they should be redirected to writer's default route
      const redirectRoute = navigationService.handleRoleTransition('designer', 'writer');
      expect(redirectRoute).toBe('/writer-dashboard');
    });

    it('should handle transition to admin correctly', () => {
      // When any role becomes an admin, they should be redirected to admin's default route
      const redirectRoute = navigationService.handleRoleTransition('writer', 'admin');
      expect(redirectRoute).toBe('/admin');
    });

    it('should handle logout transition correctly', () => {
      // When a user logs out, they should be redirected to auth route
      const redirectRoute = navigationService.handleRoleTransition('writer', null);
      expect(redirectRoute).toBe('/auth');
    });

    it('should handle login transition correctly', () => {
      // When a user logs in, they should be redirected to their role's default route
      const redirectRoute = navigationService.handleRoleTransition(null, 'writer');
      expect(redirectRoute).toBe('/writer-dashboard');
    });
  });

  describe('Route Redirection After Role Change', () => {
    it('should identify when redirection is needed', () => {
      // Writer on a designer route should be redirected
      expect(navigationService.needsRedirect('/design/templates', 'writer')).toBe(true);
      
      // Designer on a writer route should be redirected
      expect(navigationService.needsRedirect('/content/documents', 'designer')).toBe(true);
      
      // User on a valid route for their role should not be redirected
      expect(navigationService.needsRedirect('/content/documents', 'writer')).toBe(false);
      expect(navigationService.needsRedirect('/design/templates', 'designer')).toBe(false);
      
      // Admin should not be redirected from any route
      expect(navigationService.needsRedirect('/design/templates', 'admin')).toBe(false);
      expect(navigationService.needsRedirect('/content/documents', 'admin')).toBe(false);
      expect(navigationService.needsRedirect('/admin/users', 'admin')).toBe(false);
    });
  });

  describe('Route Suggestions', () => {
    it('should return appropriate suggested routes for writers', () => {
      const suggestions = navigationService.getRoleSuggestedRoutes('writer');
      
      // Should include writer routes
      const paths = suggestions.map(s => s.path);
      expect(paths).toContain('/writer-dashboard');
      expect(paths).toContain('/content/documents');
      expect(paths).toContain('/editor');
      
      // Should not include designer routes
      expect(paths).not.toContain('/design/templates');
    });

    it('should return appropriate suggested routes for designers', () => {
      const suggestions = navigationService.getRoleSuggestedRoutes('designer');
      
      // Should include designer routes
      const paths = suggestions.map(s => s.path);
      expect(paths).toContain('/designer-dashboard');
      expect(paths).toContain('/design/templates');
      expect(paths).toContain('/templates');
      
      // Should not include writer routes
      expect(paths).not.toContain('/content/documents');
      expect(paths).not.toContain('/writer-dashboard');
    });

    it('should return appropriate suggested routes for admins', () => {
      const suggestions = navigationService.getRoleSuggestedRoutes('admin');
      
      // Should include admin routes
      const paths = suggestions.map(s => s.path);
      expect(paths).toContain('/admin');
      expect(paths).toContain('/admin/system-health');
    });

    it('should return authentication routes for unauthenticated users', () => {
      const suggestions = navigationService.getRoleSuggestedRoutes(null);
      
      // Should focus on auth routes
      const paths = suggestions.map(s => s.path);
      expect(paths).toContain('/auth');
    });
  });
});
