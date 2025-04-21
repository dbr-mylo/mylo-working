
import { useState } from 'react';
import { PERFORMANCE_TEST_ITERATIONS, TestCase } from '../testCases';
import { extractNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';
import { memoizedExtractNestedParameters, clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { benchmarkOperation as benchmarkFunction } from '@/utils/navigation/parameters/performanceMonitor';
import { TestResult } from './useTestExecution';

export function usePerformanceTest() {
  const [performanceResults, setPerformanceResults] = useState<TestResult[]>([]);

  const runPerformanceTest = (testCase: TestCase, iterations: number = PERFORMANCE_TEST_ITERATIONS) => {
    // Run performance test for multiple iterations
    try {
      // First clear caches
      clearParameterCaches();
      
      // Regular extraction (non-memoized)
      const { performance: regularPerf } = benchmarkFunction(
        'extractParameters_benchmark',
        () => extractNestedParameters(testCase.pattern, testCase.path),
        iterations
      );
      
      // Memoized extraction (first run - no cache)
      clearParameterCaches();
      const { performance: memoizedPerf } = benchmarkFunction(
        'memoizedExtractParameters_benchmark',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path),
        iterations
      );
      
      // Memoized extraction (second run - with cache)
      const { performance: memoizedCachedPerf } = benchmarkFunction(
        'memoizedExtractParametersCached_benchmark',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path),
        iterations
      );
      
      // Add results summary to test results
      setPerformanceResults(prev => [{
        case: {
          name: `Performance Test (${iterations} iterations)`,
          pattern: testCase.pattern,
          path: testCase.path,
          expectedParams: {}
        },
        result: {
          params: {},
          isValid: true,
          regularTime: regularPerf.executionTime,
          memoizedTime: memoizedPerf.executionTime,
          memoizedCached: memoizedCachedPerf.executionTime,
          passed: true
        }
      }, ...prev]);
    } catch (error) {
      console.error('Performance test error:', error);
    }
  };

  return {
    performanceResults,
    runPerformanceTest
  };
}
