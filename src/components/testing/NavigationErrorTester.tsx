
import React from 'react';
import { useNavigationErrorTesting } from '@/hooks/navigation/useNavigationErrorTesting';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NavigationErrorType } from '@/utils/navigation/types';

/**
 * Component for testing navigation error scenarios
 */
export const NavigationErrorTester: React.FC = () => {
  const {
    errorResults,
    testMissingRoute,
    testUnauthorizedAccess,
    testMalformedParameters,
    testStateRecovery,
    runAllErrorTests,
    clearResults
  } = useNavigationErrorTesting();
  
  const getErrorTypeBadge = (errorType: NavigationErrorType | undefined) => {
    if (!errorType) return null;
    
    const variants: Record<NavigationErrorType, { variant: string, className?: string }> = {
      [NavigationErrorType.NOT_FOUND]: { variant: 'outline', className: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
      [NavigationErrorType.UNAUTHORIZED]: { variant: 'destructive' },
      [NavigationErrorType.VALIDATION_ERROR]: { variant: 'outline', className: 'border-orange-500 bg-orange-50 text-orange-700' },
      [NavigationErrorType.SERVER_ERROR]: { variant: 'outline', className: 'border-red-500 bg-red-50 text-red-700' },
    };
    
    const { variant, className } = variants[errorType];
    
    return (
      <Badge variant={variant as any} className={className}>
        {errorType}
      </Badge>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Navigation Error Testing</CardTitle>
        <CardDescription>
          Test navigation error scenarios and error handling mechanisms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="test">
          <TabsList className="mb-4">
            <TabsTrigger value="test">Run Tests</TabsTrigger>
            <TabsTrigger value="results">View Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Missing Route</CardTitle>
                  <CardDescription>Tests navigation to non-existent routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={testMissingRoute} className="w-full">
                    Test Missing Route
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Unauthorized Access</CardTitle>
                  <CardDescription>Tests accessing role-restricted routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={testUnauthorizedAccess} className="w-full">
                    Test Unauthorized Access
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Malformed Parameters</CardTitle>
                  <CardDescription>Tests handling of invalid route parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={testMalformedParameters} className="w-full">
                    Test Malformed Parameters
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">State Recovery</CardTitle>
                  <CardDescription>Tests recovery after navigation errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={testStateRecovery} className="w-full">
                    Test State Recovery
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button onClick={runAllErrorTests} className="flex-1">
                Run All Tests
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-hidden">
              {errorResults.length > 0 ? (
                <div className="divide-y">
                  {errorResults.map((result, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{result.scenario}</div>
                        <Badge variant={result.result === 'passed' ? "default" : "destructive"} className={result.result === 'passed' ? "bg-green-500 hover:bg-green-600" : undefined}>
                          {result.result === 'passed' ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {result.message}
                      </div>
                      
                      {result.error && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">Error Type:</span>
                            {getErrorTypeBadge(result.error.type)}
                          </div>
                          
                          <div className="text-xs">
                            <span className="font-medium">Path:</span>{' '}
                            <span className="font-mono">{result.error.path}</span>
                          </div>
                          
                          {result.error.message && (
                            <div className="text-xs">
                              <span className="font-medium">Message:</span>{' '}
                              {result.error.message}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No test results yet. Run tests to see results here.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
