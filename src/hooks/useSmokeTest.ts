
/**
 * @file useSmokeTest.ts
 * @description A React hook for running smoke tests on component render
 * 
 * This hook provides a way to verify that components render correctly and
 * their essential functionality works. It's designed to be used in development
 * and testing environments, with minimal impact on production performance.
 * 
 * @example
 * // Basic usage
 * const MyComponent = () => {
 *   useSmokeTest("MyComponent");
 *   return <div>My Component</div>;
 * };
 * 
 * @example
 * // Testing a specific feature
 * const Counter = () => {
 *   const { testFeature } = useSmokeTest("Counter");
 *   const [count, setCount] = useState(0);
 *   
 *   // Test increment functionality
 *   useEffect(() => {
 *     testFeature("increment", () => {
 *       const initialCount = count;
 *       setCount(prev => prev + 1);
 *       // This would normally be in another useEffect, but for testing we verify sync
 *       if (count !== initialCount + 1) {
 *         throw new Error("Increment failed");
 *       }
 *     });
 *   }, []);
 *   
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
 *     </div>
 *   );
 * };
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";

/**
 * Options for the useSmokeTest hook
 */
export interface SmokeTestOptions {
  /** Whether to run the test when the component mounts */
  runOnMount?: boolean;
  /** Whether to log the test result to the console */
  logResult?: boolean;
  /** Category for organizing tests */
  category?: string;
  /** Whether to send analytics data */
  trackAnalytics?: boolean;
  /** Any additional context to include with the test */
  context?: Record<string, any>;
}

/**
 * Result of a smoke test
 */
export interface SmokeTestResult {
  /** Whether the test passed */
  passed: boolean;
  /** Error message if the test failed */
  error?: string;
  /** Component that was tested */
  component: string;
  /** When the test was run */
  timestamp: string;
  /** How long the test took to run in ms */
  duration?: number;
  /** Any additional context for the test */
  context?: Record<string, any>;
}

/**
 * Hook to run smoke tests on component render
 * 
 * @param componentName - Name of the component being tested
 * @param deps - Optional dependency array (similar to useEffect)
 * @param options - Optional configuration options
 * @returns Object with functions for working with smoke tests
 */
