
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, UserRole } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestWriter: (shouldNavigate?: boolean) => void;
  continueAsGuestDesigner: (shouldNavigate?: boolean) => void;
  continueAsGuestAdmin: (shouldNavigate?: boolean) => void;
  continueAsGuestEditor: (shouldNavigate?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for persisted role in localStorage
    const persistedRole = localStorage.getItem('userRole') as UserRole | null;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user.id);
      } else if (persistedRole) {
        // If no active session but we have a persisted role (guest mode)
        console.log(`Restoring persisted role: ${persistedRole}`);
        setAuthState(state => ({ ...state, role: persistedRole, isLoading: false }));
      } else {
        setAuthState(state => ({ ...state, isLoading: false }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserData(session.user.id);
      } else {
        // Clear role when user signs out, but check for persisted guest role
        const guestRole = localStorage.getItem('userRole') as UserRole | null;
        setAuthState({ 
          user: null, 
          role: guestRole, 
          isLoading: false 
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roleError) throw roleError;

      let userRole: UserRole = roleData.role as UserRole;
      if (userRole === 'editor') {
        console.log("Converting legacy 'editor' role to 'writer'");
        userRole = 'writer'; // Convert 'editor' to 'writer' for backward compatibility
      }

      // Persist role to localStorage for session recovery
      localStorage.setItem('userRole', userRole);
      
      setAuthState({
        user: profile,
        role: userRole,
        isLoading: false,
      });
      
      console.log(`User authenticated with role: ${userRole}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
      
      // Clear persisted role on error
      localStorage.removeItem('userRole');
      
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Check your email to confirm your account");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const continueAsGuestWriter = (shouldNavigate: boolean = true) => {
    localStorage.setItem('userRole', 'writer');
    setAuthState({
      user: null,
      role: "writer",
      isLoading: false
    });
    toast.success("Continuing as Writer");
    if (shouldNavigate) {
      navigate("/");
    }
  };

  const continueAsGuestDesigner = (shouldNavigate: boolean = true) => {
    localStorage.setItem('userRole', 'designer');
    setAuthState({
      user: null,
      role: "designer",
      isLoading: false
    });
    toast.success("Continuing as Designer");
    if (shouldNavigate) {
      navigate("/");
    }
  };

  const continueAsGuestAdmin = (shouldNavigate: boolean = true) => {
    localStorage.setItem('userRole', 'admin');
    setAuthState({
      user: null,
      role: "admin",
      isLoading: false
    });
    toast.success("Continuing as Admin");
    if (shouldNavigate) {
      navigate("/");
    }
  };

  const continueAsGuestEditor = (shouldNavigate: boolean = true) => {
    console.log("Legacy 'editor' role mapped to 'writer' role");
    localStorage.setItem('userRole', 'writer');
    setAuthState({
      user: null,
      role: "writer",
      isLoading: false
    });
    toast.success("Continuing as Writer (Editor role has been renamed)");
    if (shouldNavigate) {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      signIn, 
      signUp, 
      signOut, 
      continueAsGuestWriter,
      continueAsGuestDesigner,
      continueAsGuestAdmin,
      continueAsGuestEditor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
