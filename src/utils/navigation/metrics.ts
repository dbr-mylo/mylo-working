
import { validRoutes } from './routeConfig';
import { getNavigationEvents } from './analytics';

/**
 * Get performance metrics for routes
 * Used for monitoring navigation performance
 */
export const getRoutePerformanceMetrics = () => {
  // This would be populated with actual metrics in a production app
  const routeMetrics = validRoutes.reduce((acc, route) => {
    if (route.trackAdvancedMetrics) {
      acc[route.path] = {
        averageLoadTime: Math.floor(Math.random() * 300 + 100), // Placeholder data
        errorRate: Math.random() * 0.05, // Placeholder data
        trafficVolume: Math.floor(Math.random() * 100), // Placeholder data
      };
    }
    return acc;
  }, {} as Record<string, { averageLoadTime: number, errorRate: number, trafficVolume: number }>);
  
  return routeMetrics;
};

/**
 * Get navigation patterns for a specific user role
 * Used for analytics and UX improvements
 */
export const getRoleNavigationPatterns = (role?: string | null) => {
  if (!role) return [];
  
  // Filter events to only include those for the specified role
  const roleEvents = getNavigationEvents().filter(e => e.userRole === role && e.success);
  
  // Calculate common paths
  const pathCounts: Record<string, number> = {};
  roleEvents.forEach(event => {
    pathCounts[event.to] = (pathCounts[event.to] || 0) + 1;
  });
  
  // Calculate common transitions (from -> to)
  const transitionCounts: Record<string, number> = {};
  roleEvents.forEach(event => {
    const transition = `${event.from} -> ${event.to}`;
    transitionCounts[transition] = (transitionCounts[transition] || 0) + 1;
  });
  
  // Return the most common paths and transitions
  return {
    commonPaths: Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count })),
    commonTransitions: Object.entries(transitionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([transition, count]) => ({ transition, count }))
  };
};
