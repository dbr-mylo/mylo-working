
import React from 'react';
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { trackError } from "@/utils/error/analytics";
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ErrorBoundaryAnalytics } from "../types/ErrorTypes";

// Global store of error boundary analytics
const errorBoundaryIncidents: ErrorBoundaryAnalytics[] = [];

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number | null;
}

/**
 * Creates a custom error boundary component
 */
export class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: (error: Error, resetErrorBoundary: () => void) => React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    context?: string;
    allowReset?: boolean;
  },
  ErrorBoundaryState
> {
  private recoveryAttempts: number = 0;
  private componentName: string;
  
  constructor(props: { 
    children: React.ReactNode;
    fallback?: (error: Error, resetErrorBoundary: () => void) => React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    context?: string;
    allowReset?: boolean;
  }) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: null
    };
    this.componentName = props.context || "UnknownComponent";
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    const timeSinceLastError = this.state.lastErrorTime 
      ? now - this.state.lastErrorTime 
      : undefined;
    
    // Update state with error details
    this.setState(prevState => ({ 
      errorInfo, 
      errorCount: prevState.errorCount + 1,
      lastErrorTime: now
    }));
    
    // Log error details
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Track error for analytics
    trackError(error, `ErrorBoundary.${this.componentName}`);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Create analytics record
    const analytics: ErrorBoundaryAnalytics = {
      componentName: this.componentName,
      errorMessage: error.message,
      errorType: error.name,
      timestamp: new Date().toISOString(),
      errorCount: this.state.errorCount + 1,
      timeSinceLastError,
      recoveryAttempts: this.recoveryAttempts,
      wasRecovered: false // Will be updated if recovery succeeds
    };
    
    // Store analytics data
    errorBoundaryIncidents.push(analytics);
    
    // Show toast notification
    toast.error("An error occurred", {
      description: error.message,
      duration: 5000,
    });
  }
  
  /**
   * Attempt to recover by resetting error state
   */
  handleReset = () => {
    this.recoveryAttempts++;
    
    // Track recovery attempt
    console.info(`[Analytics] Recovery attempt ${this.recoveryAttempts} for ${this.componentName}`);
    
    // Find the latest incident for this component and update it
    const latestIncident = [...errorBoundaryIncidents]
      .reverse()
      .find(i => i.componentName === this.componentName);
      
    if (latestIncident) {
      latestIncident.recoveryAttempts = this.recoveryAttempts;
    }
    
    // Reset error state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }
  
  componentDidUpdate(prevProps: any, prevState: ErrorBoundaryState) {
    // If we recovered from error, update analytics
    if (prevState.hasError && !this.state.hasError) {
      // Find the latest incident for this component and update it
      const latestIncident = [...errorBoundaryIncidents]
        .reverse()
        .find(i => i.componentName === this.componentName);
        
      if (latestIncident) {
        latestIncident.wasRecovered = true;
        console.info(`[Analytics] Error in ${this.componentName} was successfully recovered`);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Allow reset if specified in props
      const resetButton = this.props.allowReset && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={this.handleReset}
          className="mt-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try to recover
        </Button>
      );
      
      // Use custom fallback if provided, otherwise use default error UI
      if (this.props.fallback && this.state.error) {
        return (
          <>
            {this.props.fallback(this.state.error, this.handleReset)}
            {!this.props.fallback.toString().includes('resetButton') && resetButton}
          </>
        );
      }
      
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-2">{this.state.error?.message || "An unknown error occurred"}</p>
          {resetButton}
          <p className="text-xs text-gray-500 mt-4">Error details have been logged for troubleshooting.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Get error boundary analytics
 * Used to track error patterns
 * @returns Array of error boundary incidents
 */
export const getErrorBoundaryAnalytics = (): ErrorBoundaryAnalytics[] => {
  return [...errorBoundaryIncidents];
};
