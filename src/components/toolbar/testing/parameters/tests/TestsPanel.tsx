
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TEST_CASES } from './testCases';
import { useTestExecution } from './hooks/useTestExecution';
import { usePerformanceTest } from './hooks/usePerformanceTest';
import { TestCaseGrid } from './components/TestCaseGrid';
import { TestResults } from './components/TestResults';
import { PerformanceResultCard } from './components/PerformanceResultCard';
import { clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';

export const TestsPanel: React.FC = () => {
  const {
    results,
    selectedTest,
    runTest,
    runAllTests,
    clearResults
  } = useTestExecution();

  const {
    performanceResults,
    runPerformanceTest
  } = usePerformanceTest();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default"
          onClick={() => runAllTests(TEST_CASES)}
          disabled={!!selectedTest}
        >
          Run All Tests
        </Button>
        <Button 
          variant="outline"
          onClick={clearResults}
          disabled={results.length === 0}
        >
          Clear Results
        </Button>
      </div>
      
      <TestCaseGrid 
        testCases={TEST_CASES} 
        selectedTest={selectedTest}
        onRunTest={runTest}
      />
      
      <div className="my-6 border-t pt-6">
        <h2 className="text-lg font-medium mb-4">Test Results</h2>
        <TestResults results={results} />
      </div>

      <div className="my-6 border-t pt-6">
        <h2 className="text-lg font-medium mb-4">Performance Testing</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="default"
            onClick={() => runPerformanceTest(TEST_CASES[2])}
            disabled={!!selectedTest}
          >
            Run Performance Test
          </Button>
          <Button 
            variant="outline"
            onClick={clearParameterCaches}
          >
            Clear Parameter Caches
          </Button>
        </div>
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The performance test will run multiple iterations to measure the average execution time and cache efficiency.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          {performanceResults.map((result, index) => (
            <PerformanceResultCard key={index} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};
