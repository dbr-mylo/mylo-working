
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AuthContextType, 
  AuthState
} from "@/lib/types/authTypes";
import { UserRole } from "@/lib/types";
import { RoleError } from "@/lib/errors/authErrors";
import { supabase } from "@/integrations/supabase/client";
import { 
  useAuthState, 
  useAuthActions, 
  useGuestRole, 
  useUserData,
  useAuthInitialization
} from "@/hooks/auth";

// Default auth context value
const defaultAuthContext: AuthContextType = {
  user: null,
  role: null,
  isLoading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  continueAsGuestEditor: () => {},
  continueAsGuestDesigner: () => {},
  continueAsGuestAdmin: () => {},
  clearError: () => {},
  clearGuestRole: () => false,
  isAuthenticated: false,
  refreshUserData: async () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  // Initialize auth state
  const {
    user,
    role,
    isLoading,
    error,
    updateAuthState,
    setUser,
    setRole,
    setLoading,
    setError,
    clearError
  } = useAuthState();
  
  // Initialize user data handling
  const { fetchUserData } = useUserData({
    setUser,
    setRole,
    setError
  });
  
  // Initialize guest role handling
  const {
    loadGuestRole,
    continueAsGuestEditor,
    continueAsGuestDesigner,
    continueAsGuestAdmin,
    clearGuestRole
  } = useGuestRole();
  
  // Initialize auth actions
  const { signIn, signUp, signOut } = useAuthActions({
    setLoading,
    clearError,
    setError,
    fetchUserData,
    clearGuestRole
  });
  
  // Check if the user is authenticated (has user or guest role)
  const isAuthenticated = !isLoading && (user !== null || role !== null);

  // Add the refreshUserData function to fetch the latest user data
  const refreshUserData = async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (session && session.user) {
        await fetchUserData(session.user.id);
        return;
      }
      
      // If no session, check for guest role
      const guestRole = loadGuestRole();
      setRole(guestRole);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setError(error);
    }
  };

  // Initialize auth state and listeners
  useAuthInitialization({
    fetchUserData,
    loadGuestRole,
    setLoading,
    setRole,
    setUser,
    setError
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isLoading, 
      error, 
      signIn, 
      signUp, 
      signOut, 
      continueAsGuestEditor, 
      continueAsGuestDesigner,
      continueAsGuestAdmin,
      clearError,
      clearGuestRole,
      isAuthenticated,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new RoleError("useAuth must be used within an AuthProvider");
  }
  return context;
};
