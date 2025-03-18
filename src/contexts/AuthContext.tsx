
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AuthContextType, 
  AuthState
} from "@/lib/types/authTypes";
import { UserRole } from "@/lib/types";
import { RoleError } from "@/lib/errors/authErrors";
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
  clearError: () => {}
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
    continueAsGuestAdmin
  } = useGuestRole();
  
  // Initialize auth actions
  const { signIn, signUp, signOut } = useAuthActions({
    setLoading,
    clearError,
    setError,
    fetchUserData
  });
  
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
      clearError
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
