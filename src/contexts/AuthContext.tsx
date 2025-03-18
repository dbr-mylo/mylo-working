
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  AuthContextType, 
  AuthState, 
  GuestRoleState,
  AuthErrorCode
} from "@/lib/types/authTypes";
import { UserRole } from "@/lib/types";
import { 
  AuthError, 
  SignInError, 
  SignUpError, 
  SignOutError, 
  SessionError,
  RoleError
} from "@/lib/errors/authErrors";

// Guest role storage key
const GUEST_ROLE_STORAGE_KEY = 'app_guest_role';

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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
    error: null
  });
  const navigate = useNavigate();

  // Clear any auth errors
  const clearError = () => {
    setAuthState(prevState => ({ ...prevState, error: null }));
  };

  // Load guest role from local storage
  const loadGuestRole = (): UserRole | null => {
    try {
      const storedRole = localStorage.getItem(GUEST_ROLE_STORAGE_KEY);
      if (storedRole) {
        const guestRoleState: GuestRoleState = JSON.parse(storedRole);
        
        // Check if the stored role is valid and not expired (24 hours)
        const isValid = Date.now() - guestRoleState.timestamp < 24 * 60 * 60 * 1000;
        
        if (isValid) {
          return guestRoleState.role;
        } else {
          // Clear expired guest role
          localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn('Error loading guest role from localStorage:', error);
    }
    return null;
  };

  // Save guest role to local storage
  const saveGuestRole = (role: UserRole): void => {
    try {
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      const guestRoleState: GuestRoleState = {
        role,
        timestamp: Date.now(),
        expiresAt
      };
      localStorage.setItem(GUEST_ROLE_STORAGE_KEY, JSON.stringify(guestRoleState));
    } catch (error) {
      console.warn('Error saving guest role to localStorage:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await fetchUserData(session.user.id);
        } else {
          // No active session, check for guest role
          const guestRole = loadGuestRole();
          
          setAuthState({
            user: null,
            role: guestRole,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        const authError = new SessionError('Error initializing authentication');
        console.error('Auth initialization error:', error);
        
        setAuthState({
          user: null,
          role: null,
          isLoading: false,
          error: authError
        });
        
        toast.error('Authentication error: Failed to initialize session');
      }
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session) {
          await fetchUserData(session.user.id);
        } else {
          // Check for guest role when session ends
          const guestRole = loadGuestRole();
          
          setAuthState({
            user: null,
            role: guestRole,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        const authError = new SessionError('Error handling auth state change');
        console.error('Auth state change error:', error);
        
        setAuthState(prevState => ({
          ...prevState,
          isLoading: false,
          error: authError
        }));
      }
    });

    // Initialize auth
    initializeAuth();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) throw roleError;

      // Update auth state with user data and role
      setAuthState({
        user: profile,
        role: roleData.role as UserRole,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      const fetchError = new SessionError("Failed to fetch user data");
      
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: fetchError
      }));
      
      toast.error("Error fetching user data. Please try signing in again.");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setAuthState(prevState => ({ ...prevState, isLoading: true }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new SignInError(error.message, { 
        code: error.code as AuthErrorCode,
        originalError: error 
      });
      
      navigate("/");
    } catch (error: any) {
      const signInError = error instanceof SignInError 
        ? error
        : new SignInError(error.message || 'Sign in failed');
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signInError
      }));
      
      toast.error(signInError.message);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setAuthState(prevState => ({ ...prevState, isLoading: true }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw new SignUpError(error.message, {
        code: error.code as AuthErrorCode,
        originalError: error
      });
      
      // Success
      setAuthState(prevState => ({ ...prevState, isLoading: false }));
      toast.success("Check your email to confirm your account");
    } catch (error: any) {
      const signUpError = error instanceof SignUpError
        ? error
        : new SignUpError(error.message || 'Sign up failed');
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signUpError
      }));
      
      toast.error(signUpError.message);
    }
  };

  const signOut = async () => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setAuthState(prevState => ({ ...prevState, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new SignOutError(error.message);
      
      // Also clear any stored guest role
      localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
      
      navigate("/auth");
    } catch (error: any) {
      const signOutError = error instanceof SignOutError
        ? error
        : new SignOutError(error.message || 'Sign out failed');
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signOutError
      }));
      
      toast.error(signOutError.message);
    }
  };

  const setGuestRole = (role: UserRole) => {
    try {
      // Validate role
      if (!['editor', 'designer', 'admin'].includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      // Save role to local storage for persistence
      saveGuestRole(role);
      
      // Update auth state
      setAuthState({
        user: null,
        role,
        isLoading: false,
        error: null
      });
      
      toast.success(`Continuing as ${role.charAt(0).toUpperCase() + role.slice(1)}`);
      navigate("/");
    } catch (error) {
      const roleError = error instanceof RoleError
        ? error
        : new RoleError('Failed to set guest role');
      
      setAuthState(prevState => ({
        ...prevState,
        error: roleError
      }));
      
      toast.error(roleError.message);
    }
  };

  const continueAsGuestEditor = () => setGuestRole("editor");
  const continueAsGuestDesigner = () => setGuestRole("designer");
  const continueAsGuestAdmin = () => setGuestRole("admin");

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
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
