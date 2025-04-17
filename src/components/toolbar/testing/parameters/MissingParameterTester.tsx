import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle,
  ClipboardCopy, 
  RefreshCw,
  Play
} from 'lucide-react';
import { 
  extractAndValidateParameters, 
  MISSING_PARAMETER_SCENARIOS 
} from '@/utils/navigation/testing/parameterValidationUtils';

interface TestResult {
  routePattern: string;
  actualPath: string;
  result: {
    isValid: boolean;
    params?: Record<string, string>;
    errors?: string[];
    performanceMetrics?: {
      executionTime: number;
    };
  };
  expected: {
    params: Record<string, string> | null;
    errors?: string[];
  };
  passed: boolean;
}

/**
 * Component for testing missing parameter handling
 */
const MissingParameterTester: React.FC = () => {
  const [routePattern, setRoutePattern] = useState<string>('/user/:id/profile');
  const [actualPath, setActualPath] = useState<string>('/user/123/profile');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const getTestResultBadge = (passed: boolean) => {
    return passed ? (
      <Badge variant="default">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    );
  };

  // Run custom test
  const runCustomTest = () => {
    const result = extractAndValidateParameters(routePattern, actualPath);
    
    const testResult: TestResult = {
      routePattern,
      actualPath,
      result,
      expected: {
        params: result.params || null,
        errors: result.errors
      },
      passed: true
    };
    
    setCurrentResult(testResult);
    setSelectedScenario('');
  };

  // Run scenario
  const runScenario = (scenarioKey: string, testCaseIndex: number = 0) => {
    const scenario = MISSING_PARAMETER_SCENARIOS[scenarioKey];
    if (!scenario) return;
    
    const testCase = scenario.testCases[testCaseIndex];
    if (!testCase) return;
    
    setSelectedScenario(scenarioKey);
    setRoutePattern(scenario.routePattern);
    setActualPath(testCase.actualPath);
    
    const result = extractAndValidateParameters(scenario.routePattern, testCase.actualPath);
    
    let passed = true;
    
    if (testCase.expectedParams === null) {
      passed = passed && !result.isValid;
    } else if (testCase.expectedParams) {
      passed = passed && result.isValid && !!result.params;
      
      if (result.params) {
        Object.entries(testCase.expectedParams).forEach(([key, value]) => {
          if (result.params![key] !== value) {
            passed = false;
          }
        });
        
        if (Object.keys(result.params).length !== Object.keys(testCase.expectedParams).length) {
          passed = false;
        }
      }
    }
    
    if (testCase.expectedErrors) {
      passed = passed && !!result.errors && result.errors.length === testCase.expectedErrors.length;
    } else {
      passed = passed && (!result.errors || result.errors.length === 0);
    }
    
    const testResult: TestResult = {
      routePattern: scenario.routePattern,
      actualPath: testCase.actualPath,
      result,
      expected: {
        params: testCase.expectedParams,
        errors: testCase.expectedErrors
      },
      passed
    };
    
    setCurrentResult(testResult);
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const results: TestResult[] = [];
    
    for (const [scenarioKey, scenario] of Object.entries(MISSING_PARAMETER_SCENARIOS)) {
      for (const [testCaseIndex, testCase] of scenario.testCases.entries()) {
        const result = extractAndValidateParameters(scenario.routePattern, testCase.actualPath);
        
        let passed = true;
        
        if (testCase.expectedParams === null) {
          passed = passed && !result.isValid;
        } else if (testCase.expectedParams) {
          passed = passed && result.isValid && !!result.params;
          
          if (result.params) {
            Object.entries(testCase.expectedParams).forEach(([key, value]) => {
              if (result.params![key] !== value) {
                passed = false;
              }
            });
            
            if (Object.keys(result.params).length !== Object.keys(testCase.expectedParams).length) {
              passed = false;
            }
          }
        }
        
        if (testCase.expectedErrors) {
          passed = passed && !!result.errors;
          if (result.errors && testCase.expectedErrors) {
            passed = passed && result.errors.length === testCase.expectedErrors.length;
          }
        } else {
          passed = passed && (!result.errors || result.errors.length === 0);
        }
        
        results.push({
          routePattern: scenario.routePattern,
          actualPath: testCase.actualPath,
          result,
          expected: {
            params: testCase.expectedParams,
            errors: testCase.expectedErrors
          },
          passed
        });
      }
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  const copyResult = () => {
    if (currentResult) {
      navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Missing Parameter Tester</CardTitle>
        <CardDescription>
          Test how the application handles missing or malformed route parameters
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            <TabsTrigger value="custom">Custom Test</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 gap-5">
              {Object.entries(MISSING_PARAMETER_SCENARIOS).map(([key, scenario]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{scenario.name}</CardTitle>
                    <CardDescription className="text-xs">{scenario.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="border rounded p-3 bg-slate-50">
                      <div className="text-xs text-muted-foreground mb-1">Route Pattern:</div>
                      <code className="block bg-white p-2 rounded text-xs font-mono">
                        {scenario.routePattern}
                      </code>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Test Cases:</div>
                      <div className="space-y-2">
                        {scenario.testCases.map((testCase, index) => (
                          <div key={index} className="border rounded p-2 flex justify-between items-center">
                            <div>
                              <code className="text-xs font-mono">{testCase.actualPath}</code>
                              <div className="mt-1 flex gap-1 flex-wrap">
                                {testCase.expectedParams === null ? (
                                  <Badge variant="secondary" className="text-xs">Expected: Invalid</Badge>
                                ) : (
                                  <Badge variant="default" className="text-xs">Expected: Valid</Badge>
                                )}
                                
                                {testCase.expectedErrors && testCase.expectedErrors.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {testCase.expectedErrors.length} Error{testCase.expectedErrors.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => runScenario(key, index)}
                            >
                              Run
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Route Pattern:</label>
                <Input 
                  placeholder="/user/:id/profile" 
                  value={routePattern}
                  onChange={(e) => setRoutePattern(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use ":paramName" for required parameters and ":paramName?" for optional parameters
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Actual Path:</label>
                <Input 
                  placeholder="/user/123/profile" 
                  value={actualPath}
                  onChange={(e) => setActualPath(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button onClick={runCustomTest}>
                Validate Parameters
              </Button>
            </div>
            
            {currentResult && (
              <Card className="overflow-hidden mt-4">
                <CardHeader className="bg-slate-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Validation Result</CardTitle>
                    <Badge variant={currentResult.result.isValid ? "default" : "destructive"}>
                      {currentResult.result.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  {currentResult.result.isValid ? (
                    <div className="space-y-3">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Parameters extracted successfully</span>
                      </div>
                      
                      {currentResult.result.params && Object.keys(currentResult.result.params).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-2">Extracted parameters:</p>
                          <div className="bg-slate-50 rounded p-3">
                            {Object.entries(currentResult.result.params).map(([key, value]) => (
                              <div key={key} className="flex justify-between py-1 text-sm">
                                <span className="font-mono text-xs">{key}:</span>
                                <span className="font-mono text-xs bg-white px-2 py-0.5 rounded">
                                  {value === '' ? '(empty)' : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Parameter validation failed</span>
                      </div>
                      
                      {currentResult.result.errors && currentResult.result.errors.length > 0 && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTitle>Errors</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-4 space-y-1">
                              {currentResult.result.errors.map((error, index) => (
                                <li key={index} className="text-sm">{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  {currentResult.result.performanceMetrics && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">Performance:</p>
                      <p className="text-xs text-muted-foreground">
                        Execution time: {currentResult.result.performanceMetrics.executionTime.toFixed(2)}ms
                      </p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="bg-slate-50 p-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-auto"
                    onClick={copyResult}
                  >
                    <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                    Copy Result
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">All Test Results</h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={runAllTests} 
                disabled={isRunningTests}
              >
                {isRunningTests ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run All Tests
              </Button>
            </div>
            
            {isRunningTests ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin opacity-50" />
              </div>
            ) : testResults.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>No tests have been run yet. Click "Run All Tests" to begin testing.</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Test Case</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground w-24">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {testResults.map((result, index) => (
                      <tr key={index} className={`${result.passed ? '' : 'bg-red-50'}`}>
                        <td className="px-4 py-2">
                          <div className="font-medium">{result.routePattern}</div>
                          <div className="text-xs text-muted-foreground">{result.actualPath}</div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {getTestResultBadge(result.passed)}
                        </td>
                        <td className="px-4 py-2">
                          {result.result.isValid ? (
                            <div>
                              <span className="text-sm text-green-600">Valid</span>
                              {result.result.params && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {Object.keys(result.result.params).length} parameter(s) extracted
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="text-sm text-red-600">Invalid</span>
                              {result.result.errors && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {result.result.errors.length} error(s)
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MissingParameterTester;
