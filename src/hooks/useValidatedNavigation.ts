
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { navigateWithValidation, logNavigation, isValidRoute } from "@/utils/navigation/routeValidation";

/**
 * A hook that provides validated navigation capabilities
 * Ensures routes are valid and user has permission before navigating
 */
export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  
  /**
   * Navigate to a new route with validation
   * @param path - The path to navigate to
   */
  const navigateTo = (path: string): void => {
    const currentPath = location.pathname;
    const isValid = isValidRoute(path, role);
    
    logNavigation(currentPath, path, isValid);
    
    if (isValid) {
      navigate(path);
    } else {
      navigate("/not-found");
    }
  };
  
  /**
   * Check if the current route is valid for the user
   * @returns Boolean indicating if the current route is valid
   */
  const isCurrentRouteValid = (): boolean => {
    return isValidRoute(location.pathname, role);
  };
  
  return {
    navigateTo,
    isCurrentRouteValid,
    currentPath: location.pathname
  };
};
