
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType } from "@/utils/navigation/types";

/**
 * Enhanced wrapper hook that combines useNavigate with route validation
 * and provides improved error handling and analytics
 * 
 * @deprecated Use useNavigationHandlers instead
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  /**
   * Navigate to a route with validation, error handling, and analytics
   * @param path - The route to navigate to
   * @param options - Optional navigation options
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      const currentPath = window.location.pathname;
      const isValid = navigationService.validateRoute(path, role);
      
      // Log the navigation attempt for analytics
      navigationService.logNavigationEvent(currentPath, path, isValid, role);
      
      if (isValid) {
        navigate(path, options);
        return true;
      } else {
        // Handle unauthorized access
        navigationService.handleNavigationError({
          type: NavigationErrorType.UNAUTHORIZED,
          path,
          message: `Route ${path} not available for role ${role}`,
          role
        });
        
        navigate("/not-found", { 
          replace: true, 
          state: { 
            from: path,
            message: "This route is not available for your role" 
          } 
        });
        return false;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      
      // Handle general navigation error
      navigationService.handleNavigationError({
        type: NavigationErrorType.SERVER_ERROR,
        path,
        message: "There was a problem during navigation",
        role
      });
      
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
    return navigateTo(homePath);
  };
  
  return {
    navigateTo,
    goBack,
    goHome
  };
};
