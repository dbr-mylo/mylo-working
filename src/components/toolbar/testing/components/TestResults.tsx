
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TestResult {
  passed: boolean;
  message: string;
}

interface TestResultsProps {
  results: Record<string, TestResult>;
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (Object.keys(results).length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-medium">Test Results</h3>
      {Object.entries(results).map(([testId, result]) => (
        <Alert key={testId} variant={result.passed ? "default" : "destructive"}>
          <div className="flex items-start">
            {result.passed ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <AlertTitle>{testId}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};