export const useSmokeTest = (
  componentName: string, 
  deps: React.DependencyList = [],
  options: SmokeTestOptions = {}
) => {
  const { 
    runOnMount = true, 
    logResult = true, 
    category = "general",
    trackAnalytics = true,
    context = {}
  } = options;
  
  const hasRendered = useRef(false);
  const [lastTestPassed, setLastTestPassed] = useState<boolean | null>(null);
  const [lastTestResult, setLastTestResult] = useState<SmokeTestResult | null>(null);
  const startTime = useRef<number | null>(null);
  
  /**
   * Log a test result
   */
  const logTestResult = useCallback((result: SmokeTestResult) => {
    if (logResult) {
      console.info(
        `Smoke test for ${result.component}: ${result.passed ? 'PASSED ✅' : 'FAILED ❌'}${
          result.error ? ` - ${result.error}` : ''
        }${result.duration ? ` (${result.duration}ms)` : ''}`
      );
    }
    
    // Store the result
    setLastTestResult(result);
    
    // Track analytics if enabled
    if (trackAnalytics) {
      // This would send to an analytics service in production
      console.info(`[Analytics] Smoke test result: ${JSON.stringify(result)}`);
    }
  }, [logResult, trackAnalytics]);
  
  /**
   * Create a test result object
   */
  const createTestResult = useCallback((
    passed: boolean, 
    error?: string,
    component: string = componentName,
    testContext: Record<string, any> = {}
  ): SmokeTestResult => {
    const endTime = Date.now();
    const duration = startTime.current ? endTime - startTime.current : undefined;
    
    return {
      passed,
      error,
      component,
      timestamp: new Date().toISOString(),
      duration,
      context: {
        ...context,
        ...testContext,
        category
      }
    };
  }, [componentName, category, context]);
  
  // Run on mount if enabled
  useEffect(() => {
    // Only run once per render cycle if runOnMount is true
    if (runOnMount && !hasRendered.current) {
      startTime.current = Date.now();
      
      try {
        const passed = smokeTestRunner.testComponentRender(componentName, () => {
          // This executes during render - if it doesn't throw, the component rendered
          hasRendered.current = true;
        });
        
        setLastTestPassed(passed);
        
        const result = createTestResult(passed === true, passed === false ? "Component failed to render" : undefined);
        logTestResult(result);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setLastTestPassed(false);
        
        const result = createTestResult(false, errorMessage);
        logTestResult(result);
        
        // We don't rethrow - smoke tests should not break the app
        console.error(`Smoke test error in ${componentName}:`, e);
      }
    }
    
    return () => {
      // Reset on unmount
      hasRendered.current = false;
    };
  }, deps);
  
  /**
   * Function to manually run a test
   * @param testFn Optional function to run for the test
   * @returns Boolean indicating if the test passed
   */
  const runTest = useCallback((
    testFn?: () => void, 
    testContext: Record<string, any> = {}
  ) => {
    startTime.current = Date.now();
    let passed: boolean;
    let error: string | undefined;
    
    try {
      passed = smokeTestRunner.testComponentRender(componentName, testFn || (() => {
        // Default test just checks if component is mounted
        if (!hasRendered.current) {
          hasRendered.current = true;
        }
      })) === true;
    } catch (e) {
      passed = false;
      error = e instanceof Error ? e.message : String(e);
      console.error(`Smoke test error in ${componentName}:`, e);
    }
    
    setLastTestPassed(passed);
    
    const result = createTestResult(passed, error, componentName, testContext);
    logTestResult(result);
    
    return passed;
  }, [componentName, createTestResult, logTestResult]);
  
  /**
   * Test a specific component feature
   * @param featureName Name of the feature being tested
   * @param testFn Function that tests the feature
   * @returns Boolean indicating if the test passed
   */
  const testFeature = useCallback((
    featureName: string, 
    testFn: () => void,
    testContext: Record<string, any> = {}
  ) => {
    const fullTestName = `${componentName}.${featureName}`;
    startTime.current = Date.now();
    let passed: boolean;
    let error: string | undefined;
    
    try {
      passed = smokeTestRunner.testComponentRender(fullTestName, testFn) === true;
    } catch (e) {
      passed = false;
      error = e instanceof Error ? e.message : String(e);
      console.error(`Feature test "${featureName}" error in ${componentName}:`, e);
    }
    
    const result = createTestResult(
      passed, 
      error, 
      fullTestName,
      { ...testContext, feature: featureName }
    );
    logTestResult(result);
    
    return passed;
  }, [componentName, createTestResult, logTestResult]);
  
  /**
   * Report an error from a manual test case
   * @param error The error that occurred
   * @param feature Optional feature name if testing a specific feature
   */
  const reportError = useCallback((
    error: unknown,
    feature?: string,
    testContext: Record<string, any> = {}
  ) => {
    console.error(`Error in ${feature ? `${componentName}.${feature}` : componentName}:`, error);
    
    setLastTestPassed(false);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const testName = feature ? `${componentName}.${feature}` : componentName;
    
    const result = createTestResult(
      false, 
      errorMessage, 
      testName,
      { ...testContext, feature }
    );
    logTestResult(result);
  }, [componentName, createTestResult, logTestResult]);
  
  /**
   * Get all test results for this component
   */
  const getTestResults = useCallback(() => {
    // This would fetch from a store in a real implementation
    return lastTestResult ? [lastTestResult] : [];
  }, [lastTestResult]);
  
  return {
    // Report errors for manual test cases
    reportError,
    // Check last test result
    lastTestPassed,
    lastTestResult,
    // Run tests manually
    runTest,
    // Test specific features
    testFeature,
    // Get test results
    getTestResults,
    // Component information
    componentName,
    category
  };
};

/**
 * Get all smoke test results grouped by category
 * This would be used in a dashboard to show test results
 * @returns Record of test results by category
 */
export const getAllSmokeTestResults = (): Record<string, SmokeTestResult[]> => {
  // This would fetch from a store in a real implementation
  // For now, just return an empty object
  return {};
};

/**
 * Run all smoke tests for a specific category
 * @param category Category to run tests for
 * @returns Promise that resolves when all tests are complete
 */
export const runAllSmokeTests = async (category?: string): Promise<SmokeTestResult[]> => {
  // This would run all registered tests in a real implementation
  // For now, just return an empty array
  console.info(`[Analytics] Running all smoke tests${category ? ` for category: ${category}` : ''}`);
  return [];
};
