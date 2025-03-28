
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleSpecificErrorMessage } from '@/utils/errorHandling';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
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
      
      return <DefaultErrorFallback error={this.state.error} context={this.props.context || 'component'} />;
    }

    return this.props.children;
  }
}

// A functional component for the default error fallback UI
function DefaultErrorFallback({ error, context }: { error: Error | null, context: string }) {
  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        <div>
          <h2 className="text-lg font-medium text-red-800 mb-1">Something went wrong</h2>
          <p className="text-red-600 text-sm">{error?.message || "An unknown error occurred"}</p>
          <p className="text-red-400 text-xs mt-2">Error in {context}</p>
        </div>
      </div>
    </div>
  );
}

// Role-aware fallback component
export function RoleAwareErrorFallback({ error, context }: { error: Error | null, context: string }) {
  const { role } = useAuth();
  
  let message = error?.message || "An unknown error occurred";
  
  // Override with role-specific message if a role is available
  if (role && error) {
    message = getRoleSpecificErrorMessage(error, role, context);
  }

  let guidance = "";
  
  // Add role-specific guidance
  if (role === 'designer') {
    guidance = "Try refreshing the page or checking your style configurations.";
  } else if (role === 'writer') {
    guidance = "Your content is safe. Try refreshing the page.";
  } else if (role === 'admin') {
    guidance = "Check the console logs for technical details.";
  } else {
    guidance = "Try refreshing the page.";
  }

  return (
    <div className="p-4 border border-red-300 bg-red-50 rounded-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        <div>
          <h2 className="text-lg font-medium text-red-800 mb-1">{role ? `${role} error` : "Error"}</h2>
          <p className="text-red-600 text-sm">{message}</p>
          <p className="text-red-500 text-xs mt-2">{guidance}</p>
          <p className="text-red-400 text-xs mt-1">Error in {context}</p>
        </div>
      </div>
    </div>
  );
}

// Higher-order component to wrap components with an error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  context: string
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary context={context}>
      <Component {...props} />
    </ErrorBoundary>
  );
}
