
/**
 * Route group definitions
 * These groups help organize routes by functional areas
 */

/**
 * Route groups for better organization
 * Each key represents a group of related routes
 */
export const routeGroups = {
  DASHBOARD: 'dashboard' as const,
  CONTENT: 'content' as const,
  DESIGN: 'design' as const,
  ADMIN: 'admin' as const,
  USER: 'user' as const,
  TESTING: 'testing' as const,
};

// Define the route group type based on the values in routeGroups
export type RouteGroupType = typeof routeGroups[keyof typeof routeGroups];
