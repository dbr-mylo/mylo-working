
import React from 'react';
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getRoleSpecificErrorMessage } from "@/utils/errorHandling";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Creates a custom error boundary component
 */
export class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    context?: string;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    context?: string;
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
