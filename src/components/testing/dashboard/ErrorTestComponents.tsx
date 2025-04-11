
import React, { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ErrorBoundary } from "@/components/errors";

/**
 * A component that deliberately throws an error to test error boundaries
 */
const ErrorComponent = () => {
  useEffect(() => {
    throw new Error("This is a test error from ErrorComponent");
  }, []);
  
  return <div>This will never render</div>;
};

/**
 * A container component that wraps ErrorComponent with an ErrorBoundary
 */
export const ErrorTestComponent: React.FC<{
  showErrorTest: boolean;
}> = ({ showErrorTest }) => {
  if (!showErrorTest) return null;
  
  // Create a fallback function for the error boundary that matches the expected signature
  const testErrorFallback = (_error: Error, _resetErrorBoundary: () => void) => (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Test Error Caught</AlertTitle>
      <AlertDescription>
        The error boundary successfully caught a test error.
      </AlertDescription>
    </Alert>
  );
  
  return (
    <ErrorBoundary 
      context="ErrorTest" 
      fallback={testErrorFallback}
    >
      <ErrorComponent />
    </ErrorBoundary>
  );
};
