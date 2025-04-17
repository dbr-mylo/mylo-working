
import React, { useState } from 'react';
import { useNavigationErrorTesting, ErrorTestResult } from '@/hooks/navigation/useNavigationErrorTesting';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { NavigationErrorType } from '@/utils/navigation/types';
import { Loader2, AlertCircle, CheckCircle, RefreshCcw, Terminal, ShieldAlert, FileWarning, ServerCrash } from 'lucide-react';

/**
 * Component for testing navigation error scenarios
 */
export const NavigationErrorTester: React.FC = () => {
  const {
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
  } = useNavigationErrorTesting();
  
  const [selectedResult, setSelectedResult] = useState<ErrorTestResult | null>(null);
  
  const getErrorTypeBadge = (errorType: NavigationErrorType | undefined) => {
    if (!errorType) return null;
    
    const variants: Record<NavigationErrorType, { variant: string, className?: string, icon: React.ReactNode }> = {
      [NavigationErrorType.NOT_FOUND]: { 
        variant: 'outline', 
        className: 'border-yellow-500 bg-yellow-50 text-yellow-700',
        icon: <FileWarning className="h-3 w-3 mr-1" />
      },
      [NavigationErrorType.UNAUTHORIZED]: { 
        variant: 'destructive',
        icon: <ShieldAlert className="h-3 w-3 mr-1" />
      },
      [NavigationErrorType.VALIDATION_ERROR]: { 
        variant: 'outline', 
        className: 'border-orange-500 bg-orange-50 text-orange-700',
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      },
      [NavigationErrorType.SERVER_ERROR]: { 
        variant: 'outline', 
        className: 'border-red-500 bg-red-50 text-red-700',
        icon: <ServerCrash className="h-3 w-3 mr-1" />
      },
    };
    
    const { variant, className, icon } = variants[errorType];
    
    return (
      <Badge variant={variant as any} className={className}>
        <span className="flex items-center">
          {icon}
          {errorType}
        </span>
      </Badge>
    );
  };
  
  const handleViewDetails = (result: ErrorTestResult) => {
    setSelectedResult(result);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Navigation Error Testing</CardTitle>
            <CardDescription>
              Test navigation error scenarios and error handling mechanisms
            </CardDescription>
          </div>
          
          {testMetrics.totalTests > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {testMetrics.totalTests} Tests Run
              </Badge>
              <Badge variant="default" className="bg-green-500">
                {testMetrics.passedTests} Passed
              </Badge>
              {testMetrics.failedTests > 0 && (
                <Badge variant="destructive">
                  {testMetrics.failedTests} Failed
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="test">
          <TabsList className="mb-4">
            <TabsTrigger value="test">Run Tests</TabsTrigger>
            <TabsTrigger value="results">View Results</TabsTrigger>
            {selectedResult && <TabsTrigger value="details">Test Details</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="test" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-yellow-500" />
                    Missing Route
                  </CardTitle>
                  <CardDescription>Tests navigation to non-existent routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testMissingRoute} 
                    className="w-full"
                    disabled={isRunningTests}
                  >
                    {isRunningTests ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Terminal className="h-4 w-4 mr-2" />
                    )}
                    Test Missing Route
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2 text-red-500" />
                    Unauthorized Access
                  </CardTitle>
                  <CardDescription>Tests accessing role-restricted routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testUnauthorizedAccess} 
                    className="w-full"
                    disabled={isRunningTests}
                  >
                    {isRunningTests ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Terminal className="h-4 w-4 mr-2" />
                    )}
                    Test Unauthorized Access
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                    Malformed Parameters
                  </CardTitle>
                  <CardDescription>Tests handling of invalid route parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testMalformedParameters} 
                    className="w-full"
                    disabled={isRunningTests}
                  >
                    {isRunningTests ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Terminal className="h-4 w-4 mr-2" />
                    )}
                    Test Malformed Parameters
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ServerCrash className="h-4 w-4 mr-2 text-red-500" />
                    Server Error
                  </CardTitle>
                  <CardDescription>Tests handling of server-side errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testServerError} 
                    className="w-full"
                    disabled={isRunningTests}
                  >
                    {isRunningTests ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Terminal className="h-4 w-4 mr-2" />
                    )}
                    Test Server Error
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <RefreshCcw className="h-4 w-4 mr-2 text-blue-500" />
                    State Recovery
                  </CardTitle>
                  <CardDescription>Tests recovery after navigation errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={testStateRecovery} 
                    className="w-full"
                    disabled={isRunningTests}
                  >
                    {isRunningTests ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Terminal className="h-4 w-4 mr-2" />
                    )}
                    Test State Recovery
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={runAllErrorTests} 
                className="flex-1"
                disabled={isRunningTests}
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button onClick={clearResults} variant="outline" disabled={isRunningTests || errorResults.length === 0}>
                Clear Results
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="border rounded-md overflow-hidden">
              {errorResults.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {errorResults.map((result, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{result.scenario}</div>
                          <Badge variant={result.result === 'passed' ? "default" : "destructive"} className={result.result === 'passed' ? "bg-green-500 hover:bg-green-600" : undefined}>
                            <span className="flex items-center">
                              {result.result === 'passed' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              {result.result === 'passed' ? 'Passed' : 'Failed'}
                            </span>
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
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleString()}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(result)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No test results yet. Run tests to see results here.
                </div>
              )}
            </div>
          </TabsContent>
          
          {selectedResult && (
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedResult.scenario} Test Details</CardTitle>
                  <CardDescription>
                    Test ran at {new Date(selectedResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Result</h3>
                    <Badge variant={selectedResult.result === 'passed' ? "default" : "destructive"} className={selectedResult.result === 'passed' ? "bg-green-500 hover:bg-green-600" : undefined}>
                      {selectedResult.result === 'passed' ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Message</h3>
                    <p className="text-muted-foreground">{selectedResult.message}</p>
                  </div>
                  
                  {selectedResult.error && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Error Details</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">Type:</span>
                          {getErrorTypeBadge(selectedResult.error.type)}
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Path:</span>{' '}
                          <span className="font-mono text-sm">{selectedResult.error.path}</span>
                        </div>
                        {selectedResult.error.message && (
                          <div>
                            <span className="font-medium">Message:</span>{' '}
                            <span>{selectedResult.error.message}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedResult.recoverySteps && selectedResult.recoverySteps.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Recovery Steps</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedResult.recoverySteps.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setSelectedResult(null)}>
                    Back to Results
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NavigationErrorTester;
