
import { RouteConfig, RelatedRoute } from '../types';
import { validRoutes } from './routeDefinitions';

/**
 * Find the direct parent route for a given route path
 * @param path Current route path
 * @returns Parent path or null if no parent
 */
export const findParentRoute = (path: string): string | null => {
  // If it's the root path, it has no parent
  if (path === '/') {
    return null;
  }
  
  // Find the route configuration
  const route = validRoutes.find(r => r.path === path);
  if (!route) {
    return null;
  }
  
  // Check for explicit parent in metadata
  if (route.metadata?.parentPath) {
    return route.metadata.parentPath;
  }
  
  // Check for explicit parent in route config
  if (route.parentRoute) {
    return route.parentRoute;
  }
  
  // Try to find parent based on path hierarchy
  const segments = path.split('/').filter(Boolean);
  if (segments.length <= 1) {
    return '/';
  }
  
  // Remove last segment to get potential parent path
  segments.pop();
  const parentPath = `/${segments.join('/')}`;
  
  // Verify this parent path exists
  const parentExists = validRoutes.some(r => r.path === parentPath);
  return parentExists ? parentPath : '/';
};

/**
 * Find all parent routes in a hierarchy for a given path
 * @param path Current route path
 * @param visited Optional array of already visited paths to detect circular references
 * @returns Array of parent routes in order from root to closest parent
 */
export const findParentRoutes = (path: string, visited: string[] = []): Array<{ path: string; label: string }> => {
  // Check for circular references
  if (visited.includes(path)) {
    console.warn('Circular reference detected in route hierarchy:', [...visited, path].join(' -> '));
    return [];
  }
  
  const result: Array<{ path: string; label: string }> = [];
  let currentPath = path;
  
  // Add current path to visited paths
  const updatedVisited = [...visited, currentPath];
  
  while (true) {
    const parentPath = findParentRoute(currentPath);
    if (!parentPath) {
      break;
    }
    
    // Check for circular reference with the new parent
    if (updatedVisited.includes(parentPath)) {
      console.warn('Circular reference detected in route hierarchy:', 
        [...updatedVisited, parentPath].join(' -> '));
      break;
    }
    
    const parentRoute = validRoutes.find(r => r.path === parentPath);
    if (!parentRoute) {
      break;
    }
    
    result.unshift({
      path: parentPath,
      label: parentRoute.description
    });
    
    // Add this parent to visited paths
    updatedVisited.push(parentPath);
    
    currentPath = parentPath;
    
    // Prevent infinite loops as a safety measure
    if (result.length > 10) {
      console.warn('Possible circular reference or excessive nesting in route hierarchy:', path);
      break;
    }
  }
  
  return result;
};

/**
 * Find alternative routes for a given path
 * @param path Current route path
 * @returns Array of alternative routes
 */
export const findAlternativeRoutes = (path: string): string[] => {
  const route = validRoutes.find(r => r.path === path);
  if (!route || !route.metadata?.alternatives) {
    return [];
  }
  
  return route.metadata.alternatives;
};

/**
 * Find child routes for a given path
 * @param path Parent route path
 * @returns Array of child routes
 */
export const findChildRoutes = (path: string): RouteConfig[] => {
  return validRoutes.filter(route => 
    (route.parentRoute === path) || 
    (route.metadata?.parentPath === path)
  );
};

/**
 * Get all related routes for a path
 * @param path Current route path
 * @returns Object with parent, children, and alternatives
 */
export const getAllRelatedRoutes = (path: string): {
  parent: string | null;
  children: RouteConfig[];
  alternatives: string[];
} => {
  return {
    parent: findParentRoute(path),
    children: findChildRoutes(path),
    alternatives: findAlternativeRoutes(path)
  };
};

/**
 * Generate a breadcrumb path for a route
 * @param path Current route path
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbPath = (path: string): Array<{ path: string; label: string }> => {
  const parentRoutes = findParentRoutes(path);
  const currentRoute = validRoutes.find(r => r.path === path);
  
  if (currentRoute) {
    return [
      ...parentRoutes,
      { path, label: currentRoute.description }
    ];
  }
  
  return parentRoutes;
};
