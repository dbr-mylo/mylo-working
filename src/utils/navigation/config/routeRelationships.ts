
import { RelatedRoute, RouteConfig } from '../types';
import { validRoutes } from './routeDefinitions';
import { getChildRoutes, getParentRoute } from './routeUtils';

/**
 * Build a complete route relationship map
 * This creates a map of relationships between routes for navigation and breadcrumbs
 * @returns Map of route paths to their related routes
 */
export const buildRouteRelationshipMap = (): Record<string, RelatedRoute[]> => {
  const relationshipMap: Record<string, RelatedRoute[]> = {};
  
  validRoutes.forEach(route => {
    const relationships: RelatedRoute[] = [];
    
    // Add parent relationship if exists
    const parentRoute = getParentRoute(route.path);
    if (parentRoute) {
      relationships.push({
        path: parentRoute.path,
        relationship: 'parent',
        description: parentRoute.description
      });
    }
    
    // Add child relationships
    const children = getChildRoutes(route.path);
    children.forEach(child => {
      relationships.push({
        path: child.path,
        relationship: 'child',
        description: child.description
      });
    });
    
    // Add siblings (other routes with same parent)
    if (parentRoute) {
      const siblings = getChildRoutes(parentRoute.path);
      siblings
        .filter(sibling => sibling.path !== route.path)
        .forEach(sibling => {
          relationships.push({
            path: sibling.path,
            relationship: 'sibling',
            description: sibling.description
          });
        });
    }
    
    // Add alternatives (routes with similar purpose for different roles)
    if (route.metadata?.alternatives) {
      const alternatives = Array.isArray(route.metadata.alternatives) 
        ? route.metadata.alternatives 
        : [route.metadata.alternatives as string];
      
      alternatives.forEach(altPath => {
        const altRoute = validRoutes.find(r => r.path === altPath);
        if (altRoute) {
          relationships.push({
            path: altRoute.path,
            relationship: 'alternative',
            description: altRoute.description
          });
        }
      });
    }
    
    // Store the relationships
    relationshipMap[route.path] = relationships;
  });
  
  return relationshipMap;
};

/**
 * Get related routes for a specific path
 * @param path Route path
 * @param relationshipType Optional type to filter by
 * @returns Array of related routes
 */
export const getRelatedRoutes = (
  path: string, 
  relationshipType?: 'parent' | 'child' | 'sibling' | 'alternative'
): RelatedRoute[] => {
  const allRelationships = buildRouteRelationshipMap();
  const relationships = allRelationships[path] || [];
  
  if (relationshipType) {
    return relationships.filter(rel => rel.relationship === relationshipType);
  }
  
  return relationships;
};

/**
 * Build breadcrumb trail for a route
 * @param path Current route path
 * @returns Array of routes representing breadcrumb trail
 */
export const getBreadcrumbTrail = (path: string): RouteConfig[] => {
  const breadcrumbs: RouteConfig[] = [];
  let currentPath = path;
  
  // Add current route
  const currentRoute = validRoutes.find(route => route.path === currentPath);
  if (!currentRoute) return breadcrumbs;
  
  breadcrumbs.push(currentRoute);
  
  // Build trail by traversing parents
  let parentRoute = getParentRoute(currentPath);
  while (parentRoute) {
    breadcrumbs.unshift(parentRoute);
    parentRoute = getParentRoute(parentRoute.path);
  }
  
  return breadcrumbs;
};
