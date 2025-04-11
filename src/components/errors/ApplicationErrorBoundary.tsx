
import React from 'react';
import { ErrorBoundary } from './core/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Application-level error boundary that provides recovery options
 */
export const ApplicationErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // This is defined inside the component to access hooks
  const ApplicationErrorFallback = ({ error, resetErrorBoundary }: { 
    error: Error; 
    resetErrorBoundary: () => void;
  }) => {
    const navigate = useNavigate();
    
    const handleRefresh = () => {
      window.location.reload();
    };
    
    const handleGoHome = () => {
      navigate('/');
      resetErrorBoundary();
    };
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md p-6 bg-card text-card-foreground shadow-lg rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Application Error
          </h2>
          <p className="mb-6 text-muted-foreground">
            We're sorry, but something went wrong with the application.
          </p>
          <div className="p-4 bg-destructive/10 rounded-md mb-6">
            <p className="text-sm font-medium text-destructive">{error.message}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <Button onClick={resetErrorBoundary} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try to recover
            </Button>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh the page
            </Button>
            <Button onClick={handleGoHome} variant="secondary">
              <Home className="w-4 h-4 mr-2" />
              Return to home
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            If you continue to experience issues, please contact support.
          </p>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary
      context="Application"
      allowReset={true}
      fallback={(error, resetErrorBoundary) => (
        <ApplicationErrorFallback 
          error={error} 
          resetErrorBoundary={resetErrorBoundary} 
        />
      )}
      onError={(error) => {
        console.error('Application-level error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
