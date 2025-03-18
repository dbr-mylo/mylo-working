
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFormState } from './useAuthFormState';
import { useAuthFormSubmit } from './useAuthFormSubmit';

/**
 * Combined hook for authentication form handling
 */
export const useAuthForm = () => {
  // Get auth context
  const { 
    isLoading, 
    error, 
    clearError 
  } = useAuth();

  // Use form state hook
  const {
    formState,
    handleInputChange,
    handleTabChange,
    setSubmitting
  } = useAuthFormState();

  // Use form submission hook
  const { handleSubmit } = useAuthFormSubmit({
    email: formState.email,
    password: formState.password,
    setSubmitting
  });

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
