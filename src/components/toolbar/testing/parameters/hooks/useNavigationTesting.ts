
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { benchmarkOperation } from '@/utils/navigation/parameters/performanceMonitor';
import { navigationService } from '@/services/navigation/NavigationService';
import { TestResult, PathSegment } from '../types';

export const useNavigationTesting = (onTestResult?: (result: TestResult) => void) => {
  const { toast } = useToast();
  const [pattern, setPattern] = useState('/content/:contentType/:documentId/version/:versionId');
  const [actualPath, setActualPath] = useState('/content/article/doc-123/version/v2');
  const [results, setResults] = useState<TestResult[]>([]);
  const [benchmarks, setBenchmarks] = useState<{iterations: number; averageTime: number} | null>(null);
  
  const performExtraction = () => {
    try {
      const { result, performance } = benchmarkOperation(
        'extractParameters',
        () => navigationService.extractRouteParameters(pattern, actualPath)
      );
      
      const newResult: TestResult = {
        timestamp: new Date().toISOString(),
        pattern,
        actualPath,
        params: result,
        errors: [],
        hierarchy: {},
        isValid: true,
        performance: {
          extractionTime: performance.executionTime,
          operationsPerSecond: performance.operationsPerSecond
        }
      };
      
      const { performance: memoizedPerformance } = benchmarkOperation(
        'memoizedExtractParameters',
        () => navigationService.extractRouteParameters(pattern, actualPath)
      );
      
      newResult.memoizedExtractionTime = memoizedPerformance.executionTime;
      newResult.memoizedOperationsPerSecond = memoizedPerformance.operationsPerSecond;
      
      setResults(prev => [newResult, ...prev]);
      
      if (onTestResult) {
        onTestResult(newResult);
      }
      
      toast({
        title: 'Parameter extraction complete',
        description: `Extracted ${result ? Object.keys(result).length : 0} parameters in ${performance.executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      const errorResult: TestResult = {
        timestamp: new Date().toISOString(),
        pattern,
        actualPath,
        params: {},
        errors: [error instanceof Error ? error.message : String(error)],
        hierarchy: {},
        isValid: false,
        performance: { 
          extractionTime: 0,
          operationsPerSecond: 0
        }
      };
      
      setResults(prev => [errorResult, ...prev]);
      
      if (onTestResult) {
        onTestResult(errorResult);
      }
      
      toast({
        title: 'Error during extraction',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return {
    pattern,
    setPattern,
    actualPath,
    setActualPath,
    results,
    benchmarks,
    setBenchmarks,
    performExtraction
  };
};
