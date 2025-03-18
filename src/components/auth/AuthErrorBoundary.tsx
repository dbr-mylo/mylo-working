
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AuthError } from '@/lib/errors/authErrors';
import { toast } from "sonner";

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Authentication error caught by boundary:', error, errorInfo);
    
    // Display error to user with toast
    if (error instanceof AuthError) {
      toast.error(`Authentication Error: ${error.message}`);
    } else {
      toast.error('An authentication error occurred. Please try again.');
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="auth-error-container p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">Authentication Error</h3>
          <p className="mt-2 text-sm text-red-700">
            {this.state.error?.message || 'An unexpected authentication error occurred.'}
          </p>
          <button
            onClick={this.resetError}
            className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
