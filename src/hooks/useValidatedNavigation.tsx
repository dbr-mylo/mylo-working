
/**
 * Enhanced navigation hook that ensures all navigation is properly validated
 * with role-based access control and error handling
 */
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isValidRoute, logNavigation } from "@/utils/navigation/routeValidation";
import { toast } from "sonner";
import { getSafeFallbackRoute } from "@/utils/navigation/NavigationUtils";

export const useValidatedNavigation = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  /**
   * Safely navigate to a route with validation, error handling and analytics
   */
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    try {
      const currentPath = window.location.pathname;
      const isValid = isValidRoute(path, role);
      
      // Log the navigation attempt
      logNavigation(
        currentPath, 
        path, 
        isValid, 
        role
      );
      
      if (isValid) {
        // Navigate to the valid route
        navigate(path, options);
        return true;
      } else {
        // Handle invalid navigation
        console.warn(`Invalid route access attempt: ${path} for role: ${role || 'unauthenticated'}`);
        
        toast.error("Cannot access this page", {
          description: "You don't have permission to access this page.",
          duration: 3000,
        });
        
        // Redirect to not-found with state information
        navigate("/not-found", { 
          replace: true, 
          state: { 
            from: path,
            message: "This page is not available for your role" 
          } 
        });
        return false;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      
      // System error handling
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
