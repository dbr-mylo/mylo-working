
import { useState, useEffect } from 'react';
import { AuthError } from '@/lib/errors/authErrors';
import { useToast } from '@/hooks/use-toast';

interface UseAuthErrorDisplayProps {
  error: Error | null;
  clearError: () => void;
  autoHideDelay?: number;
}

export const useAuthErrorDisplay = ({
  error,
  clearError,
  autoHideDelay = 5000
}: UseAuthErrorDisplayProps) => {
  const { toast } = useToast();
  const [dismissedErrors, setDismissedErrors] = useState<string[]>([]);
  
  // Auto hide errors after delay
  useEffect(() => {
    if (error && !dismissedErrors.includes(error.message)) {
      const timer = setTimeout(() => {
        clearError();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [error, clearError, autoHideDelay, dismissedErrors]);
  
  // Show toast for auth errors
  useEffect(() => {
    if (error && !dismissedErrors.includes(error.message)) {
      const errorMessage = error instanceof AuthError 
        ? error.getUserMessage() 
        : error.message;
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [error, toast, dismissedErrors]);
  
  // Handle dismissing specific errors
  const dismissError = () => {
    if (error) {
      setDismissedErrors(prev => [...prev, error.message]);
      clearError();
    }
  };
  
  // Reset dismissed errors
  const resetDismissedErrors = () => {
    setDismissedErrors([]);
  };
  
  return {
    dismissError,
    resetDismissedErrors,
    isDismissed: error ? dismissedErrors.includes(error.message) : false
  };
};
