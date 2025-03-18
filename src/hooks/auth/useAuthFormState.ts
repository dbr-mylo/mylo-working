
import { useState, useCallback } from 'react';
import { AuthFormState } from '@/lib/types/authTypes';

/**
 * Hook to manage authentication form state
 */
export const useAuthFormState = () => {
  // Initialize form state
  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    isSubmitting: false,
    activeTab: 'signin'
  });

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.split('-')[1]; // Extract field name from id (e.g., "signin-email" -> "email")
    
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle tab changes
  const handleTabChange = useCallback((tab: "signin" | "signup") => {
    setFormState(prev => ({
      ...prev,
      activeTab: tab,
      isSubmitting: false
    }));
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({
      ...prev,
      isSubmitting
    }));
  }, []);

  return {
    formState,
    handleInputChange,
    handleTabChange,
    setSubmitting
  };
};
