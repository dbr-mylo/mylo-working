
import { useEffect, useRef, useState, useCallback } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";

/**
 * Hook to run smoke tests on component render
 * 
 * @param componentName - Name of the component being tested
 * @param deps - Optional dependency array (similar to useEffect)
 * @param options - Optional configuration options
 */
export const useSmokeTest = (
  componentName: string, 
  deps: React.DependencyList = [],
  options: {
    runOnMount?: boolean;
    logResult?: boolean;
    category?: string;
  } = {}
) => {
  const { runOnMount = true, logResult = true, category = "general" } = options;
  const hasRendered = useRef(false);
  const [lastTestPassed, setLastTestPassed] = useState<boolean | null>(null);
  
  // Run on mount if enabled
  useEffect(() => {
    // Only run once per render cycle if runOnMount is true
    if (runOnMount && !hasRendered.current) {
      const passed = smokeTestRunner.testComponentRender(componentName, () => {
        // This executes during render - if it doesn't throw, the component rendered
        hasRendered.current = true;
      });
      
      setLastTestPassed(passed);
      
      if (logResult && passed !== null) {
        console.log(
          `Smoke test for ${componentName}: ${passed ? 'PASSED ✅' : 'FAILED ❌'}`
        );
      }
    }
    
    return () => {
      // Reset on unmount
      hasRendered.current = false;
    };
  }, deps);
  
  // Function to manually run a test
  const runTest = useCallback((testFn?: () => void) => {
    const passed = smokeTestRunner.testComponentRender(componentName, testFn || (() => {
      // Default test just checks if component is mounted
      if (!hasRendered.current) {
        hasRendered.current = true;
      }
    }));
    
    setLastTestPassed(passed);
    return passed;
  }, [componentName]);
  
  // Add support for testing specific component functionality
  const testFeature = useCallback((featureName: string, testFn: () => void) => {
    const fullTestName = `${componentName}.${featureName}`;
    const passed = smokeTestRunner.testComponentRender(fullTestName, testFn);
    
    if (logResult) {
      console.log(
        `Feature test "${featureName}" for ${componentName}: ${passed ? 'PASSED ✅' : 'FAILED ❌'}`
      );
    }
    
    return passed;
  }, [componentName, logResult]);
  
  return {
    // Report errors for manual test cases
    reportError: (error: unknown) => {
      console.error(`Error in ${componentName}:`, error);
      setLastTestPassed(false);
    },
    // Check last test result
    lastTestPassed,
    // Run tests manually
    runTest,
    // Test specific features
    testFeature,
    // Get component name
    componentName
  };
};
