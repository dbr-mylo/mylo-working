
import { useAuth } from "@/contexts/AuthContext";
import { isValidRoute } from "@/utils/navigation/routeValidation";

/**
 * Hook to validate routes based on user role
 */
export const useRouteValidation = () => {
  const { role } = useAuth();
  
  /**
   * Validate if a route is accessible for the current user
   */
  const validateRoute = (path: string): boolean => {
    return isValidRoute(path, role);
  };
  
  return {
    validateRoute
  };
};
