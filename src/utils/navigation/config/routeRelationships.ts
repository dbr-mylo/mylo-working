
import { RouteConfig } from "../types";

/**
 * Get all related routes for a specific route
 * @param route Route to get relationships for
 * @returns Object containing different route relationships
 */
export const getRouteRelationships = (route: RouteConfig) => {
  return {
    parents: getParentRoutes(route),
    children: getChildRoutes(route),
    siblings: getSiblingRoutes(route),
    alternatives: getAlternativeRoutes(route)
  };
};

/**
 * Get parent routes for a specific route
 * @param route Route to get parent for
 * @returns Array of parent routes
 */
export const getParentRoutes = (route: RouteConfig): RouteConfig[] => {
  if (!route.metadata?.parentPath) return [];
  
  // Implementation depends on how routes are stored
  // For now, this is a placeholder
  return [];
};

/**
 * Get child routes for a specific route
 * @param route Route to get children for
 * @returns Array of child routes
 */
export const getChildRoutes = (route: RouteConfig): RouteConfig[] => {
  // Implementation depends on how routes are stored
  // For now, this is a placeholder
  return [];
};

/**
 * Get sibling routes for a specific route
 * @param route Route to get siblings for
 * @returns Array of sibling routes
 */
export const getSiblingRoutes = (route: RouteConfig): RouteConfig[] => {
  if (!route.metadata?.parentPath) return [];
  
  // Implementation depends on how routes are stored
  // For now, this is a placeholder
  return [];
};

/**
 * Get alternative routes for a specific route
 * @param route Route to get alternatives for
 * @returns Array of alternative routes
 */
export const getAlternativeRoutes = (route: RouteConfig): RouteConfig[] => {
  if (!route.metadata?.alternatives || route.metadata.alternatives.length === 0) return [];
  
  // Implementation depends on how alternatives are stored
  // For now, this is a placeholder
  return [];
};

/**
 * Check if two routes are related
 * @param routeA First route
 * @param routeB Second route
 * @returns Boolean indicating if routes are related
 */
export const areRoutesRelated = (routeA: RouteConfig, routeB: RouteConfig): boolean => {
  // Routes are related if:
  // 1. One is a parent of the other
  // 2. They are siblings (share same parent)
  // 3. One is an alternative of the other
  
  // Check parent-child relationship
  if (routeA.metadata?.parentPath === routeB.path || 
      routeB.metadata?.parentPath === routeA.path) {
    return true;
  }
  
  // Check if siblings
  if (routeA.metadata?.parentPath && 
      routeB.metadata?.parentPath && 
      routeA.metadata.parentPath === routeB.metadata.parentPath) {
    return true;
  }
  
  // Check if alternatives
  if (routeA.metadata?.alternatives?.includes(routeB.path) || 
      routeB.metadata?.alternatives?.includes(routeA.path)) {
    return true;
  }
  
  return false;
};
