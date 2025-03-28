
import React from "react";
import { SmokeTestResult } from "@/hooks/smoke-testing/types";

interface SmokeTestResultsProps {
  testResults: SmokeTestResult[];
}

/**
 * Component to display the results of smoke tests
 */
export const SmokeTestResults: React.FC<SmokeTestResultsProps> = ({ testResults }) => {
  if (testResults.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="font-medium mb-2">Latest Test Run Results</h3>
      <div className="text-sm">
        {testResults.length} tests run, {testResults.filter(r => r.passed).length} passed, {
          testResults.filter(r => !r.passed).length
        } failed
      </div>
    </div>
  );
};
