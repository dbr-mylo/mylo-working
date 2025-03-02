
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, UserRole } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuestEditor: () => void;
  continueAsGuestDesigner: () => void;
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
    // First check if there's a guest role in localStorage
    const storedRole = localStorage.getItem('guestRole');
    
    if (storedRole) {
      console.log("Found stored guest role:", storedRole);
      // If there's a stored role, use it
      setAuthState(state => ({ 
        ...state, 
        role: storedRole as UserRole,
        isLoading: false 
      }));
    } else {
      // If no stored role, check Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchUserData(session.user.id);
        } else {
          setAuthState(state => ({ ...state, isLoading: false }));
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserData(session.user.id);
        // Clear any stored guest role when authenticated with Supabase
        localStorage.removeItem('guestRole');
      } else {
        // Check if there's a guest role when no Supabase session exists
        const storedRole = localStorage.getItem('guestRole');
        if (storedRole) {
          setAuthState({ 
            user: null, 
            role: storedRole as UserRole, 
            isLoading: false 
          });
        } else {
          setAuthState({ user: null, role: null, isLoading: false });
        }
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

      setAuthState({
        user: profile,
        role: roleData.role as UserRole,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
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
      
      // Clear any stored guest role when authenticated with Supabase
      localStorage.removeItem('guestRole');
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
      
      // Clear the guest role from localStorage when signing out
      localStorage.removeItem('guestRole');
      setAuthState({
        user: null,
        role: null,
        isLoading: false,
      });
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const continueAsGuestEditor = () => {
    const role = "editor";
    // Store the guest role in localStorage for persistence
    localStorage.setItem('guestRole', role);
    setAuthState({
      user: null,
      role: role,
      isLoading: false
    });
    toast.success("Continuing as Editor");
    navigate("/");
  };

  const continueAsGuestDesigner = () => {
    const role = "designer";
    // Store the guest role in localStorage for persistence
    localStorage.setItem('guestRole', role);
    setAuthState({
      user: null,
      role: role,
      isLoading: false
    });
    toast.success("Continuing as Designer");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      signIn, 
      signUp, 
      signOut, 
      continueAsGuestEditor, 
      continueAsGuestDesigner 
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
