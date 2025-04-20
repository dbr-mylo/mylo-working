
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TestResult } from '../types';

interface TestResultsListProps {
  results: TestResult[];
}

export const TestResultsList: React.FC<TestResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No test results yet. Run a test to see results.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-auto max-h-96">
      {results.map((result, index) => (
        <div key={index} className="border-b p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {result.performance?.extractionTime?.toFixed(2) || 'N/A'}ms
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="space-y-2">
            <p><strong>Pattern:</strong> {result.pattern}</p>
            <p><strong>Path:</strong> {result.actualPath}</p>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
              {JSON.stringify(result.params, null, 2)}
            </pre>
            
            {result.errors?.length > 0 && (
              <div className="mt-2 text-red-500 text-sm">
                <p><strong>Errors:</strong></p>
                <ul className="list-disc list-inside">
                  {result.errors.map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.memoizedExtractionTime && (
              <div className="text-sm text-muted-foreground">
                <p>Memoized: {result.memoizedExtractionTime.toFixed(2)}ms</p>
                <p>Improvement: {
                  result.performance?.extractionTime > 0 
                    ? ((result.performance.extractionTime - result.memoizedExtractionTime) / 
                        result.performance.extractionTime * 100).toFixed(1) 
                    : '0'
                }%</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
