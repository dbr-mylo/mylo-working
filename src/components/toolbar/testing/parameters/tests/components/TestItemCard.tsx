
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';
import { TestResult } from '../hooks/useTestExecution';

interface TestItemCardProps {
  testResult: TestResult;
}

export const TestItemCard: React.FC<TestItemCardProps> = ({ testResult }) => {
  const { case: testCase, result } = testResult;

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{testCase.name}</h3>
        {result.passed ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="h-3 w-3 mr-1" /> Pass
          </Badge>
        ) : (
          <Badge variant="destructive">Fail</Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium">Pattern</p>
          <p className="font-mono text-xs bg-muted p-2 rounded">{testCase.pattern}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Path</p>
          <p className="font-mono text-xs bg-muted p-2 rounded">{testCase.path}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">Extracted Parameters</p>
        <pre className="font-mono text-xs bg-muted p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result.params, null, 2)}
        </pre>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">Standard: {result.regularTime.toFixed(2)}ms</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">Memoized: {result.memoizedTime.toFixed(2)}ms</span>
        </div>
        {result.memoizedCached !== undefined && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-xs">Cached: {result.memoizedCached.toFixed(2)}ms</span>
          </div>
        )}
        <div>
          <Badge 
            variant="outline"
            className={
              result.isValid 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }
          >
            {result.isValid ? 'Valid' : 'Invalid'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
