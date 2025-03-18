
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for validating authentication form data
 */
export const useAuthFormValidation = () => {
  // Validate form data
  const validateForm = useCallback((email: string, password: string): boolean => {
    // Check for empty fields
    if (!email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!password) {
      toast.error('Password is required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Basic password validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  }, []);

  return { validateForm };
};
