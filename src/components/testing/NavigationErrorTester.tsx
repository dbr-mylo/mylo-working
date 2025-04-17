import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigationErrorTesting } from '@/hooks/navigation/useNavigationErrorTesting';
import { NavigationErrorType } from '@/utils/navigation/types';
import { Loader2, CheckCircle, XCircle, AlertTriangle, InfoIcon } from 'lucide-react';

/**
 * Component for testing navigation error scenarios
 */
const NavigationErrorTester: React.FC = () => {
  const {
    errorResults,
    testMetrics,
    isRunningTests,
    testMissingRoute,
    testUnauthorizedAccess,
    testMalformedParameters,
    testServerError,
    testStateRecovery,
    testRapidNavigationErrors,
    testRoleTransitionError,
    runAllErrorTests,
    clearResults
  } = useNavigationErrorTesting();
  
  /**
   * Get appropriate badge variant for error type
   */
  const getErrorTypeBadge = (type?: NavigationErrorType) => {
    if (!type) return <Badge variant="outline">Unknown</Badge>;
    
    switch (type) {
      case NavigationErrorType.NOT_FOUND:
        return <Badge variant="destructive">Not Found</Badge>;
      case NavigationErrorType.UNAUTHORIZED:
        return <Badge variant="destructive">Unauthorized</Badge>;
      case NavigationErrorType.VALIDATION_ERROR:
        return <Badge variant="secondary">Validation Error</Badge>;
      case NavigationErrorType.SERVER_ERROR:
        return <Badge variant="destructive">Server Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Error Testing</CardTitle>
          <CardDescription>
            Test various navigation error scenarios and how they're handled by the application
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="basic">Basic Tests</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Tests</TabsTrigger>
            </TabsList>
            
            {/* Basic error scenarios */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={testMissingRoute} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Missing Route
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testUnauthorizedAccess} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Unauthorized Access
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testMalformedParameters} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Malformed Parameters
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testServerError} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Server Error
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testStateRecovery} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <InfoIcon className="mr-2 h-4 w-4" /> 
                  Test State Recovery
                </Button>
                
                <Button 
                  onClick={runAllErrorTests} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  {isRunningTests ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Run All Tests
                </Button>
              </div>
            </TabsContent>
            
            {/* Advanced error scenarios */}
            <TabsContent value="advanced" className="space-y-4">
              <Alert className="mb-4">
                <AlertDescription>
                  Advanced tests simulate complex error scenarios like multiple errors in rapid succession and 
                  errors during role transitions.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={testRapidNavigationErrors} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Rapid Navigation Errors
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={testRoleTransitionError} 
                  disabled={isRunningTests}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> 
                  Test Role Transition Error
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Test metrics summary */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Test Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="border rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{testMetrics.totalTests}</div>
                <div className="text-xs text-muted-foreground">Total Tests</div>
              </div>
              
              <div className="border rounded-md p-3 text-center bg-green-50">
                <div className="text-2xl font-bold text-green-700">{testMetrics.passedTests}</div>
                <div className="text-xs text-green-600">Passed</div>
              </div>
              
              <div className="border rounded-md p-3 text-center bg-red-50">
                <div className="text-2xl font-bold text-red-700">{testMetrics.failedTests}</div>
                <div className="text-xs text-red-600">Failed</div>
              </div>
              
              <div className="border rounded-md p-3 text-center bg-blue-50">
                <div className="text-2xl font-bold text-blue-700">
                  {testMetrics.totalTests > 0 
                    ? Math.round((testMetrics.passedTests / testMetrics.totalTests) * 100) 
                    : 0}%
                </div>
                <div className="text-xs text-blue-600">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Test results */}
          <div className="mt-6 border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Test Results</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearResults}
                disabled={errorResults.length === 0 || isRunningTests}
              >
                Clear Results
              </Button>
            </div>
            
            {isRunningTests && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                <span>Running tests...</span>
              </div>
            )}
            
            {!isRunningTests && errorResults.length === 0 && (
              <div className="text-center text-muted-foreground p-4">
                No test results yet. Run a test to see results.
              </div>
            )}
            
            {!isRunningTests && errorResults.length > 0 && (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {errorResults.map((result, index) => (
                  <div key={index} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {result.result === 'passed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">{result.scenario}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result.error && getErrorTypeBadge(result.error.type)}
                        <Badge variant="outline" className="text-xs">
                          {formatTimestamp(result.timestamp)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm">{result.message}</p>
                    
                    {result.recoverySteps && result.recoverySteps.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground block">Recovery steps:</span>
                        <ul className="list-disc pl-5 text-xs">
                          {result.recoverySteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.performanceMetrics && (
                      <div className="text-xs text-muted-foreground">
                        <span>Detection: {result.performanceMetrics.detectionTime ? 
                          `${Math.round(result.performanceMetrics.detectionTime)}ms` : 'N/A'}
                        </span>
                        {result.performanceMetrics.recoveryTime && (
                          <span className="ml-3">
                            Recovery: {Math.round(result.performanceMetrics.recoveryTime)}ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={clearResults}
            disabled={errorResults.length === 0 || isRunningTests}
          >
            Clear All Results
          </Button>
          <Button 
            onClick={runAllErrorTests} 
            disabled={isRunningTests}
          >
            {isRunningTests ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Run All Tests
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NavigationErrorTester;
