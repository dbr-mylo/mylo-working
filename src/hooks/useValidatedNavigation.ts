
import { useNavigationAnalytics } from "./navigation/useNavigationAnalytics";
import { useRouteValidation } from "./navigation/useRouteValidation";
import { useNavigationHandlers } from "./navigation/useNavigationHandlers";

/**
 * A hook that provides validated navigation capabilities
 * Ensures routes are valid and user has permission before navigating
 * Also tracks navigation for analytics purposes
 */
export const useValidatedNavigation = () => {
  const { validateRoute, isCurrentRouteValid, currentPath } = useRouteValidation();
  const { trackNavigation, getNavigationHistory } = useNavigationAnalytics();
  const { navigateTo, safeNavigateTo, goBack } = useNavigationHandlers();
  
  return {
    // Navigation handlers
    navigateTo,
    safeNavigateTo,
    goBack,
    
    // Route validation
    isCurrentRouteValid,
    currentPath,
    
    // Analytics
    getNavigationHistory
  };
};

// Export the analytics interface for consumers
export { type NavigationAnalytics } from "./navigation/useNavigationAnalytics";
