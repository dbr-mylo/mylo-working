
import React from 'react';
import { ErrorBoundary } from './core/ErrorBoundary';
import { RoleAwareErrorFallback } from './RoleAwareErrorComponents';

interface WithErrorBoundaryProps {
  children: React.ReactNode;
  context: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  allowReset?: boolean;
}

/**
 * Higher-order component that wraps children in an error boundary
 * with role-aware error messaging
 */
export const WithErrorBoundary: React.FC<WithErrorBoundaryProps> = ({
  children,
  context,
  fallback,
  onError,
  allowReset = true
}) => {
  // Create a default fallback function that matches the expected signature
  const defaultFallback = (error: Error, resetErrorBoundary: () => void) => (
    <RoleAwareErrorFallback 
      error={error} 
      context={context} 
      onTryAgain={resetErrorBoundary}
    />
  );

  // If a custom fallback is provided, wrap it in a function
  const fallbackFn = fallback
    ? (_error: Error, _reset: () => void) => fallback
    : defaultFallback;

  return (
    <ErrorBoundary
      context={context}
      fallback={fallbackFn}
      onError={onError}
      allowReset={allowReset}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * HOC that wraps a component in an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  context: string,
  allowReset: boolean = true
): React.FC<P> {
  return (props: P) => (
    <WithErrorBoundary context={context} allowReset={allowReset}>
      <Component {...props} />
    </WithErrorBoundary>
  );
}
