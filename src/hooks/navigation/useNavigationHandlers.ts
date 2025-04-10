
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isValidRoute, logNavigation } from "@/utils/navigation/routeValidation";
import { toast } from "sonner";
import { getSafeFallbackRoute } from "@/utils/navigation/NavigationUtils";

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
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      const currentPath = window.location.pathname;
      const isValid = isValidRoute(path, role);
      
      // Log the navigation attempt for analytics
      logNavigation(currentPath, path, isValid, role);
      
      if (isValid) {
        navigate(path, options);
        return true;
      } else {
        toast.error(`Cannot navigate to ${path}`, {
          description: "This route is not available for your role",
          duration: 3000,
        });
        console.warn(`Invalid navigation attempt to ${path} by role: ${role || 'unauthenticated'}`);
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
      console.error("Navigation error:", error);
      toast.error("Navigation error", {
        description: "There was a problem navigating to the requested page",
        duration: 3000,
      });
      
      // Fallback to a safe route based on role
      const fallbackRoute = getSafeFallbackRoute(role);
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
    const homePath = getSafeFallbackRoute(role);
    navigate(homePath);
  };
  
  return {
    navigateTo,
    goBack,
    goHome
  };
};
