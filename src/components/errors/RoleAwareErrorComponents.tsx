
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { trackError } from "@/utils/error/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { RecoveryOptions } from './RecoveryOptions';

/**
 * A component to display role-specific error messages
 */
export function RoleAwareErrorMessage({ 
  error, 
  context 
}: { 
  error: unknown; 
  context: string;
}) {
  const { role } = useAuth();
  const errorMessage = getRoleSpecificErrorMessage(error, role, context);
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}

/**
 * A fallback component that displays role-specific error messages
 * Used in error boundaries as a fallback component
 */
export function RoleAwareErrorFallback({ 
  error, 
  context,
  onTryAgain,
}: { 
  error: unknown; 
  context: string;
  onTryAgain?: () => void;
}) {
  const { role } = useAuth();
  const errorMessage = getRoleSpecificErrorMessage(error, role, context);
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  return (
    <div className="p-6 max-w-xl mx-auto my-8 bg-red-50 border border-red-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-red-800 mb-4">
        Application Error
      </h2>
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
      
      <RecoveryOptions 
        error={errorObj} 
        onRetry={onTryAgain} 
      />
    </div>
  );
}

/**
 * A hook that provides role-aware error boundary functionality
 */
export function useRoleAwareErrorBoundary() {
  const { role } = useAuth();
  
  const handleError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    // Create a role-specific error message
    const message = getRoleSpecificErrorMessage(error, role, errorInfo.componentStack || "unknown");
    
    // Log the error with the role-specific message
    console.error(`[${role || 'unauthenticated'}] ${message}`, error, errorInfo);
    
    // Track the error for analytics
    trackError(error, `RoleAwareErrorBoundary.${role || 'unauthenticated'}`);
  }, [role]);
  
  return { handleError };
}
