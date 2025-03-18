
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthErrorCode } from "@/lib/types/authTypes";
import {
  SignInError,
  SignUpError,
  SignOutError,
  SessionError,
  mapToAuthError
} from "@/lib/errors/authErrors";

interface UseAuthActionsProps {
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
  setError: (error: any) => void;
  fetchUserData: (userId: string) => Promise<void>;
}

/**
 * Hook for auth actions (sign in, sign up, sign out)
 */
export const useAuthActions = ({
  setLoading,
  clearError,
  setError,
  fetchUserData
}: UseAuthActionsProps) => {
  const navigate = useNavigate();
  
  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setLoading(true);
      
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
      setError(signInError);
      
      toast.error(signInError.getUserMessage());
      throw signInError;
    } finally {
      setLoading(false);
    }
  }, [clearError, setLoading, setError, navigate]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw new SignUpError(error.message, {
        code: error.code as AuthErrorCode,
        originalError: error
      });
      
      // Success
      toast.success("Check your email to confirm your account");
    } catch (error: any) {
      const signUpError = error instanceof SignUpError
        ? error
        : mapToAuthError(error, "signUp");
      
      // Update error state
      setError(signUpError);
      
      toast.error(signUpError.getUserMessage());
      throw signUpError;
    } finally {
      setLoading(false);
    }
  }, [clearError, setLoading, setError]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      // Clear previous errors
      clearError();
      
      // Set loading state
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new SignOutError(error.message, {
        originalError: error
      });
      
      navigate("/auth");
    } catch (error: any) {
      const signOutError = error instanceof SignOutError
        ? error
        : mapToAuthError(error, "signOut");
      
      // Update error state
      setError(signOutError);
      
      toast.error(signOutError.getUserMessage());
      throw signOutError;
    } finally {
      setLoading(false);
    }
  }, [clearError, setLoading, setError, navigate]);

  return {
    signIn,
    signUp,
    signOut
  };
};
