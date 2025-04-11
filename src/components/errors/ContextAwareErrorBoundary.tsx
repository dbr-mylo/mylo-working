
import React from 'react';
import { ErrorBoundary } from './core/ErrorBoundary';
import { RoleAwareErrorFallback } from './RoleAwareErrorComponents';
import { useAuth } from '@/contexts/AuthContext';
import { ClassifiedError, classifyError } from '@/utils/error/errorClassifier';

interface ContextAwareErrorBoundaryProps {
  children: React.ReactNode;
  component: string;
  feature?: string;
  section?: string;
  allowReset?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo, context: string, classification: ClassifiedError) => void;
}

/**
 * An error boundary that captures detailed context information
 * for better error reporting and analytics
 */
export const ContextAwareErrorBoundary: React.FC<ContextAwareErrorBoundaryProps> = ({
  children,
  component,
  feature,
  section,
  allowReset = true,
  onError,
}) => {
  const { role } = useAuth();
  
  // Build a structured context string
  const contextPath = [
    section,
    feature,
    component
  ].filter(Boolean).join('.');
  
  // Handle errors with enhanced context
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Classify the error for better analytics
    const classification = classifyError(error, contextPath);
    
    // Log with enhanced context
    console.error(`Error in ${contextPath} (${classification.category})`, { 
      error, 
      role, 
      component, 
      feature, 
      section,
      classification 
    });
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo, contextPath, classification);
    }
  };
  
  // Provide fallback UI with the enhanced context
  const fallback = (error: Error, resetErrorBoundary: () => void) => (
    <RoleAwareErrorFallback 
      error={error} 
      context={contextPath} 
      onTryAgain={resetErrorBoundary} 
    />
  );
  
  return (
    <ErrorBoundary
      context={contextPath}
      fallback={fallback}
      onError={handleError}
      allowReset={allowReset}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * HOC that wraps a component in a context-aware error boundary
 */
export function withContextAwareErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  component: string,
  feature?: string,
  section?: string,
  allowReset: boolean = true
): React.FC<P> {
  return (props: P) => (
    <ContextAwareErrorBoundary 
      component={component} 
      feature={feature} 
      section={section} 
      allowReset={allowReset}
    >
      <Component {...props} />
    </ContextAwareErrorBoundary>
  );
}
