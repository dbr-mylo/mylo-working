
import React, { useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { handleError, handleRoleAwareError } from "@/utils/error/handleError";
import { toast } from "sonner"; 
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import { useOnlineStatus } from './useOnlineStatus';
import { useFeatureFlags } from './useFeatureFlags';
import { getErrorCategoryInfo } from '@/utils/error/selfHealingSystem';

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
    // Use the enhanced role-aware error handler
    handleRoleAwareError(error, context, role, undefined, userMessage);
  }, [role]);
  
  /**
   * Get role-specific error message without showing a toast
   */
  const getRoleAwareErrorMessage = useCallback((
    error: unknown,
    context: string
  ): string => {
    return getRoleSpecificErrorMessage(error, context, role);
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
  
  /**
   * Get information about recent errors of a specific category
   */
  const getCategoryErrorInfo = useCallback((category: ErrorCategory) => {
    return getErrorCategoryInfo(category);
  }, []);
  
  return { 
    handleRoleAwareError, 
    getRoleAwareErrorMessage,
    withErrorHandling,
    getCategoryErrorInfo
  };
}

/**
 * React component to display role-specific error messages
 */
export function RoleAwareError({ 
  error, 
  context,
  feature,
  onRetry
}: { 
  error: unknown; 
  context: string;
  feature?: string;
  onRetry?: () => void;
}) {
  const { getRoleAwareErrorMessage } = useRoleAwareErrorHandling();
  const errorMessage = getRoleAwareErrorMessage(error, context);
  const { isEnabled } = useFeatureFlags();
  
  // Handle feature-specific rendering based on feature flags
  if (feature && !isEnabled(feature as any)) {
    return (
      <div className="text-amber-600 text-sm mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
        This feature is currently unavailable due to system constraints.
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-2 underline text-amber-800 hover:text-amber-900"
          >
            Try again
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-destructive text-sm mt-2">
      {errorMessage}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-2 underline text-destructive hover:text-destructive/80"
        >
          Retry
        </button>
      )}
    </div>
  );
}
