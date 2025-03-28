
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationAnalytics } from "./useNavigationAnalytics";
import { useRouteValidation } from "./useRouteValidation";
import { withErrorHandling } from "@/utils/error/withErrorHandling";

/**
 * Hook providing navigation handlers with validation and analytics
 */
export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const { validateRoute, currentPath } = useRouteValidation();
  const { trackNavigation } = useNavigationAnalytics();
  
  /**
   * Navigate to a new route with validation
   */
  const navigateTo = (path: string): void => {
    // Validate the route for the current user
    const isValid = validateRoute(path);
    
    // Track the navigation attempt
    trackNavigation(currentPath, path, isValid);
    
    // Navigate to the appropriate path
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
    // We don't know the destination yet, but we'll log it as success
    trackNavigation(currentPath, "previous page", true);
    navigate(-1);
  };
  
  /**
   * Error-handled version of navigateTo
   */
  const safeNavigateTo = withErrorHandling(
    async (path: string) => {
      navigateTo(path);
      return true;
    },
    "useNavigationHandlers.safeNavigateTo",
    "Navigation failed"
  );
  
  return {
    navigateTo,
    safeNavigateTo,
    goBack
  };
};
