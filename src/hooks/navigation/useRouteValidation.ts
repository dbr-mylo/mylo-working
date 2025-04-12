
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType } from "@/utils/navigation/types";

/**
 * Hook to validate routes based on user role with enhanced error handling
 */
export const useRouteValidation = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  
  /**
   * Validate if a route is accessible for the current user
   * @param path Route path to validate
   * @returns Boolean indicating if the route is valid
   */
  const validateRoute = (path: string): boolean => {
    return navigationService.validateRoute(path, role);
  };
  
  /**
   * Navigate to a route with validation and error handling
   * @param path Route to navigate to
   * @param options Navigation options
   */
  const navigateWithValidation = (path: string, options?: { replace?: boolean; state?: any }): boolean => {
    try {
      const isValid = validateRoute(path);
      
      // Log the navigation attempt
      const currentPath = window.location.pathname;
      navigationService.logNavigationEvent(currentPath, path, isValid, role);
      
      if (isValid) {
        navigate(path, options);
        return true;
      } else {
        // Handle unauthorized access
        navigationService.handleNavigationError({
          type: NavigationErrorType.UNAUTHORIZED,
          path,
          message: `Cannot navigate to ${path} - permission denied`,
          role
        });
        
        // Redirect to not-found with context
        navigate("/not-found", { 
          replace: true, 
          state: { 
            from: path,
            message: "Route not available for your role" 
          } 
        });
        return false;
      }
    } catch (error) {
      console.error("Navigation validation error:", error);
      
      // Handle general error
      navigationService.handleNavigationError({
        type: NavigationErrorType.SERVER_ERROR,
        path,
        message: "An unexpected error occurred during navigation",
        role
      });
      
      return false;
    }
  };
  
  return {
    validateRoute,
    navigateWithValidation
  };
};
