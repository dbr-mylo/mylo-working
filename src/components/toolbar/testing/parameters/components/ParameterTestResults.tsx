
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestResult {
  pattern: string;
  actual: string;
  expected: Record<string, string> | null;
  result: Record<string, string> | null;
  isValid: boolean;
  errors?: string[];
  executionTime?: number;
}

interface ParameterTestResultsProps {
  results: TestResult[];
}

export const ParameterTestResults: React.FC<ParameterTestResultsProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={index}>
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Test #{index + 1}</h3>
              <div className="flex gap-2">
                {result.isValid ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Invalid
                  </Badge>
                )}
                {result.executionTime && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {result.executionTime.toFixed(2)}ms
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Pattern:</p>
                <code className="bg-muted p-1 rounded text-xs">{result.pattern}</code>
              </div>
              <div>
                <p className="font-medium">Actual Path:</p>
                <code className="bg-muted p-1 rounded text-xs">{result.actual}</code>
              </div>
            </div>
            
            <div>
              <p className="font-medium text-sm">Result:</p>
              <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                {JSON.stringify(result.result, null, 2)}
              </pre>
            </div>
            
            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-50 p-2 rounded-md">
                <p className="font-medium text-sm text-red-700">Errors:</p>
                <ul className="list-disc list-inside text-xs text-red-600 mt-1">
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
