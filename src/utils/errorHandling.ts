
import { toast } from "sonner";

/**
 * Error handling utility functions
 */

/**
 * Handles an error with consistent logging and user notification
 * @param error The error to handle
 * @param context Context information about where the error occurred
 * @param userMessage Optional custom message to show to the user
 * @param shouldToast Whether to show a toast notification (default: true)
 */
export const handleError = (
  error: unknown,
  context: string,
  userMessage?: string,
  shouldToast: boolean = true
): void => {
  // Extract error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : 'An unknown error occurred';
  
  // Log error with context
  console.error(`Error in ${context}:`, error);
  
  // Show toast notification if requested
  if (shouldToast) {
    toast.error(userMessage || errorMessage);
  }
};

/**
 * Wraps an async function with error handling
 * @param fn The async function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @returns A new function that handles errors
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string,
  userMessage?: string
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}

/**
 * Wraps a synchronous function with error handling
 * @param fn The function to wrap
 * @param context Context information about where the function is being called
 * @param userMessage Optional custom message to show to the user on error
 * @returns A new function that handles errors
 */
export function withSyncErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => T,
  context: string,
  userMessage?: string
): (...args: Args) => T | undefined {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch (error) {
      handleError(error, context, userMessage);
      return undefined;
    }
  };
}

/**
 * Creates a role-specific error message
 * @param error The error to handle
 * @param role The user's role
 * @param context Context information about where the error occurred
 * @returns An error message tailored to the user's role
 */
export function getRoleSpecificErrorMessage(
  error: unknown,
  role: string | null | undefined,
  context: string
): string {
  const baseMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  switch (role) {
    case 'designer':
      return `Design error in ${context}: ${baseMessage}. You may need to check your style configurations.`;
    case 'writer':
      return `Content error in ${context}: ${baseMessage}. Your content is still safe.`;
    case 'admin':
      return `System error in ${context}: ${baseMessage}. Technical details have been logged.`;
    default:
      return `Error in ${context}: ${baseMessage}`;
  }
}

/**
 * Creates a custom error boundary component
 */
export class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Show toast notification
    toast.error("An error occurred", {
      description: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message || "An unknown error occurred"}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

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
