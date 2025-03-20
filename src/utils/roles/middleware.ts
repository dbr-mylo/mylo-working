
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Role validation middleware
 * Used to protect routes requiring specific roles
 */

/**
 * Hook to validate if user has required role
 * @param requiredRole Role required to access the route/feature
 * @param redirectTo Path to redirect to if validation fails
 * @returns Object containing validation state and error handling function
 */
export const useRoleValidation = (
  requiredRole: UserRole | UserRole[],
  redirectTo: string = "/auth"
) => {
  const { role, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Convert single role to array for unified processing
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Check if current role is in required roles
  const isAuthorized = !isLoading && role !== null && requiredRoles.includes(role);
  
  // Check if authenticated (has user or guest role)
  const isAuthenticated = !isLoading && (user !== null || role !== null);

  // Validation error handler
  const handleUnauthorized = (message: string = "You don't have permission to access this page") => {
    toast.error(message);
    navigate(redirectTo);
  };

  return {
    isAuthorized,
    isAuthenticated,
    isLoading,
    handleUnauthorized
  };
};

/**
 * Hook to validate if user has designer role
 * @param redirectTo Path to redirect to if validation fails
 * @returns Object containing validation state and error handling function
 */
export const useDesignerValidation = (redirectTo: string = "/") => {
  return useRoleValidation('designer', redirectTo);
};

/**
 * Hook to validate if user is authenticated
 * @param redirectTo Path to redirect to if validation fails
 * @returns Object containing validation state and error handling function
 */
export const useAuthValidation = (redirectTo: string = "/auth") => {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if authenticated (has user or guest role)
  const isAuthenticated = !isLoading && (user !== null || role !== null);

  // Validation error handler
  const handleUnauthenticated = (message: string = "Please sign in to continue") => {
    toast.error(message);
    navigate(redirectTo);
  };

  return {
    isAuthenticated,
    isLoading,
    handleUnauthenticated
  };
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useDesignerValidation instead
 */
export const useAdminValidation = useDesignerValidation;
