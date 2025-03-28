
import { useCallback } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";
import { createTestResult, logTestResult, useTestTiming } from "./test-helpers";
import { SmokeTestResult, SmokeTestExecution } from "./types";

interface UseTestExecutionProps {
  componentName: string;
  category: string;
  context: Record<string, any>;
  logResult: boolean;
  trackAnalytics: boolean;
  onTestResult?: (result: SmokeTestResult) => void;
}

/**
 * Hook providing test execution functions
 */
export const useTestExecution = ({
  componentName,
  category,
  context,
  logResult,
  trackAnalytics,
  onTestResult
}: UseTestExecutionProps): SmokeTestExecution => {
  const { startTimer, getElapsedTime } = useTestTiming();
  
  /**
   * Function to manually run a test
   */
  const runTest = useCallback((
    testFn?: () => void,
    testContext: Record<string, any> = {}
  ): boolean => {
    startTimer();
    let passed: boolean;
    let error: string | undefined;
    
    try {
      passed = smokeTestRunner.testComponentRender(componentName, testFn || (() => {
        // Default test just checks if component is mounted
      })) === true;
    } catch (e) {
      passed = false;
      error = e instanceof Error ? e.message : String(e);
      console.error(`Smoke test error in ${componentName}:`, e);
    }
    
    const result = createTestResult(
      passed, 
      error, 
      componentName,
      category,
      context,
      testContext,
      getElapsedTime()
    );
    
    logTestResult(result, logResult, trackAnalytics);
    
    if (onTestResult) {
      onTestResult(result);
    }
    
    return passed;
  }, [componentName, category, context, logResult, trackAnalytics, startTimer, getElapsedTime, onTestResult]);
  
  /**
   * Test a specific component feature
   */
  const testFeature = useCallback((
    featureName: string,
    testFn: () => void,
    testContext: Record<string, any> = {}
  ): boolean => {
    const fullTestName = `${componentName}.${featureName}`;
    startTimer();
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
      category,
      context,
      { ...testContext, feature: featureName },
      getElapsedTime()
    );
    
    logTestResult(result, logResult, trackAnalytics);
    
    if (onTestResult) {
      onTestResult(result);
    }
    
    return passed;
  }, [componentName, category, context, logResult, trackAnalytics, startTimer, getElapsedTime, onTestResult]);
  
  /**
   * Report an error from a manual test case
   */
  const reportError = useCallback((
    error: unknown,
    feature?: string,
    testContext: Record<string, any> = {}
  ): void => {
    console.error(`Error in ${feature ? `${componentName}.${feature}` : componentName}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const testName = feature ? `${componentName}.${feature}` : componentName;
    
    const result = createTestResult(
      false,
      errorMessage,
      testName,
      category,
      context,
      { ...testContext, feature },
      getElapsedTime()
    );
    
    logTestResult(result, logResult, trackAnalytics);
    
    if (onTestResult) {
      onTestResult(result);
    }
  }, [componentName, category, context, logResult, trackAnalytics, getElapsedTime, onTestResult]);
  
  return {
    runTest,
    testFeature,
    reportError
  };
};
