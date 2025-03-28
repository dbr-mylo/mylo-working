
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  navigateWithValidation, 
  logNavigation, 
  isValidRoute,
  isTestingRoute,
  canAccessTestingRoute
} from "@/utils/navigation/routeValidation";
import { withErrorHandling } from "@/utils/errorHandling";
import { useState, useEffect } from "react";

/**
 * Navigation analytics object for tracking user journey
 */
interface NavigationAnalytics {
  /** Path the user is navigating from */
  from: string;
  /** Path the user is navigating to */
  to: string;
  /** Whether the navigation was successful */
  success: boolean;
  /** Timestamp when the navigation occurred */
  timestamp: string;
  /** Time spent on the previous page in milliseconds */
  timeOnPage?: number;
  /** User's role at time of navigation */
  userRole?: string | null;
}

/**
 * A hook that provides validated navigation capabilities
 * Ensures routes are valid and user has permission before navigating
 * Also tracks navigation for analytics purposes
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const [pageLoadTime, setPageLoadTime] = useState<number>(Date.now());
  const [navigationHistory, setNavigationHistory] = useState<NavigationAnalytics[]>([]);
  
  // Record page load time when location changes
  useEffect(() => {
    setPageLoadTime(Date.now());
    
    // Clean up function to calculate time on page when unmounting
    return () => {
      const timeOnPage = Date.now() - pageLoadTime;
      console.info(`[Analytics] Time spent on ${location.pathname}: ${timeOnPage}ms`);
    };
  }, [location.pathname]);
  
  /**
   * Track navigation event for analytics
   */
  const trackNavigation = (
    from: string, 
    to: string, 
    success: boolean
  ): void => {
    const timeOnPage = Date.now() - pageLoadTime;
    
    const analyticsData: NavigationAnalytics = {
      from,
      to,
      success,
      timestamp: new Date().toISOString(),
      timeOnPage,
      userRole: role
    };
    
    // Log for development, would send to analytics service in production
    console.info(`[Analytics] Navigation: ${from} → ${to} | Success: ${success}`);
    
    // Add to navigation history
    setNavigationHistory(prev => [...prev, analyticsData]);
    
    // This would typically send to an analytics service
    // analytics.track('navigation', analyticsData);
  };
  
  /**
   * Navigate to a new route with validation
   * @param path - The path to navigate to
   */
  const navigateTo = (path: string): void => {
    const currentPath = location.pathname;
    
    // Special handling for testing routes
    if (isTestingRoute(path)) {
      const canAccess = canAccessTestingRoute(path, role);
      trackNavigation(currentPath, path, canAccess);
      
      if (canAccess) {
        navigate(path);
      } else {
        navigate("/not-found");
      }
      return;
    }
    
    // Regular route validation
    const isValid = isValidRoute(path, role);
    trackNavigation(currentPath, path, isValid);
    
    if (isValid) {
      navigate(path);
    } else {
      navigate("/not-found");
    }
  };
  
  /**
   * Navigate back in browser history
   */
  const goBack = () => {
    const currentPath = location.pathname;
    // We don't know the destination yet, but we'll log it as success
    trackNavigation(currentPath, "previous page", true);
    navigate(-1);
  };
  
  /**
   * Check if the current route is valid for the user
   * @returns Boolean indicating if the current route is valid
   */
  const isCurrentRouteValid = (): boolean => {
    const path = location.pathname;
    
    // Special handling for testing routes
    if (isTestingRoute(path)) {
      return canAccessTestingRoute(path, role);
    }
    
    // Regular route validation
    return isValidRoute(path, role);
  };
  
  /**
   * Get navigation history for analytics and debugging
   */
  const getNavigationHistory = () => navigationHistory;
  
  /**
   * Error-handled version of navigateTo
   */
  const safeNavigateTo = withErrorHandling(
    async (path: string) => {
      navigateTo(path);
      return true;
    },
    "useValidatedNavigation.safeNavigateTo",
    "Navigation failed"
  );
  
  return {
    navigateTo,
    safeNavigateTo,
    goBack,
    isCurrentRouteValid,
    currentPath: location.pathname,
    getNavigationHistory
  };
};
