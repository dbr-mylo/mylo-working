
import React, { useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { handleError } from "@/utils/error/handleError";
import { toast } from "sonner"; 
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import { useOnlineStatus } from './useOnlineStatus';
import { useFeatureFlags } from './useFeatureFlags';

/**
 * A hook to handle errors with role-specific messaging
 */
export function useRoleAwareErrorHandling() {
  const { role } = useAuth();
  const { isOnline } = useOnlineStatus();
  const { isEnabled } = useFeatureFlags();
  
  const handleRoleAwareError = useCallback((
    error: unknown,
    context: string,
    userMessage?: string
  ) => {
    const roleMessage = getRoleSpecificErrorMessage(error, role, context);
    
    // Check if this is a network error and we're offline
    const classifiedError = classifyError(error, context);
    if (classifiedError.category === ErrorCategory.NETWORK && !isOnline) {
      // Show offline-specific message
      toast.error("You're offline", {
        description: "This action requires an internet connection. Please try again when you're back online.",
        duration: 5000,
      });
      return;
    }
    
    // Check feature availability based on error context
    if (context.includes('collaboration') && !isEnabled('real-time-collaboration')) {
      toast.error('Collaboration unavailable', {
        description: "Real-time collaboration is currently disabled. Changes will be saved locally only.",
        duration: 5000,
      });
      return;
    }

    if (context.includes('template') && !isEnabled('template-marketplace')) {
      toast.error('Template features unavailable', {
        description: "Template marketplace is currently disabled due to system issues.",
        duration: 5000,
      });
      return;
    }
    
    // Fall back to standard error handling
    handleError(error, context, userMessage || roleMessage);
  }, [role, isOnline, isEnabled]);
  
  /**
   * Get role-specific error message without showing a toast
   */
  const getRoleAwareErrorMessage = useCallback((
    error: unknown,
    context: string
  ): string => {
    return getRoleSpecificErrorMessage(error, role, context);
  }, [role]);
  
  /**
   * Create a wrapped function that handles errors
   */
  const withErrorHandling = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    context: string,
    errorMessage?: string
  ): ((...args: Parameters<T>) => Promise<ReturnType<T> | undefined>) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleRoleAwareError(error, context, errorMessage);
        return undefined;
      }
    };
  }, [handleRoleAwareError]);
  
  return { 
    handleRoleAwareError, 
    getRoleAwareErrorMessage,
    withErrorHandling
  };
}

/**
 * React component to display role-specific error messages
 */
export function RoleAwareError({ 
  error, 
  context,
  feature
}: { 
  error: unknown; 
  context: string;
  feature?: string;
}) {
  const { getRoleAwareErrorMessage } = useRoleAwareErrorHandling();
  const errorMessage = getRoleAwareErrorMessage(error, context);
  const { isEnabled } = useFeatureFlags();
  
  // Handle feature-specific rendering based on feature flags
  if (feature && !isEnabled(feature as any)) {
    return (
      <div className="text-amber-600 text-sm mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
        This feature is currently unavailable due to system constraints.
      </div>
    );
  }
  
  return (
    <div className="text-destructive text-sm mt-2">
      {errorMessage}
    </div>
  );
}
