
import { useAuth } from "@/contexts/AuthContext";
import { isValidRoute, canAccessTestingRoute, isTestingRoute } from "@/utils/navigation/routeValidation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    // Special handling for testing routes
    if (isTestingRoute(path)) {
      return canAccessTestingRoute(path, role);
    }
    
    return isValidRoute(path, role);
  };
  
  /**
   * Navigate to a route with validation and error handling
   * @param path Route to navigate to
   * @param options Navigation options
   */
  const navigateWithValidation = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      if (validateRoute(path)) {
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
      console.error("Navigation validation error:", error);
      return false;
    }
  };
  
  return {
    validateRoute,
    navigateWithValidation
  };
};

