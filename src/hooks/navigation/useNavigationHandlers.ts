
import { useNavigate } from "react-router-dom";
import { useRouteValidation } from "@/hooks/navigation/useRouteValidation";
import { useAuth } from "@/contexts/AuthContext";
import { logNavigation } from "@/utils/navigation/routeValidation";
import { toast } from "sonner";

/**
 * Hook to provide consistent navigation handlers across the application
 * with improved error handling and analytics
 */
export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const { validateRoute, navigateWithValidation } = useRouteValidation();
  const { role } = useAuth();
  
  /**
   * Navigate to a route with validation, error handling, and analytics
   * @param path Route to navigate to
   * @param options Navigation options
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      const currentPath = window.location.pathname;
      const isValid = validateRoute(path);
      
      // Log the navigation attempt for analytics
      logNavigation(currentPath, path, isValid, role);
      
      if (isValid) {
        navigate(path, options);
      } else {
        toast.error(`Cannot navigate to ${path}`, {
          description: "This route is not available for your role",
          duration: 3000,
        });
        console.warn(`Invalid navigation attempt to ${path}`);
        navigate("/not-found", { 
          replace: true, 
          state: { 
            from: path,
            message: "Route not available for your role" 
          } 
        });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation error", {
        description: "There was a problem navigating to the requested page",
        duration: 3000,
      });
    }
  };
  
  return {
    navigateTo
  };
};

