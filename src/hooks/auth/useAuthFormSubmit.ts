
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFormValidation } from './useAuthFormValidation';

interface UseAuthFormSubmitProps {
  email: string;
  password: string;
  setSubmitting: (isSubmitting: boolean) => void;
}

/**
 * Hook for handling authentication form submission
 */
export const useAuthFormSubmit = ({
  email,
  password,
  setSubmitting
}: UseAuthFormSubmitProps) => {
  const { signIn, signUp } = useAuth();
  const { validateForm } = useAuthFormValidation();

  // Handle form submission
  const handleSubmit = useCallback(async (action: "signin" | "signup") => {
    try {
      // Validate form
      if (!validateForm(email, password)) {
        return;
      }
      
      // Set submitting state
      setSubmitting(true);
      
      // Perform authentication action
      if (action === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      // Error is handled by the auth context
      console.error(`Auth ${action} error:`, error);
    } finally {
      setSubmitting(false);
    }
  }, [email, password, signIn, signUp, validateForm, setSubmitting]);

  return { handleSubmit };
};
