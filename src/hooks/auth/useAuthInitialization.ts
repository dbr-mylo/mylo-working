
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SessionError } from "@/lib/errors/authErrors";
import { AuthErrorCode } from "@/lib/types/authTypes";
import { toast } from "sonner";

interface UseAuthInitializationProps {
  fetchUserData: (userId: string) => Promise<void>;
  loadGuestRole: () => string | null;
  setLoading: (isLoading: boolean) => void;
  setRole: (role: string | null) => void;
  setUser: (user: any | null) => void;
  setError: (error: any) => void;
}

/**
 * Hook for initializing authentication and handling auth state changes
 */
export const useAuthInitialization = ({
  fetchUserData,
  loadGuestRole,
  setLoading,
  setRole,
  setUser,
  setError
}: UseAuthInitializationProps) => {
  // Initialize auth state
  const initializeAuth = useCallback(async () => {
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
        
        setUser(null);
        setRole(guestRole);
      }
    } catch (error) {
      const authError = error instanceof SessionError
        ? error
        : new SessionError('Error initializing authentication', {
            originalError: error
          });
      
      console.error('Auth initialization error:', authError);
      
      setUser(null);
      setRole(null);
      setError(authError);
      
      toast.error(authError.getUserMessage());
    } finally {
      setLoading(false);
    }
  }, [fetchUserData, loadGuestRole, setLoading, setRole, setUser, setError]);

  // Setup auth state change listener
  useEffect(() => {
    // Initialize auth
    initializeAuth();

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
          
          setUser(null);
          setRole(guestRole);
        }
      } catch (error) {
        const authError = error instanceof SessionError
          ? error 
          : new SessionError('Error handling auth state change', {
              originalError: error
            });
        
        console.error('Auth state change error:', authError);
        
        setError(authError);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [fetchUserData, initializeAuth, loadGuestRole, setError, setLoading, setRole, setUser]);

  return { initializeAuth };
};
