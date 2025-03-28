
import { useState, useCallback } from "react";
import { SmokeTestResult, SmokeTestResults } from "./types";

/**
 * Hook for managing test results
 */
export const useTestResults = (): SmokeTestResults & { setTestResult: (result: SmokeTestResult) => void } => {
  const [lastTestResult, setLastTestResult] = useState<SmokeTestResult | null>(null);
  const [lastTestPassed, setLastTestPassed] = useState<boolean | null>(null);
  
  const setTestResult = useCallback((result: SmokeTestResult) => {
    setLastTestResult(result);
    setLastTestPassed(result.passed);
  }, []);
  
  const getTestResults = useCallback(() => {
    // This would fetch from a store in a real implementation
    return lastTestResult ? [lastTestResult] : [];
  }, [lastTestResult]);
  
  return {
    lastTestPassed,
    lastTestResult,
    getTestResults,
    setTestResult
  };
};
