
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, UserRole } from "./types";

export function useAuthState(fetchUserData: (userId: string) => Promise<void>) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
  });

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
  }, [fetchUserData]);

  return { authState, setAuthState };
}
