
import { RouteGroup, RouteGroupDefinition } from '../types';

export type RouteGroupType = RouteGroup;

/**
 * Define all route groups in the application
 */
export const routeGroups: Record<string, RouteGroupType> = {
  DASHBOARD: 'dashboard',
  CONTENT: 'content',
  DESIGN: 'design',
  ADMIN: 'admin',
  USER: 'user',
  TESTING: 'testing',
};

/**
 * Define detailed information about each route group
 */
export const routeGroupDefinitions: Record<RouteGroupType, RouteGroupDefinition> = {
  dashboard: {
    name: 'Dashboard',
    id: 'dashboard',
    description: 'Main application dashboards',
    priority: 1,
    icon: 'layout-dashboard'
  },
  content: {
    name: 'Content',
    id: 'content',
    description: 'Content management and editing',
    priority: 2,
    icon: 'file-text'
  },
  design: {
    name: 'Design',
    id: 'design',
    description: 'Design and template management',
    priority: 3,
    icon: 'palette'
  },
  admin: {
    name: 'Admin',
    id: 'admin',
    description: 'Administrative tools and settings',
    priority: 4,
    icon: 'shield'
  },
  user: {
    name: 'User',
    id: 'user',
    description: 'User account and profile',
    priority: 5,
    icon: 'user'
  },
  testing: {
    name: 'Testing',
    id: 'testing',
    description: 'Testing and development tools',
    priority: 6,
    icon: 'code'
  }
};

/**
 * Get a route group definition by ID
 * @param groupId Route group ID
 * @returns Route group definition
 */
export const getRouteGroupDefinition = (groupId: RouteGroupType): RouteGroupDefinition => {
  return routeGroupDefinitions[groupId];
};
