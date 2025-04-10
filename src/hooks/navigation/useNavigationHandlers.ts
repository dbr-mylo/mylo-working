
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationAnalytics } from "./useNavigationAnalytics";
import { useRouteValidation } from "./useRouteValidation";
import { withErrorHandling } from "@/utils/error/withErrorHandling";
import { toast } from "sonner";

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
    // Skip validation for basic paths
    const basicPaths = ["/", "/documents", "/editor", "/profile", "/settings", "/help"];
    const skipValidation = basicPaths.includes(path);
    
    // Validate the route for the current user
    const isValid = skipValidation || validateRoute(path);
    
    // Track the navigation attempt
    trackNavigation(currentPath, path, isValid);
    
    // Navigate to the appropriate path
    if (isValid) {
      navigate(path);
    } else {
      toast.error(`Cannot navigate to ${path}`, {
        description: "You don't have permission to access this page",
      });
      navigate("/not-found", {
        state: { from: currentPath, message: "Route not available for your role" }
      });
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
