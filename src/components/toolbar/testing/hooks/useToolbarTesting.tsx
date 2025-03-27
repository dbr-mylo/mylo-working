
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToolbarPersistence } from './useToolbarPersistence';
import { useToolbarTestExecution } from './useToolbarTestExecution';
import { TestResult } from './useToolbarTestResult';

export type { TestResult } from './useToolbarTestResult';

export const useToolbarTesting = () => {
  const {
    currentTest,
    setCurrentTest,
    content,
    setContent,
    testResults,
    setTestResults,
    selectedRoleForTesting,
    setSelectedRoleForTesting,
    resetTestResults
  } = useToolbarPersistence();
  
  const { role } = useAuth();
  
  // Initialize role for testing when auth role changes
  useEffect(() => {
    setSelectedRoleForTesting(role);
  }, [role, setSelectedRoleForTesting]);

  const { runTest: executeTest } = useToolbarTestExecution(setTestResults);
  
  // Wrapper function to pass the current role
  const runTest = (testType: string) => {
    executeTest(testType, role);
  };

  return {
    currentTest,
    setCurrentTest,
    content,
    setContent,
    testResults,
    setTestResults,
    selectedRoleForTesting,
    setSelectedRoleForTesting,
    runTest,
    resetTestResults
  };
};
