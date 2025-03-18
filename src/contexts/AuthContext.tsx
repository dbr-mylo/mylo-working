
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
  RoleError,
  StorageError,
  mapToAuthError,
  getUserFriendlyErrorMessage
} from "@/lib/errors/authErrors";

// Guest role storage key
const GUEST_ROLE_STORAGE_KEY = 'app_guest_role';
// Default expiration time for guest roles (24 hours)
const GUEST_ROLE_EXPIRY = 24 * 60 * 60 * 1000;

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

  // Load guest role from local storage with improved validation
  const loadGuestRole = (): UserRole | null => {
    try {
      const storedRole = localStorage.getItem(GUEST_ROLE_STORAGE_KEY);
      if (!storedRole) return null;
      
      // Parse with error handling
      let guestRoleState: GuestRoleState;
      try {
        guestRoleState = JSON.parse(storedRole);
      } catch (error) {
        console.warn('Invalid guest role data in localStorage, clearing it');
        localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        return null;
      }
      
      // Validate structure and content
      if (!guestRoleState || 
          typeof guestRoleState !== 'object' || 
          !('role' in guestRoleState) || 
          !('timestamp' in guestRoleState) ||
          !('expiresAt' in guestRoleState)) {
        console.warn('Malformed guest role data, clearing it');
        localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        return null;
      }
      
      // Validate role value
      if (!['editor', 'designer', 'admin'].includes(guestRoleState.role)) {
        console.warn('Invalid role in guest role data, clearing it');
        localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        return null;
      }
      
      // Check for expiration
      const now = Date.now();
      if (now >= guestRoleState.expiresAt) {
        console.log('Guest role expired, clearing it');
        localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
        return null;
      }
      
      return guestRoleState.role;
    } catch (error) {
      const storageError = new StorageError('Error loading guest role from localStorage', {
        originalError: error
      });
      console.warn(storageError.message, error);
      return null;
    }
  };

  // Save guest role to local storage with better error handling
  const saveGuestRole = (role: UserRole): void => {
    try {
      // Validate role before saving
      if (!['editor', 'designer', 'admin'].includes(role)) {
        throw new RoleError(`Invalid role: ${role}`);
      }
      
      const expiresAt = Date.now() + GUEST_ROLE_EXPIRY;
      const guestRoleState: GuestRoleState = {
        role,
        timestamp: Date.now(),
        expiresAt
      };
      localStorage.setItem(GUEST_ROLE_STORAGE_KEY, JSON.stringify(guestRoleState));
    } catch (error) {
      const storageError = error instanceof AuthError
        ? error
        : new StorageError('Failed to save guest role', { originalError: error });
      console.warn(storageError.message, error);
      
      // Still attempt to set the role in the auth state even if storage fails
      setAuthState(prevState => ({
        ...prevState,
        role,
        error: storageError
      }));
      
      toast.error('Failed to save your guest session. Your role will be lost when you close the browser.');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new SessionError(sessionError.message, {
            code: sessionError.code as AuthErrorCode,
            originalError: sessionError
          });
        }
        
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
        const authError = error instanceof AuthError
          ? error
          : new SessionError('Error initializing authentication', {
              originalError: error
            });
        
        console.error('Auth initialization error:', authError);
        
        setAuthState({
          user: null,
          role: null,
          isLoading: false,
          error: authError
        });
        
        toast.error(authError.getUserMessage());
      }
    };

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log(`Auth state changed: ${event}`);
        
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
        const authError = error instanceof AuthError
          ? error 
          : new SessionError('Error handling auth state change', {
              originalError: error
            });
        
        console.error('Auth state change error:', authError);
        
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

      if (profileError) {
        throw new SessionError('Failed to fetch user profile', {
          originalError: profileError
        });
      }

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) {
        throw new RoleError('Failed to fetch user role', {
          originalError: roleError
        });
      }

      // Update auth state with user data and role
      setAuthState({
        user: profile,
        role: roleData.role as UserRole,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      const fetchError = error instanceof AuthError
        ? error
        : new SessionError("Failed to fetch user data", {
            originalError: error
          });
      
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: fetchError
      }));
      
      toast.error(fetchError.getUserMessage());
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
        : mapToAuthError(error, "signIn");
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signInError
      }));
      
      toast.error(signInError.getUserMessage());
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
        : mapToAuthError(error, "signUp");
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signUpError
      }));
      
      toast.error(signUpError.getUserMessage());
    }
  };

  const signOut = async () => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setAuthState(prevState => ({ ...prevState, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new SignOutError(error.message, {
        originalError: error
      });
      
      // Also clear any stored guest role
      localStorage.removeItem(GUEST_ROLE_STORAGE_KEY);
      
      navigate("/auth");
    } catch (error: any) {
      const signOutError = error instanceof SignOutError
        ? error
        : mapToAuthError(error, "signOut");
      
      // Update error state
      setAuthState(prevState => ({
        ...prevState,
        isLoading: false,
        error: signOutError
      }));
      
      toast.error(signOutError.getUserMessage());
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
        : new RoleError('Failed to set guest role', {
            originalError: error
          });
      
      setAuthState(prevState => ({
        ...prevState,
        error: roleError
      }));
      
      toast.error(roleError.getUserMessage());
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
