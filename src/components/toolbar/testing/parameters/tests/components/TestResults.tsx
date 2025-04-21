
import React from 'react';
import { TestItemCard } from './TestItemCard';
import { TestResult } from '../hooks/useTestExecution';

interface TestResultsProps {
  results: TestResult[];
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No tests have been run yet. Run a test to see results.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <TestItemCard key={index} testResult={result} />
      ))}
    </div>
  );
};
