
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isValidRoute, logNavigation } from "@/utils/navigation/routeValidation";

export const RouteValidator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  React.useEffect(() => {
    const isValid = isValidRoute(location.pathname, role);
    
    logNavigation(
      location.state?.from || "unknown", 
      location.pathname, 
      isValid,
      role
    );
    
    if (!isValid && location.pathname !== "/not-found") {
      console.warn(`Invalid route detected: ${location.pathname} for role: ${role || 'unauthenticated'}`);
      navigate("/not-found", { 
        state: { 
          from: location.pathname, 
          message: "Route not available for your role" 
        } 
      });
    }
  }, [location.pathname, role, navigate, location.state]);
  
  return null;
};

export default RouteValidator;
