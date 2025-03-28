
import { useEffect } from "react";
import { useRenderTracking } from "./test-helpers";
import { useTestExecution } from "./useTestExecution";
import { useTestResults } from "./useTestResults";
import { SmokeTestOptions, SmokeTestExecution, SmokeTestResults, SmokeTestMetadata } from "./types";

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
): SmokeTestExecution & SmokeTestResults & SmokeTestMetadata => {
  const { 
    runOnMount = true, 
    logResult = true, 
    category = "general",
    trackAnalytics = true,
    context = {}
  } = options;
  
  const { hasRendered, markAsRendered, resetRenderState } = useRenderTracking();
  const { lastTestPassed, lastTestResult, getTestResults, setTestResult } = useTestResults();
  
  const testExecution = useTestExecution({
    componentName,
    category,
    context,
    logResult,
    trackAnalytics,
    onTestResult: setTestResult
  });
  
  // Run on mount if enabled
  useEffect(() => {
    // Only run once per render cycle if runOnMount is true
    if (runOnMount && !hasRendered.current) {
      testExecution.runTest(() => {
        // This executes during render - if it doesn't throw, the component rendered
        markAsRendered();
      });
    }
    
    return () => {
      // Reset on unmount
      resetRenderState();
    };
  }, deps);
  
  return {
    ...testExecution,
    lastTestPassed,
    lastTestResult,
    getTestResults,
    componentName,
    category
  };
};

// Re-export types and helper functions
export * from "./types";
export * from "./test-helpers";
