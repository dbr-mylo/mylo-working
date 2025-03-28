
import { useCallback, useRef } from "react";
import { smokeTestRunner } from "@/utils/testing/smokeTesting";
import { SmokeTestResult, SmokeTestMetadata } from "./types";

/**
 * Create a test result object
 */
export const createTestResult = (
  passed: boolean,
  error: string | undefined,
  componentName: string,
  category: string = "general",
  context: Record<string, any> = {},
  testContext: Record<string, any> = {},
  duration?: number
): SmokeTestResult => {
  return {
    passed,
    error,
    component: componentName,
    timestamp: new Date().toISOString(),
    duration,
    context: {
      ...context,
      ...testContext,
      category
    }
  };
};

/**
 * Log a test result to the console
 */
export const logTestResult = (
  result: SmokeTestResult,
  logEnabled: boolean = true,
  trackAnalytics: boolean = true
): void => {
  if (logEnabled) {
    console.info(
      `Smoke test for ${result.component}: ${result.passed ? 'PASSED ✅' : 'FAILED ❌'}${
        result.error ? ` - ${result.error}` : ''
      }${result.duration ? ` (${result.duration}ms)` : ''}`
    );
  }
  
  // Track analytics if enabled
  if (trackAnalytics) {
    // This would send to an analytics service in production
    console.info(`[Analytics] Smoke test result: ${JSON.stringify(result)}`);
  }
};

/**
 * Hooks for measuring test duration
 */
export const useTestTiming = () => {
  const startTime = useRef<number | null>(null);
  
  const startTimer = useCallback(() => {
    startTime.current = Date.now();
  }, []);
  
  const getElapsedTime = useCallback((): number | undefined => {
    if (startTime.current === null) return undefined;
    return Date.now() - startTime.current;
  }, []);
  
  return { startTimer, getElapsedTime };
};

/**
 * Helper to track component render state
 */
export const useRenderTracking = () => {
  const hasRendered = useRef(false);
  
  const markAsRendered = useCallback(() => {
    hasRendered.current = true;
  }, []);
  
  const resetRenderState = useCallback(() => {
    hasRendered.current = false;
  }, []);
  
  return {
    hasRendered,
    markAsRendered,
    resetRenderState
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
