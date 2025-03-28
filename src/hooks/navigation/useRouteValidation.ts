
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  isValidRoute,
  isTestingRoute,
  canAccessTestingRoute
} from "@/utils/navigation/routeValidation";

/**
 * Hook for validating routes based on user roles
 */
export const useRouteValidation = () => {
  const location = useLocation();
  const { role } = useAuth();
  
  /**
   * Validate if a specific path is valid for the current user
   */
  const validateRoute = (path: string): boolean => {
    // Special handling for testing routes
    if (isTestingRoute(path)) {
      return canAccessTestingRoute(path, role);
    }
    
    // Regular route validation
    return isValidRoute(path, role);
  };
  
  /**
   * Check if the current route is valid for the user
   */
  const isCurrentRouteValid = (): boolean => {
    return validateRoute(location.pathname);
  };
  
  return {
    validateRoute,
    isCurrentRouteValid,
    currentPath: location.pathname
  };
};
