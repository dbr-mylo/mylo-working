
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFormState } from '@/lib/types/authTypes';
import { toast } from 'sonner';

export const useAuthForm = () => {
  // Initialize form state
  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    isSubmitting: false,
    activeTab: 'signin'
  });

  // Get auth context
  const { 
    signIn, 
    signUp, 
    isLoading, 
    error, 
    clearError 
  } = useAuth();

  // Reset form errors when tab changes
  useEffect(() => {
    clearError();
  }, [formState.activeTab, clearError]);

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
    clearError();
  }, [clearError]);

  // Validate form data
  const validateForm = useCallback((): boolean => {
    // Check for empty fields
    if (!formState.email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!formState.password) {
      toast.error('Password is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Basic password validation
    if (formState.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  }, [formState.email, formState.password]);

  // Handle form submission
  const handleSubmit = useCallback(async (action: "signin" | "signup") => {
    try {
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      // Set submitting state
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      
      // Perform authentication action
      if (action === 'signin') {
        await signIn(formState.email, formState.password);
      } else {
        await signUp(formState.email, formState.password);
      }
    } catch (error) {
      // Error is handled by the auth context
      console.error(`Auth ${action} error:`, error);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.email, formState.password, signIn, signUp, validateForm]);

  // Determine if any loading is happening
  const isAuthLoading = isLoading || formState.isSubmitting;

  return {
    formState,
    isAuthLoading,
    error,
    handleInputChange,
    handleTabChange,
    handleSubmit
  };
};
