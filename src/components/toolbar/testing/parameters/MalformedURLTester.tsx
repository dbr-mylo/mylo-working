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
  Play,
  RefreshCw
} from 'lucide-react';
import { 
  validateURLPath, 
  URLValidationResult, 
  MALFORMED_URL_SCENARIOS,
  URLValidationErrorType
} from '@/utils/navigation/testing/urlValidationUtils';

/**
 * Component for testing malformed URL handling
 */
const MalformedURLTester: React.FC = () => {
  const [customUrl, setCustomUrl] = useState<string>('');
  const [validationResult, setValidationResult] = useState<URLValidationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, URLValidationResult>>({});
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Run a specific test scenario
  const runScenario = (scenarioKey: string) => {
    setSelectedScenario(scenarioKey);
    const scenario = MALFORMED_URL_SCENARIOS[scenarioKey];
    if (scenario) {
      setCustomUrl(scenario.input);
      const result = validateURLPath(scenario.input);
      setValidationResult(result);
    }
  };

  // Run custom URL test
  const runCustomTest = () => {
    const result = validateURLPath(customUrl);
    setValidationResult(result);
    setSelectedScenario('');
  };

  // Run all test scenarios
  const runAllTests = async () => {
    setIsRunningTests(true);
    
    // Slight delay to allow UI to update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const results: Record<string, URLValidationResult> = {};
    
    for (const [key, scenario] of Object.entries(MALFORMED_URL_SCENARIOS)) {
      results[key] = validateURLPath(scenario.input);
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  // Get appropriate status badge
  const getStatusBadge = (result: URLValidationResult, expected?: boolean) => {
    if (expected !== undefined && result.isValid !== expected) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    
    if (result.isValid) {
      return <Badge variant="default">Valid</Badge>;
    }
    
    return <Badge variant="destructive">Invalid</Badge>;
  };

  // Get error type badge
  const getErrorTypeBadge = (errorType?: URLValidationErrorType) => {
    if (!errorType) return null;
    
    switch (errorType) {
      case URLValidationErrorType.EMPTY_PATH:
        return <Badge variant="outline" className="bg-slate-100">Empty Path</Badge>;
      case URLValidationErrorType.INVALID_PATH_FORMAT:
        return <Badge variant="secondary">Invalid Format</Badge>;
      case URLValidationErrorType.INVALID_CHARACTERS:
        return <Badge variant="secondary">Invalid Characters</Badge>;
      case URLValidationErrorType.PATH_TOO_LONG:
        return <Badge variant="secondary">Path Too Long</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Copy result to clipboard
  const copyResult = () => {
    if (validationResult) {
      navigator.clipboard.writeText(JSON.stringify(validationResult, null, 2));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Malformed URL Tester</CardTitle>
        <CardDescription>
          Test how the application handles malformed URLs and edge cases
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(MALFORMED_URL_SCENARIOS).map(([key, scenario]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{scenario.name}</CardTitle>
                    <CardDescription className="text-xs">{scenario.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <code className="block bg-slate-50 p-2 rounded text-xs font-mono whitespace-nowrap overflow-hidden text-ellipsis" title={scenario.input}>
                      {scenario.input || '(empty string)'}
                    </code>
                    
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Badge variant={scenario.expected.isValid ? "default" : "outline"}>
                        Expected: {scenario.expected.isValid ? 'Valid' : 'Invalid'}
                      </Badge>
                      {scenario.expected.errorType && (
                        <Badge variant="outline" className="text-xs">
                          {scenario.expected.errorType}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t p-3 bg-slate-50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => runScenario(key)}
                    >
                      Run Test
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter URL path to test (e.g., /user/123/profile)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runCustomTest}>
                Validate
              </Button>
            </div>
            
            {validationResult && (
              <Card className="overflow-hidden mt-4">
                <CardHeader className="bg-slate-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Validation Result</CardTitle>
                    <div className="flex gap-2">
                      {getStatusBadge(validationResult)}
                      {getErrorTypeBadge(validationResult.errorType)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  {validationResult.isValid ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>URL is valid</span>
                      </div>
                      
                      {validationResult.normalizedPath && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Normalized path:</p>
                          <code className="block bg-slate-50 p-2 rounded text-xs font-mono mt-1">
                            {validationResult.normalizedPath}
                          </code>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>URL is invalid</span>
                      </div>
                      
                      {validationResult.errorMessage && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{validationResult.errorMessage}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  {validationResult.performanceMetrics && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">Performance:</p>
                      <p className="text-xs text-muted-foreground">
                        Execution time: {validationResult.performanceMetrics.executionTime.toFixed(2)}ms
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
            ) : Object.keys(testResults).length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>No tests have been run yet. Click "Run All Tests" to begin testing.</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Scenario</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground w-24">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(testResults).map(([key, result]) => {
                      const scenario = MALFORMED_URL_SCENARIOS[key];
                      const expectedResult = scenario?.expected;
                      const passed = expectedResult ? result.isValid === expectedResult.isValid : true;
                      
                      return (
                        <tr key={key} className={`${passed ? '' : 'bg-red-50'}`}>
                          <td className="px-4 py-2">
                            <div className="font-medium">{scenario?.name || key}</div>
                            <div className="text-xs text-muted-foreground">{scenario?.input || '(empty)'}</div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {getStatusBadge(result, expectedResult?.isValid)}
                          </td>
                          <td className="px-4 py-2">
                            {result.isValid ? (
                              <span className="text-sm text-green-600">Valid</span>
                            ) : (
                              <div>
                                <span className="text-sm text-red-600">{result.errorMessage || 'Invalid'}</span>
                                {result.errorType && (
                                  <div className="mt-1">{getErrorTypeBadge(result.errorType)}</div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

export default MalformedURLTester;
