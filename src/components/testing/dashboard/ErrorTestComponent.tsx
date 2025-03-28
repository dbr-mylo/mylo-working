
import React, { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/errors';

/**
 * A component that deliberately throws an error to test error boundaries
 */
const ErrorComponent = () => {
  useEffect(() => {
    throw new Error("This is a test error from ErrorComponent");
  }, []);
  
  return <div>This will never render</div>;
};

interface ErrorTestComponentProps {
  showErrorTest: boolean;
}

export const ErrorTestComponent: React.FC<ErrorTestComponentProps> = ({ showErrorTest }) => {
  if (!showErrorTest) return null;
  
  return (
    <ErrorBoundary 
      context="ErrorTest" 
      fallback={
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Test Error Caught</AlertTitle>
          <AlertDescription>
            The error boundary successfully caught a test error.
          </AlertDescription>
        </Alert>
      }
    >
      <ErrorComponent />
    </ErrorBoundary>
  );
};
