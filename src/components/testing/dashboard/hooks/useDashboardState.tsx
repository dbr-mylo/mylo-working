
import { useState, useEffect } from 'react';
import { smokeTestRunner } from "@/utils/testing/smokeTesting";
import { toast } from "sonner";
import { SmokeTestResult } from "@/hooks/useSmokeTest";

export const useDashboardState = (onTestRunComplete?: (results: SmokeTestResult[]) => void) => {
  const [results, setResults] = useState(smokeTestRunner.getResults());
  const [showErrorTest, setShowErrorTest] = useState(false);
  const [testEnabled, setTestEnabled] = useState(
    process.env.NODE_ENV === 'development'
  );
  
  // Update results every second
  useEffect(() => {
    const interval = setInterval(() => {
      setResults(smokeTestRunner.getResults());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const summary = smokeTestRunner.getSummary();
  
  const toggleTests = () => {
    const newState = !testEnabled;
    smokeTestRunner.setEnabled(newState);
    setTestEnabled(newState);
    toast(newState ? "Tests enabled" : "Tests disabled");
  };
  
  const clearResults = () => {
    smokeTestRunner.clearResults();
    setResults([]);
    toast("Test results cleared");
  };
  
  const runErrorTest = () => {
    setShowErrorTest(true);
    setTimeout(() => setShowErrorTest(false), 2000);
  };
  
  const runAllTests = () => {
    toast("Running all smoke tests...");
    console.log("Running all smoke tests");
    
    // Report results to parent component if callback is provided
    const testResults = smokeTestRunner.getResults();
    if (onTestRunComplete) {
      onTestRunComplete(testResults);
    }
    
    toast.success("All tests completed", {
      description: `${summary.passed} passed, ${summary.failed} failed`,
    });
  };
  
  return {
    results,
    showErrorTest,
    testEnabled,
    summary,
    toggleTests,
    clearResults,
    runErrorTest,
    runAllTests
  };
};
