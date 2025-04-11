
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  sessionRecoveryService, 
  SessionRecoveryResult 
} from '@/services/recovery/SessionRecoveryService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Hook options for session recovery
 */
export interface UseSessionRecoveryOptions {
  /** Automatically handle auth errors */
  autoHandleErrors?: boolean;
  /** Show toast notifications for recovery attempts */
  showNotifications?: boolean;
  /** Redirect path for authentication failures */
  authRedirectPath?: string;
}

/**
 * Hook for session recovery and authentication error handling
 */
export function useSessionRecovery(options: UseSessionRecoveryOptions = {}) {
  const {
    autoHandleErrors = true,
    showNotifications = true,
    authRedirectPath = '/auth'
  } = options;
  
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  
  /**
   * Handle auth error with session recovery
   */
  const handleAuthError = useCallback(async (
    error: unknown, 
    context: string
  ): Promise<SessionRecoveryResult> => {
    setIsRecovering(true);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      const result = await sessionRecoveryService.handleAuthError(error, context);
      
      if (!result.recovered && result.shouldRedirect) {
        if (showNotifications) {
          toast.error('Authentication error', { 
            description: 'Please sign in again to continue.' 
          });
        }
        
        // If we need to redirect for auth, sign out and navigate
        await signOut();
        navigate(result.redirectTo || authRedirectPath, { 
          state: { from: window.location.pathname } 
        });
      }
      
      return result;
    } finally {
      setIsRecovering(false);
    }
  }, [navigate, authRedirectPath, showNotifications, signOut]);
  
  /**
   * Manually attempt to recover session
   */
  const recoverSession = useCallback(async (): Promise<SessionRecoveryResult> => {
    setIsRecovering(true);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      const result = await sessionRecoveryService.recoverSession();
      
      if (!result.recovered && result.shouldRedirect) {
        if (showNotifications) {
          toast.error('Session expired', { 
            description: 'Please sign in again to continue.' 
          });
        }
        
        // If we need to redirect for auth, sign out and navigate
        await signOut();
        navigate(result.redirectTo || authRedirectPath, { 
          state: { from: window.location.pathname } 
        });
      }
      
      return result;
    } finally {
      setIsRecovering(false);
    }
  }, [navigate, authRedirectPath, showNotifications, signOut]);
  
  /**
   * Reset recovery attempts counter
   */
  const resetRecoveryAttempts = useCallback(() => {
    setRecoveryAttempts(0);
    sessionRecoveryService.resetRecoveryAttempts();
  }, []);
  
  /**
   * Get current auth service status from circuit breaker
   */
  const getAuthServiceStatus = useCallback(() => {
    return sessionRecoveryService.getAuthServiceStatus();
  }, []);
  
  // Reset recovery attempts when user changes
  useEffect(() => {
    resetRecoveryAttempts();
  }, [user, resetRecoveryAttempts]);

  return {
    handleAuthError,
    recoverSession,
    resetRecoveryAttempts,
    getAuthServiceStatus,
    isRecovering,
    recoveryAttempts
  };
}
