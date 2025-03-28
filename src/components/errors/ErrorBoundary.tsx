
import React from 'react';
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getRoleSpecificErrorMessage, trackError } from "@/utils/errorHandling";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

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
 * Analytics data for error boundary incidents
 */
interface ErrorBoundaryAnalytics {
  componentName: string;
  errorMessage: string;
  errorType: string;
  timestamp: string;
  errorCount: number;
  timeSinceLastError?: number; // In milliseconds
  recoveryAttempts: number;
  wasRecovered: boolean;
}

// Global store of error boundary analytics
const errorBoundaryIncidents: ErrorBoundaryAnalytics[] = [];

/**
 * Creates a custom error boundary component
 */
export class ErrorBoundary extends React.Component<
  { 
    children: React.ReactNode;
    fallback?: React.ReactNode;
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
    fallback?: React.ReactNode;
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
      if (this.props.fallback) {
        return (
          <>
            {this.props.fallback}
            {resetButton}
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
  
  return (
    <div className="p-6 max-w-xl mx-auto my-8 bg-red-50 border border-red-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-red-800 mb-4">
        Application Error
      </h2>
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
      <p className="text-gray-600 mt-4 mb-4">
        Please try refreshing the page or contact support if the problem persists.
      </p>
      
      {onTryAgain && (
        <Button 
          variant="outline" 
          onClick={onTryAgain}
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
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

/**
 * State restore provider for preserving state across errors
 */
export const StateRestoreContext = React.createContext<{
  saveState: <T>(key: string, state: T) => void;
  getState: <T>(key: string) => T | null;
}>({
  saveState: () => {},
  getState: () => null,
});

/**
 * Provider component for state restoration
 */
export function StateRestoreProvider({ children }: { children: React.ReactNode }) {
  // Use local storage for persistence
  const saveState = React.useCallback(<T,>(key: string, state: T) => {
    try {
      localStorage.setItem(`state_${key}`, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, []);
  
  const getState = React.useCallback(<T,>(key: string): T | null => {
    try {
      const storedState = localStorage.getItem(`state_${key}`);
      return storedState ? JSON.parse(storedState) : null;
    } catch (e) {
      console.error("Failed to restore state:", e);
      return null;
    }
  }, []);
  
  return (
    <StateRestoreContext.Provider value={{ saveState, getState }}>
      {children}
    </StateRestoreContext.Provider>
  );
}

/**
 * Hook for using state restoration
 */
export function useStateRestore<T>(key: string, initialState: T) {
  const { saveState, getState } = React.useContext(StateRestoreContext);
  const [state, setState] = React.useState<T>(() => {
    const restoredState = getState<T>(key);
    return restoredState !== null ? restoredState : initialState;
  });
  
  // Save state when it changes
  React.useEffect(() => {
    saveState(key, state);
  }, [key, state, saveState]);
  
  return [state, setState] as const;
}
