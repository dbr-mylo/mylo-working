
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Navigation analytics object for tracking user journey
 */
export interface NavigationAnalytics {
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
 * Hook for tracking navigation events and page view times
 */
export const useNavigationAnalytics = () => {
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
   * Get navigation history for analytics and debugging
   */
  const getNavigationHistory = () => navigationHistory;
  
  return {
    trackNavigation,
    getNavigationHistory
  };
};
