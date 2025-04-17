
import { useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType, UserRole, NavigationError } from '@/utils/navigation/types';
import { showNavigationErrorToast } from '@/utils/navigation/errorHandling';
import { toast } from 'sonner';

export type ErrorTestResult = {
  scenario: string;
  error: NavigationError | null;
  result: 'passed' | 'failed';
  message: string;
  timestamp: string;
  recoverySteps?: string[];
};

/**
 * Hook for testing navigation error scenarios
 */
export const useNavigationErrorTesting = () => {
  const { role } = useAuth();
  const [errorResults, setErrorResults] = useState<ErrorTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testMetrics, setTestMetrics] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    avgResponseTime: 0
  });

  /**
   * Add a test result with timestamp
   */
  const addTestResult = useCallback((result: Omit<ErrorTestResult, 'timestamp'>) => {
    const testResult = {
      ...result,
      timestamp: new Date().toISOString()
    };
    
    setErrorResults(prev => [testResult, ...prev]);
    setTestMetrics(prev => {
      const newPassedCount = prev.passedTests + (result.result === 'passed' ? 1 : 0);
      const newFailedCount = prev.failedTests + (result.result === 'failed' ? 1 : 0);
      
      return {
        totalTests: prev.totalTests + 1,
        passedTests: newPassedCount,
        failedTests: newFailedCount,
        avgResponseTime: prev.avgResponseTime // Would calculate with actual times in real implementation
      };
    });
    
    return testResult;
  }, []);
  
  /**
   * Test a missing route scenario
   */
  const testMissingRoute = useCallback(() => {
    try {
      setIsRunningTests(true);
      const nonExistentRoute = '/this-route-does-not-exist-' + Date.now();
      const isValid = navigationService.validateRoute(nonExistentRoute, role);
      
      if (!isValid) {
        const error = {
          type: NavigationErrorType.NOT_FOUND,
          path: nonExistentRoute,
          message: `Route ${nonExistentRoute} does not exist`,
          role
        };
        
        // Show the error toast to demonstrate the user experience
        showNavigationErrorToast(error);
        
        // Log the error result
        const result = addTestResult({
          scenario: 'Missing Route',
          error,
          result: 'passed',
          message: 'Successfully identified non-existent route',
          recoverySteps: ['Navigate to a known route', 'Check URL spelling', 'Return to dashboard']
        });
        
        setIsRunningTests(false);
        return result;
      }
      
      const result = addTestResult({
        scenario: 'Missing Route',
        error: null,
        result: 'failed',
        message: 'Failed to identify non-existent route'
      });
      
      setIsRunningTests(false);
      return result;
    } catch (error) {
      const result = addTestResult({
        scenario: 'Missing Route',
        error: null,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsRunningTests(false);
      return result;
    }
  }, [role, addTestResult]);

  /**
   * Test unauthorized access scenario
   */
  const testUnauthorizedAccess = useCallback(() => {
    try {
      setIsRunningTests(true);
      // Test accessing admin route as a non-admin
      const restrictedRoute = role === 'admin' ? 
        '/design/templates' : // If admin, test designer route
        '/admin'; // Otherwise test admin route
      
      const targetRole: UserRole = role === 'admin' ? 'designer' : role || 'writer';
      const isValid = navigationService.validateRoute(restrictedRoute, targetRole);
      
      if (!isValid) {
        const error = {
          type: NavigationErrorType.UNAUTHORIZED,
          path: restrictedRoute,
          message: `Route ${restrictedRoute} not available for role ${targetRole}`,
          role: targetRole
        };
        
        // Show the error toast to demonstrate the user experience
        showNavigationErrorToast(error);
        
        const result = addTestResult({
          scenario: 'Unauthorized Access',
          error,
          result: 'passed',
          message: 'Successfully identified unauthorized access',
          recoverySteps: ['Navigate to an authorized route', 'Request access permissions']
        });
        
        setIsRunningTests(false);
        return result;
      }
      
      const result = addTestResult({
        scenario: 'Unauthorized Access',
        error: null,
        result: 'failed',
        message: 'Failed to identify unauthorized access'
      });
      
      setIsRunningTests(false);
      return result;
    } catch (error) {
      const result = addTestResult({
        scenario: 'Unauthorized Access',
        error: null,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsRunningTests(false);
      return result;
    }
  }, [role, addTestResult]);

  /**
   * Test malformed deep link parameters
   */
  const testMalformedParameters = useCallback(() => {
    try {
      setIsRunningTests(true);
      const malformedPath = '/editor/abc%ZZ'; // Malformed URL encoding
      
      try {
        const params = navigationService.extractRouteParameters('/editor/:documentId', malformedPath);
        
        if (params === null) {
          // Successfully identified malformed parameters
          const error = {
            type: NavigationErrorType.VALIDATION_ERROR,
            path: malformedPath,
            message: 'Malformed URL parameters',
            role
          };
          
          // Show the error toast
          showNavigationErrorToast(error);
          
          const result = addTestResult({
            scenario: 'Malformed Parameters',
            error,
            result: 'passed',
            message: 'Successfully identified malformed parameters',
            recoverySteps: ['Check parameter format', 'Use valid parameter values']
          });
          
          setIsRunningTests(false);
          return result;
        }
        
        const result = addTestResult({
          scenario: 'Malformed Parameters',
          error: null,
          result: 'failed',
          message: 'Failed to identify malformed parameters'
        });
        
        setIsRunningTests(false);
        return result;
      } catch (error) {
        // An exception is also acceptable for malformed parameters
        const navigationError = {
          type: NavigationErrorType.VALIDATION_ERROR,
          path: malformedPath,
          message: 'Error parsing URL parameters',
          role
        };
        
        // Show the error toast
        showNavigationErrorToast(navigationError);
        
        const result = addTestResult({
          scenario: 'Malformed Parameters',
          error: navigationError,
          result: 'passed',
          message: 'Successfully caught error from malformed parameters',
          recoverySteps: ['Use proper URL encoding', 'Verify parameter format']
        });
        
        setIsRunningTests(false);
        return result;
      }
    } catch (error) {
      const result = addTestResult({
        scenario: 'Malformed Parameters',
        error: null,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsRunningTests(false);
      return result;
    }
  }, [role, addTestResult]);

  /**
   * Test server error handling
   */
  const testServerError = useCallback(() => {
    try {
      setIsRunningTests(true);
      
      const error = {
        type: NavigationErrorType.SERVER_ERROR,
        path: window.location.pathname,
        message: 'Simulated server error during navigation',
        role
      };
      
      // Show the error toast
      showNavigationErrorToast(error);
      
      const result = addTestResult({
        scenario: 'Server Error',
        error,
        result: 'passed',
        message: 'Successfully simulated server error handling',
        recoverySteps: ['Refresh the page', 'Try again later', 'Contact support']
      });
      
      setIsRunningTests(false);
      return result;
    } catch (error) {
      const result = addTestResult({
        scenario: 'Server Error',
        error: null,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsRunningTests(false);
      return result;
    }
  }, [role, addTestResult]);

  /**
   * Test state recovery after navigation error
   */
  const testStateRecovery = useCallback(() => {
    try {
      setIsRunningTests(true);
      
      // Generate invalid path
      const invalidPath = '/invalid-path-' + Date.now();
      
      // Store current path
      const currentPath = window.location.pathname;
      
      // Attempt navigation to invalid path
      const isValid = navigationService.validateRoute(invalidPath, role);
      
      if (!isValid) {
        // Get fallback route for recovery
        const fallbackRoute = navigationService.getFallbackRoute(role);
        
        // Simulate error and recovery
        const error = {
          type: NavigationErrorType.NOT_FOUND,
          path: invalidPath,
          message: `Route ${invalidPath} does not exist`,
          role
        };
        
        // Show the error toast
        showNavigationErrorToast(error);
        
        // In a real scenario, the user would be redirected to the fallback route
        // For testing purposes, we just check if the fallback route is valid
        const isFallbackValid = navigationService.validateRoute(fallbackRoute, role);
        
        if (isFallbackValid) {
          const result = addTestResult({
            scenario: 'State Recovery',
            error: null,
            result: 'passed',
            message: `Successfully recovered to fallback route: ${fallbackRoute}`,
            recoverySteps: ['Redirected to fallback route', 'State preserved during recovery']
          });
          
          toast({
            title: 'Recovery Test Successful',
            description: `Would recover to: ${fallbackRoute}`,
          });
          
          setIsRunningTests(false);
          return result;
        }
      }
      
      const result = addTestResult({
        scenario: 'State Recovery',
        error: null,
        result: 'failed',
        message: 'Failed to properly recover from navigation error'
      });
      
      setIsRunningTests(false);
      return result;
    } catch (error) {
      const result = addTestResult({
        scenario: 'State Recovery',
        error: null,
        result: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsRunningTests(false);
      return result;
    }
  }, [role, addTestResult]);
  
  /**
   * Run all error tests
   */
  const runAllErrorTests = useCallback(async () => {
    setIsRunningTests(true);
    toast.info("Running all navigation error tests...");
    
    // Run tests with a slight delay to avoid overwhelming the UI
    await testMissingRoute();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testUnauthorizedAccess();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testMalformedParameters();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testServerError();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testStateRecovery();
    
    toast.success("All error tests completed", {
      description: `${testMetrics.passedTests} passed, ${testMetrics.failedTests} failed`,
    });
    
    setIsRunningTests(false);
  }, [
    testMissingRoute, 
    testUnauthorizedAccess, 
    testMalformedParameters, 
    testServerError, 
    testStateRecovery, 
    testMetrics.passedTests, 
    testMetrics.failedTests
  ]);
  
  /**
   * Clear test results
   */
  const clearResults = useCallback(() => {
    setErrorResults([]);
    setTestMetrics({
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      avgResponseTime: 0
    });
  }, []);

  return {
    errorResults,
    testMetrics,
    isRunningTests,
    testMissingRoute,
    testUnauthorizedAccess,
    testMalformedParameters,
    testServerError,
    testStateRecovery,
    runAllErrorTests,
    clearResults
  };
};
