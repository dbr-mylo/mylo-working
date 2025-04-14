
import { describe, it, expect } from 'vitest';
import { 
  getDefaultRouteForRole, 
  getFallbackRouteForRole,
  getRoleRouteConfig,
  DEFAULT_ROUTES,
  FALLBACK_ROUTES,
  ROLE_ROUTE_CONFIG
} from '@/utils/navigation/config/roleRouteDefaults';
import { validRoutes } from '@/utils/navigation/config/routeDefinitions';
import { routeGroups, type RouteGroupType } from '@/utils/navigation/config/routeGroups';
import { 
  getPathDescription,
  getRoutesByGroup,
  getRoutesForRole,
  getNavigationRoutesForRole,
  getSidebarRoutesForParent,
  generateRolePermissionMatrix,
  getRouteByPath
} from '@/utils/navigation/config/routeUtils';
import { UserRole, AccessLevel } from '@/utils/navigation/types';

describe('Route Configuration - Phase 2', () => {
  describe('1. Role Route Configuration', () => {
    it('should have default routes for all roles', () => {
      // Check all roles have default routes
      expect(DEFAULT_ROUTES.admin).toBeDefined();
      expect(DEFAULT_ROUTES.writer).toBeDefined();
      expect(DEFAULT_ROUTES.designer).toBeDefined();
      expect(DEFAULT_ROUTES.null).toBeDefined();
      
      // Check the helper function returns correct values
      expect(getDefaultRouteForRole('admin')).toBe(DEFAULT_ROUTES.admin);
      expect(getDefaultRouteForRole('writer')).toBe(DEFAULT_ROUTES.writer);
      expect(getDefaultRouteForRole('designer')).toBe(DEFAULT_ROUTES.designer);
      expect(getDefaultRouteForRole(null)).toBe(DEFAULT_ROUTES.null);
    });
    
    it('should have fallback routes for all roles', () => {
      // Check all roles have fallback routes
      expect(FALLBACK_ROUTES.admin).toBeDefined();
      expect(FALLBACK_ROUTES.writer).toBeDefined();
      expect(FALLBACK_ROUTES.designer).toBeDefined();
      expect(FALLBACK_ROUTES.null).toBeDefined();
      
      // Check the helper function returns correct values
      expect(getFallbackRouteForRole('admin')).toBe(FALLBACK_ROUTES.admin);
      expect(getFallbackRouteForRole('writer')).toBe(FALLBACK_ROUTES.writer);
      expect(getFallbackRouteForRole('designer')).toBe(FALLBACK_ROUTES.designer);
      expect(getFallbackRouteForRole(null)).toBe(FALLBACK_ROUTES.null);
    });
    
    it('should provide full route configuration for roles', () => {
      // Get full route config for roles
      const adminConfig = getRoleRouteConfig('admin');
      const writerConfig = getRoleRouteConfig('writer');
      const designerConfig = getRoleRouteConfig('designer');
      const unauthConfig = getRoleRouteConfig(null);
      
      // Check admin configuration
      expect(adminConfig.defaultRoute).toBe('/admin');
      expect(adminConfig.fallbackRoute).toBe('/admin');
      expect(adminConfig.homeRoute).toBe('/admin');
      
      // Check writer configuration
      expect(writerConfig.defaultRoute).toBe('/writer-dashboard');
      expect(writerConfig.dashboardRoute).toBe('/writer-dashboard');
      
      // Check designer configuration
      expect(designerConfig.defaultRoute).toBe('/designer-dashboard');
      expect(designerConfig.adminRoute).toBe('/admin');
      
      // Check unauthenticated configuration
      expect(unauthConfig.authRequiredRedirect).toBe('/auth');
    });
  });
  
  describe('2. Route Definitions', () => {
    it('should have valid routes defined with required properties', () => {
      // Check that routes exist
      expect(validRoutes.length).toBeGreaterThan(0);
      
      // Check structure of routes
      validRoutes.forEach(route => {
        expect(route.path).toBeDefined();
        expect(typeof route.path).toBe('string');
        expect(route.description).toBeDefined();
        expect(route.group).toBeDefined();
        expect(route.accessLevel).toBeDefined();
      });
    });
    
    it('should have unique paths across all routes', () => {
      const paths = validRoutes.map(route => route.path);
      const uniquePaths = new Set(paths);
      
      // Check that there are no duplicate paths
      expect(paths.length).toBe(uniquePaths.size);
    });
    
    it('should have required properties for different route types', () => {
      // Find a dynamic route
      const dynamicRoute = validRoutes.find(route => route.path.includes(':'));
      if (dynamicRoute) {
        expect(dynamicRoute.path).toContain(':');
      }
      
      // Find a protected route
      const protectedRoute = validRoutes.find(route => route.accessLevel === 'protected');
      if (protectedRoute) {
        expect(protectedRoute.accessLevel).toBe('protected');
      }
      
      // Find a role-specific route
      const roleSpecificRoute = validRoutes.find(route => route.accessLevel === 'role-specific');
      if (roleSpecificRoute) {
        expect(roleSpecificRoute.requiredRole).toBeDefined();
        if (roleSpecificRoute.requiredRole) {
          expect(Array.isArray(roleSpecificRoute.requiredRole)).toBe(true);
        }
      }
    });
  });
  
  describe('3. Route Groups', () => {
    it('should have valid route groups defined', () => {
      // Verify route groups
      expect(Object.keys(routeGroups).length).toBeGreaterThan(0);
      
      // Check common route groups
      expect(routeGroups.DASHBOARD).toBeDefined();
      expect(routeGroups.CONTENT).toBeDefined();
      expect(routeGroups.ADMIN).toBeDefined();
    });
    
    it('should get routes by group', () => {
      // Get routes for a specific group
      const adminRoutes = getRoutesByGroup(routeGroups.ADMIN);
      
      // Verify all returned routes belong to the admin group
      adminRoutes.forEach(route => {
        expect(route.group).toBe(routeGroups.ADMIN);
      });
    });
  });
  
  describe('4. Route Utilities', () => {
    it('should get path description', () => {
      // Find a route with a description
      const route = validRoutes[0];
      const description = getPathDescription(route.path);
      
      // Verify description matches
      expect(description).toBeDefined();
    });
    
    it('should get routes for specific role', () => {
      // Get routes for admin role
      const adminRoutes = getRoutesForRole('admin');
      
      // Admin should have access to all routes
      expect(adminRoutes.length).toBe(validRoutes.length);
      
      // Get routes for writer role
      const writerRoutes = getRoutesForRole('writer');
      
      // Writer should have access to some routes
      expect(writerRoutes.length).toBeGreaterThan(0);
      expect(writerRoutes.length).toBeLessThan(validRoutes.length);
    });
    
    it('should get navigation routes for role', () => {
      // Get navigation routes for admin
      const adminNavRoutes = getNavigationRoutesForRole('admin');
      
      // Verify all returned routes are marked for navigation
      adminNavRoutes.forEach(route => {
        expect(route.metadata?.showInNavigation).toBe(true);
      });
    });
    
    it('should get sidebar routes for parent', () => {
      // Find a parent route that should have sidebar items
      const parentPath = '/admin';
      
      // Get sidebar routes for this parent
      const sidebarRoutes = getSidebarRoutesForParent(parentPath, 'admin');
      
      // Verify all returned routes are marked for sidebar and have correct parent
      sidebarRoutes.forEach(route => {
        expect(route.metadata?.showInSidebar).toBe(true);
        expect(route.metadata?.parentPath).toBe(parentPath);
      });
    });
    
    it('should generate role permission matrix', () => {
      // Generate permission matrix
      const permissionMatrix = generateRolePermissionMatrix();
      
      // Verify structure
      expect(Array.isArray(permissionMatrix)).toBe(true);
      if (permissionMatrix.length > 0) {
        expect(permissionMatrix[0].path).toBeDefined();
        expect(permissionMatrix[0].roles).toBeDefined();
        expect(permissionMatrix[0].accessLevel).toBeDefined();
      }
    });
    
    it('should get route by path', () => {
      // Get a known route
      const route = getRouteByPath('/admin');
      
      // Verify route data
      expect(route).toBeDefined();
      if (route) {
        expect(route.path).toBe('/admin');
        expect(route.requiredRole).toContain('admin');
      }
    });
  });
});
