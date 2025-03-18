
import { useState, useCallback } from "react";
import { AuthState, UserProfile } from "@/lib/types/authTypes";
import { UserRole } from "@/lib/types";
import { AuthError } from "@/lib/errors/authErrors";

/**
 * Hook for managing authentication state
 */
export const useAuthState = (initialState: AuthState = {
  user: null,
  role: null,
  isLoading: true,
  error: null
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Update the entire auth state
  const updateAuthState = useCallback((newState: Partial<AuthState>) => {
    setAuthState(prevState => ({
      ...prevState,
      ...newState
    }));
  }, []);

  // Set the authenticated user
  const setUser = useCallback((user: UserProfile | null) => {
    setAuthState(prevState => ({
      ...prevState,
      user
    }));
  }, []);

  // Set the user role
  const setRole = useCallback((role: UserRole | null) => {
    setAuthState(prevState => ({
      ...prevState,
      role
    }));
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setAuthState(prevState => ({
      ...prevState,
      isLoading
    }));
  }, []);

  // Set error state
  const setError = useCallback((error: AuthError | null) => {
    setAuthState(prevState => ({
      ...prevState,
      error
    }));
  }, []);

  // Clear any auth errors
  const clearError = useCallback(() => {
    setAuthState(prevState => ({ 
      ...prevState, 
      error: null 
    }));
  }, []);

  return {
    ...authState,
    updateAuthState,
    setUser,
    setRole,
    setLoading,
    setError,
    clearError
  };
};
