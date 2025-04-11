
import { useNavigate } from "react-router-dom";
import { useValidatedNavigation } from "@/hooks/useValidatedNavigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to provide consistent navigation handlers across the application
 */
export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const { navigateTo: validatedNavigate } = useValidatedNavigation();
  const { role } = useAuth();
  
  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    validatedNavigate(path, options);
  };
  
  return {
    navigateTo
  };
};
