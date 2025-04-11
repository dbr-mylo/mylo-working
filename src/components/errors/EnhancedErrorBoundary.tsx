
import React from 'react';
import { ErrorBoundary } from './core/ErrorBoundary';
import { RoleAwareErrorFallback } from './RoleAwareErrorComponents';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ErrorAlert } from './ErrorAlert';
import { NetworkStatusIndicator } from '@/components/status/NetworkStatusIndicator';
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';

interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  context: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  allowReset?: boolean;
  showNetworkStatus?: boolean;
}

export const EnhancedErrorBoundary: React.FC<EnhancedErrorBoundaryProps> = ({
  children,
  context,
  fallback,
  onError,
  allowReset = true,
  showNetworkStatus = true,
}) => {
  const { isOnline } = useOnlineStatus();

  // Custom fallback component that shows different UI based on error type
  const enhancedFallback = (error: Error, resetErrorBoundary: () => void) => {
    // If we're offline and this is a network error, show a specialized UI
    const classifiedError = classifyError(error, context);
    
    if (!isOnline && classifiedError.category === ErrorCategory.NETWORK) {
      return (
        <div className="p-4 flex flex-col items-center justify-center">
          <NetworkStatusIndicator size="lg" showLabel variant="prominent" />
          <h3 className="mt-4 text-lg font-semibold">You're offline</h3>
          <p className="text-sm text-center mt-2 mb-4 text-muted-foreground">
            This feature requires an internet connection.
            We'll automatically retry when you're back online.
          </p>
          <ErrorAlert 
            error={error} 
            context={context}
            severity="info"
            onRetry={resetErrorBoundary}
            title="Waiting for connection"
          />
        </div>
      );
    }
    
    // If custom fallback is provided, use it
    if (fallback) {
      return (
        <>
          {fallback}
          {showNetworkStatus && !isOnline && (
            <div className="mt-2">
              <NetworkStatusIndicator showLabel variant="prominent" />
            </div>
          )}
        </>
      );
    }
    
    // Default to role-aware fallback
    return (
      <>
        <RoleAwareErrorFallback 
          error={error} 
          context={context} 
          onTryAgain={resetErrorBoundary} 
        />
        {showNetworkStatus && !isOnline && (
          <div className="mt-2 flex justify-center">
            <NetworkStatusIndicator showLabel variant="prominent" />
          </div>
        )}
      </>
    );
  };
  
  return (
    <ErrorBoundary
      context={context}
      onError={onError}
      allowReset={allowReset}
      fallback={(error, resetErrorBoundary) => enhancedFallback(error, resetErrorBoundary)}
    >
      {children}
    </ErrorBoundary>
  );
};
