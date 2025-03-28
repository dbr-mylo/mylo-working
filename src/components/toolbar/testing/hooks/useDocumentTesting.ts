
import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { runDocumentEditingTests } from './test-runners/documentEditingTests';
import { TestResult } from './useToolbarTestResult';
import { useToast } from '@/hooks/use-toast';
import { withRetry } from '@/utils/error/withRetry';
import { trackError } from '@/utils/error/analytics';

export interface UseDocumentTestingProps {
  editor: Editor | null;
  runOnMount?: boolean;
  maxRetries?: number;
  trackAnalytics?: boolean;
}

export interface DocumentTestStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastRunTime: string | null;
  duration?: number;
}

export const useDocumentTesting = ({ 
  editor, 
  runOnMount = true,
  maxRetries = 2,
  trackAnalytics = true
}: UseDocumentTestingProps) => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runDuration, setRunDuration] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  
  // Calculate test statistics
  const getTestStats = useCallback((): DocumentTestStats => {
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(r => r.passed).length;
    
    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      lastRunTime,
      duration: runDuration
    };
  }, [testResults, lastRunTime, runDuration]);
  
  // Run tests with the current editor instance with retry capability
  const runTests = useCallback(async () => {
    if (isRunning) {
      console.log("Test run already in progress, skipping");
      return;
    }
    
    if (!editor) {
      setTestResults({
        'editor.missing': {
          passed: false,
          message: 'No editor instance available',
          name: 'Editor Instance',
          timestamp: new Date().toISOString()
        }
      });
      
      toast({
        title: 'Test Failed',
        description: 'Editor instance is not available',
        variant: 'destructive',
      });
      
      return;
    }
    
    setIsRunning(true);
    const startTime = performance.now();
    
    try {
      // Use withRetry to automatically retry the test run if it fails
      const runTestsWithRetry = withRetry(
        () => runDocumentEditingTests(editor),
        { 
          maxAttempts: maxRetries + 1, // Initial attempt + retries
          delayMs: 200,
          retryCondition: (error) => {
            // Only retry for specific error types
            if (error instanceof Error) {
              const isTransientError = error.message.includes('timeout') || 
                                       error.message.includes('network') ||
                                       error.message.includes('connection');
              console.log(`Error type: ${error.name}, Retrying: ${isTransientError}`);
              return isTransientError;
            }
            return false;
          }
        }
      );
      
      console.log("Starting document editing tests with retry capability");
      const results = await runTestsWithRetry();
      setTestResults(results);
      
      // Track test completion duration
      const duration = Math.round(performance.now() - startTime);
      setRunDuration(duration);
      
      // Set timestamp
      const timestamp = new Date().toISOString();
      setLastRunTime(timestamp);
      
      // Count passed/failed tests
      const passedTests = Object.values(results).filter(r => r.passed).length;
      const totalTests = Object.keys(results).length;
      
      // Send analytics if enabled
      if (trackAnalytics) {
        console.info(`[Analytics] Document editing tests completed: ${passedTests}/${totalTests} passed, duration: ${duration}ms`);
        
        // Log detailed test results for analytics
        Object.entries(results).forEach(([testId, result]) => {
          console.info(`[Analytics] Test "${testId}" (${result.name || 'unnamed'}): ${result.passed ? 'PASSED' : 'FAILED'}`);
        });
      }
      
      // Show success/failure toast
      if (passedTests === totalTests) {
        toast({
          title: 'All Tests Passed',
          description: `${passedTests}/${totalTests} tests passed successfully (${duration}ms)`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Some Tests Failed',
          description: `${passedTests}/${totalTests} tests passed, ${totalTests - passedTests} failed (${duration}ms)`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Handle errors that weren't automatically retried or that failed all retries
      console.error("Failed to run document editing tests:", error);
      
      // Track error
      trackError(error, "useDocumentTesting.runTests");
      
      // Set error result
      setTestResults({
        'test.execution.error': {
          passed: false,
          message: `Failed to run tests: ${error instanceof Error ? error.message : String(error)}`,
          name: 'Test Execution',
          timestamp: new Date().toISOString(),
          details: error instanceof Error ? error.stack : undefined
        }
      });
      
      toast({
        title: 'Test Execution Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [editor, isRunning, maxRetries, toast, trackAnalytics]);
  
  // Reset test results
  const resetTests = useCallback(() => {
    setTestResults({});
    setLastRunTime(null);
    setRunDuration(undefined);
    toast({
      title: 'Tests Reset',
      description: 'All test results have been cleared',
    });
  }, [toast]);
  
  // Run tests on mount if specified
  useEffect(() => {
    if (runOnMount && editor) {
      // Short delay to ensure editor is fully initialized
      const timer = setTimeout(() => {
        runTests();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [editor, runOnMount, runTests]);
  
  return {
    testResults,
    lastRunTime,
    isRunning,
    runDuration,
    stats: getTestStats(),
    runTests,
    resetTests
  };
};
