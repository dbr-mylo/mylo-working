
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType } from "@/utils/navigation/types";

/**
 * Enhanced navigation hook that ensures all navigation is properly validated
 * with role-based access control and error handling
 * 
 * @deprecated Use useNavigationHandlers instead
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  /**
   * Safely navigate to a route with validation, error handling and analytics
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      const currentPath = window.location.pathname;
      const isValid = navigationService.validateRoute(path, role);
      
      // Log the navigation attempt
      navigationService.logNavigationEvent(
        currentPath, 
        path, 
        isValid, 
        role
      );
      
      if (isValid) {
        // Navigate to the valid route
        navigate(path, options);
        return true;
      } else {
        // Handle invalid navigation
        console.warn(`Invalid route access attempt: ${path} for role: ${role || 'unauthenticated'}`);
        
        // Handle the error
        navigationService.handleNavigationError({
          type: NavigationErrorType.UNAUTHORIZED,
          path,
          message: `Route ${path} not available for role ${role}`,
          role
        });
        
        // Redirect to not-found with state information
        navigate("/not-found", { 
          replace: true, 
          state: { 
            from: path,
            message: "This page is not available for your role" 
          } 
        });
        return false;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      
      // Handle generic errors
      navigationService.handleNavigationError({
        type: NavigationErrorType.SERVER_ERROR,
        path,
        message: "An unexpected error occurred during navigation",
        role
      });
      
      // Fallback to a safe route based on role
      const fallbackRoute = navigationService.getFallbackRoute(role);
      navigate(fallbackRoute, { replace: true });
      return false;
    }
  };
  
  /**
   * Navigate back safely
   */
  const goBack = () => {
    navigate(-1);
  };
  
  /**
   * Navigate to homepage based on role
   */
  const goHome = () => {
    const homePath = navigationService.getDefaultRoute(role);
    navigate(homePath);
  };
  
  return {
    navigateTo,
    goBack,
    goHome
  };
};
