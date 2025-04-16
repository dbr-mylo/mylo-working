
import { useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationErrorType, UserRole, NavigationError } from '@/utils/navigation/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for testing navigation error scenarios
 */
export const useNavigationErrorTesting = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [errorResults, setErrorResults] = useState<Array<{
    scenario: string;
    error: NavigationError | null;
    result: 'passed' | 'failed';
    message: string;
  }>>([]);

  /**
   * Test a missing route scenario
   */
  const testMissingRoute = useCallback(() => {
    try {
      const nonExistentRoute = '/this-route-does-not-exist-' + Date.now();
      const isValid = navigationService.validateRoute(nonExistentRoute, role);
      
      if (!isValid) {
        navigationService.handleNavigationError({
          type: NavigationErrorType.NOT_FOUND,
          path: nonExistentRoute,
          message: `Route ${nonExistentRoute} does not exist`,
          role
        });
        
        setErrorResults(prev => [
          {
            scenario: 'Missing Route',
            error: {
              type: NavigationErrorType.NOT_FOUND,
              path: nonExistentRoute,
              message: `Route ${nonExistentRoute} does not exist`,
              role
            },
            result: 'passed',
            message: 'Successfully identified non-existent route'
          },
          ...prev
        ]);
        
        return true;
      }
      
      setErrorResults(prev => [
        {
          scenario: 'Missing Route',
          error: null,
          result: 'failed',
          message: 'Failed to identify non-existent route'
        },
        ...prev
      ]);
      
      return false;
    } catch (error) {
      setErrorResults(prev => [
        {
          scenario: 'Missing Route',
          error: null,
          result: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        ...prev
      ]);
      
      return false;
    }
  }, [role]);

  /**
   * Test unauthorized access scenario
   */
  const testUnauthorizedAccess = useCallback(() => {
    try {
      // Test accessing admin route as a non-admin
      const restrictedRoute = role === 'admin' ? 
        '/design/templates' : // If admin, test designer route
        '/admin'; // Otherwise test admin route
      
      const targetRole: UserRole = role === 'admin' ? 'designer' : role || 'writer';
      const isValid = navigationService.validateRoute(restrictedRoute, targetRole);
      
      if (!isValid) {
        navigationService.handleNavigationError({
          type: NavigationErrorType.UNAUTHORIZED,
          path: restrictedRoute,
          message: `Route ${restrictedRoute} not available for role ${targetRole}`,
          role: targetRole
        });
        
        setErrorResults(prev => [
          {
            scenario: 'Unauthorized Access',
            error: {
              type: NavigationErrorType.UNAUTHORIZED,
              path: restrictedRoute,
              message: `Route ${restrictedRoute} not available for role ${targetRole}`,
              role: targetRole
            },
            result: 'passed',
            message: 'Successfully identified unauthorized access'
          },
          ...prev
        ]);
        
        return true;
      }
      
      setErrorResults(prev => [
        {
          scenario: 'Unauthorized Access',
          error: null,
          result: 'failed',
          message: 'Failed to identify unauthorized access'
        },
        ...prev
      ]);
      
      return false;
    } catch (error) {
      setErrorResults(prev => [
        {
          scenario: 'Unauthorized Access',
          error: null,
          result: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        ...prev
      ]);
      
      return false;
    }
  }, [role]);

  /**
   * Test malformed deep link parameters
   */
  const testMalformedParameters = useCallback(() => {
    try {
      const malformedPath = '/editor/abc%ZZ'; // Malformed URL encoding
      
      try {
        const params = navigationService.extractRouteParameters('/editor/:documentId', malformedPath);
        
        if (params === null) {
          // Successfully identified malformed parameters
          navigationService.handleNavigationError({
            type: NavigationErrorType.VALIDATION_ERROR,
            path: malformedPath,
            message: 'Malformed URL parameters',
            role
          });
          
          setErrorResults(prev => [
            {
              scenario: 'Malformed Parameters',
              error: {
                type: NavigationErrorType.VALIDATION_ERROR,
                path: malformedPath,
                message: 'Malformed URL parameters',
                role
              },
              result: 'passed',
              message: 'Successfully identified malformed parameters'
            },
            ...prev
          ]);
          
          return true;
        }
        
        setErrorResults(prev => [
          {
            scenario: 'Malformed Parameters',
            error: null,
            result: 'failed',
            message: 'Failed to identify malformed parameters'
          },
          ...prev
        ]);
        
        return false;
      } catch (error) {
        // An exception is also acceptable for malformed parameters
        navigationService.handleNavigationError({
          type: NavigationErrorType.VALIDATION_ERROR,
          path: malformedPath,
          message: 'Error parsing URL parameters',
          role
        });
        
        setErrorResults(prev => [
          {
            scenario: 'Malformed Parameters',
            error: {
              type: NavigationErrorType.VALIDATION_ERROR,
              path: malformedPath,
              message: 'Error parsing URL parameters',
              role
            },
            result: 'passed',
            message: 'Successfully caught error from malformed parameters'
          },
          ...prev
        ]);
        
        return true;
      }
    } catch (error) {
      setErrorResults(prev => [
        {
          scenario: 'Malformed Parameters',
          error: null,
          result: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        ...prev
      ]);
      
      return false;
    }
  }, [role]);

  /**
   * Test state recovery after navigation error
   */
  const testStateRecovery = useCallback(() => {
    try {
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
        navigationService.handleNavigationError({
          type: NavigationErrorType.NOT_FOUND,
          path: invalidPath,
          message: `Route ${invalidPath} does not exist`,
          role
        });
        
        // In a real scenario, the user would be redirected to the fallback route
        // For testing purposes, we just check if the fallback route is valid
        const isFallbackValid = navigationService.validateRoute(fallbackRoute, role);
        
        if (isFallbackValid) {
          setErrorResults(prev => [
            {
              scenario: 'State Recovery',
              error: null,
              result: 'passed',
              message: `Successfully recovered to fallback route: ${fallbackRoute}`
            },
            ...prev
          ]);
          
          toast({
            title: 'Recovery Test Successful',
            description: `Would recover to: ${fallbackRoute}`,
          });
          
          return true;
        }
      }
      
      setErrorResults(prev => [
        {
          scenario: 'State Recovery',
          error: null,
          result: 'failed',
          message: 'Failed to properly recover from navigation error'
        },
        ...prev
      ]);
      
      return false;
    } catch (error) {
      setErrorResults(prev => [
        {
          scenario: 'State Recovery',
          error: null,
          result: 'failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        ...prev
      ]);
      
      return false;
    }
  }, [role, toast]);
  
  /**
   * Run all error tests
   */
  const runAllErrorTests = useCallback(() => {
    testMissingRoute();
    testUnauthorizedAccess();
    testMalformedParameters();
    testStateRecovery();
  }, [testMissingRoute, testUnauthorizedAccess, testMalformedParameters, testStateRecovery]);
  
  /**
   * Clear test results
   */
  const clearResults = useCallback(() => {
    setErrorResults([]);
  }, []);

  return {
    errorResults,
    testMissingRoute,
    testUnauthorizedAccess,
    testMalformedParameters,
    testStateRecovery,
    runAllErrorTests,
    clearResults
  };
};
