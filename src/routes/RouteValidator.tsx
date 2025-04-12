
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType } from "@/utils/navigation/types";

/**
 * Route validator component that checks all navigation attempts
 * and redirects to appropriate pages based on role permissions
 */
export const RouteValidator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  React.useEffect(() => {
    const currentPath = location.pathname;
    const isValid = navigationService.validateRoute(currentPath, role);
    
    // Log the navigation attempt
    navigationService.logNavigationEvent(
      location.state?.from || "direct_access", 
      currentPath, 
      isValid,
      role,
      isValid ? undefined : "Route not available for role"
    );
    
    if (!isValid && currentPath !== "/not-found") {
      console.warn(`Invalid route detected: ${currentPath} for role: ${role || 'unauthenticated'}`);
      
      // Handle the unauthorized access
      navigationService.handleNavigationError({
        type: NavigationErrorType.UNAUTHORIZED,
        path: currentPath,
        message: `Route ${currentPath} not available for role ${role || 'unauthenticated'}`,
        role
      });
      
      // Redirect to not-found page with context
      navigate("/not-found", { 
        state: { 
          from: currentPath, 
          message: "Route not available for your role" 
        } 
      });
    }
  }, [location.pathname, role, navigate, location.state]);
  
  return null;
};

export default RouteValidator;
