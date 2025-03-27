
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface TestResult {
  passed: boolean;
  message: string;
  details?: string;
}

interface TestResultsProps {
  results: Record<string, TestResult>;
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (Object.keys(results).length === 0) {
    return null;
  }

  const passedCount = Object.values(results).filter(r => r.passed).length;
  const totalCount = Object.keys(results).length;
  const passPercentage = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Test Results</h3>
        <div className="flex items-center gap-2">
          <Badge variant={passPercentage === 100 ? "success" : passPercentage > 80 ? "default" : "destructive"}>
            {passedCount}/{totalCount} Passed
          </Badge>
          <Badge variant={passPercentage === 100 ? "success" : "outline"}>
            {passPercentage}%
          </Badge>
        </div>
      </div>
      
      {Object.entries(results).map(([testId, result]) => (
        <Alert key={testId} variant={result.passed ? "default" : "destructive"}>
          <div className="flex items-start">
            {result.passed ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div className="w-full">
              <div className="flex items-center justify-between">
                <AlertTitle>{testId}</AlertTitle>
                <Badge variant={result.passed ? "success" : "destructive"} className="ml-2">
                  {result.passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
              <AlertDescription>{result.message}</AlertDescription>
              {result.details && (
                <div className="mt-2 text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                  <code className="whitespace-pre-wrap">{result.details}</code>
                </div>
              )}
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};
