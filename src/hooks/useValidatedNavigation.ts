
import { useNavigate } from "react-router-dom";
import { useRouteValidation } from "./navigation/useRouteValidation";
import { toast } from "sonner";

/**
 * Enhanced wrapper hook that combines useNavigate with route validation
 * and provides improved error handling
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const { validateRoute } = useRouteValidation();
  
  /**
   * Navigate to a route with validation and error handling
   * @param path - The route to navigate to
   * @param options - Optional navigation options
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      if (validateRoute(path)) {
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
