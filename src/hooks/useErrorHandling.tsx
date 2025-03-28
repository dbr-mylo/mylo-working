
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { handleError } from "@/utils/error/handleError";

/**
 * A hook to handle errors with role-specific messaging
 */
export function useRoleAwareErrorHandling() {
  const { role } = useAuth();
  
  const handleRoleAwareError = React.useCallback((
    error: unknown,
    context: string,
    userMessage?: string
  ) => {
    const roleMessage = getRoleSpecificErrorMessage(error, role, context);
    handleError(error, context, userMessage || roleMessage);
  }, [role]);
  
  return { handleRoleAwareError };
}
