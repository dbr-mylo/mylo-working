
import { useState } from 'react';
import { TestCase } from '../testCases';
import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';
import { memoizedExtractNestedParameters, clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { benchmarkOperation as benchmarkFunction } from '@/utils/navigation/parameters/performanceMonitor';

export interface TestResult {
  case: TestCase;
  result: {
    params: Record<string, string>;
    isValid: boolean;
    regularTime: number;
    memoizedTime: number;
    memoizedCached?: number;
    passed: boolean;
  };
}

export function useTestExecution() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const runTest = (testCase: TestCase) => {
    setSelectedTest(testCase.name);
    
    try {
      // Test standard extraction
      const { result: regularResult, performance: regularPerf } = benchmarkFunction(
        'extractParameters',
        () => extractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test memoized extraction (first call - no cache)
      const { result: memoizedResult, performance: memoizedPerf } = benchmarkFunction(
        'memoizedExtractParameters',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test memoized extraction (second call - should use cache)
      const { performance: memoizedCachedPerf } = benchmarkFunction(
        'memoizedExtractParametersCached',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test validation
      let isValid = true;
      if (testCase.validationRules) {
        const { result: validationResult } = benchmarkFunction(
          'validateParameters',
          () => validateNestedParameters(
            regularResult.params, 
            regularResult.hierarchy, 
            testCase.validationRules
          )
        );
        isValid = validationResult.isValid;
      }

      // Check if params match expected
      const paramsMatch = Object.entries(testCase.expectedParams).every(
        ([key, value]) => regularResult.params[key] === value
      );
      
      // Check if validation matches expected
      const validationMatch = testCase.expectedValid === undefined || 
                            testCase.expectedValid === isValid;
      
      // Add to results
      setResults(prev => [
        {
          case: testCase,
          result: {
            params: regularResult.params,
            isValid,
            regularTime: regularPerf.executionTime,
            memoizedTime: memoizedPerf.executionTime,
            memoizedCached: memoizedCachedPerf.executionTime,
            passed: paramsMatch && validationMatch
          }
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Test error:', error);
      setResults(prev => [
        {
          case: testCase,
          result: {
            params: {},
            isValid: false,
            regularTime: 0,
            memoizedTime: 0,
            passed: false
          }
        },
        ...prev
      ]);
    } finally {
      setSelectedTest(null);
    }
  };
  
  const runAllTests = (testCases: TestCase[]) => {
    clearParameterCaches();
    testCases.forEach(testCase => {
      runTest(testCase);
    });
  };

  const clearResults = () => {
    setResults([]);
  };
  
  return {
    results,
    selectedTest,
    runTest,
    runAllTests,
    clearResults
  };
}
