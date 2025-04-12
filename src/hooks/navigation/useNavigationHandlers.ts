
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType } from "@/utils/navigation/types";

/**
 * Hook to provide consistent navigation handlers across the application
 * with improved error handling and analytics
 */
export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  /**
   * Navigate to a route with validation, error handling, and analytics
   * @param path Route to navigate to
   * @param options Navigation options
   * @returns Boolean indicating if navigation was successful
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }): boolean => {
    try {
      const currentPath = window.location.pathname;
      const isValid = navigationService.validateRoute(path, role);
      
      // Log the navigation attempt for analytics
      navigationService.logNavigationEvent(currentPath, path, isValid, role);
      
      if (isValid) {
        navigate(path, options);
        return true;
      } else {
        // Error handling for invalid navigation
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
            message: "This route is not available for your role" 
          } 
        });
        return false;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      
      // Show generic error toast
      toast.error("Navigation error", {
        description: "There was a problem navigating to the requested page",
        duration: 3000,
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
   * @returns Boolean indicating if navigation was successful
   */
  const goHome = (): boolean => {
    const homePath = navigationService.getDefaultRoute(role);
    return navigateTo(homePath);
  };
  
  return {
    navigateTo,
    goBack,
    goHome
  };
};
