
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useIsDesigner, useIsWriter } from "@/utils/roles";

/**
 * Combined user information hook
 * Provides access to all user-related data including auth state and role information
 */
export const useUser = () => {
  const auth = useAuth();
  const isAdmin = useIsAdmin();
  const isDesigner = useIsDesigner();
  const isWriter = useIsWriter();
  
  return {
    // Auth context values
    user: auth.user,
    role: auth.role,
    isLoading: auth.isLoading,
    
    // Authentication methods
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    
    // Guest role methods
    continueAsGuestWriter: auth.continueAsGuestWriter,
    continueAsGuestDesigner: auth.continueAsGuestDesigner,
    continueAsGuestAdmin: auth.continueAsGuestAdmin,
    
    // Role helpers
    isAdmin,
    isDesigner, 
    isWriter,
    
    // Computed properties
    isAuthenticated: !!auth.user,
    isGuest: !auth.user && !!auth.role,
    hasValidRole: !!auth.role
  };
};
