
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  extractOptionalParameters, 
  validateOptionalParameters, 
  OptionalParameterConfig,
  ValidationResult,
  createParameterConfigFromPattern,
  buildUrlFromPattern
} from '@/utils/navigation/parameters/optionalParameterHandler';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, XCircle, Gauge, RefreshCw, Save, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TestResult {
  pattern: string;
  actualPath: string;
  params: Record<string, string>;
  missingRequired: string[];
  errors: string[];
  builtUrl?: string;
  isValid: boolean;
  validationErrors?: string[];
  performance?: {
    extractionTime: number;
    validationTime?: number;
  };
  timestamp: string;
}

interface SavedTestCase {
  name: string;
  pattern: string;
  actualPath: string;
}

export const OptionalParameterTester = () => {
  const [pattern, setPattern] = useState('/user/:id?/profile/:section?');
  const [actualPath, setActualPath] = useState('/user/123/profile');
  const [results, setResults] = useState<TestResult[]>([]);
  const [testCases, setTestCases] = useState<SavedTestCase[]>(() => {
    const saved = localStorage.getItem('optional-parameter-test-cases');
    return saved ? JSON.parse(saved) : [
      { name: 'User Profile', pattern: '/user/:id?/profile/:section?', actualPath: '/user/123/profile' },
      { name: 'Product Detail', pattern: '/products/:category?/:productId', actualPath: '/products/electronics/123' },
      { name: 'Blog Post', pattern: '/blog/:year?/:month?/:slug', actualPath: '/blog/2023/05/my-post' }
    ];
  });
  const [testCaseName, setTestCaseName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTab, setCurrentTab] = useState('tester');
  
  // Save test cases to localStorage when they change
  React.useEffect(() => {
    localStorage.setItem('optional-parameter-test-cases', JSON.stringify(testCases));
  }, [testCases]);
  
  const runTest = () => {
    // Extract parameters
    const extracted = extractOptionalParameters(pattern, actualPath);
    
    // Create test configuration
    const config = createParameterConfigFromPattern(pattern);
    
    // Validate parameters
    const validation: ValidationResult = validateOptionalParameters(extracted.params, config);
    
    // Build URL from parameters
    const builtUrl = buildUrlFromPattern(pattern, extracted.params);
    
    const result: TestResult = {
      pattern,
      actualPath,
      params: extracted.params,
      missingRequired: extracted.missingRequired,
      errors: extracted.errors,
      builtUrl,
      isValid: validation.isValid,
      validationErrors: validation.validationErrors,
      performance: {
        extractionTime: extracted.performance?.extractionTime || 0,
        validationTime: validation.performance?.validationTime
      },
      timestamp: new Date().toISOString()
    };
    
    setResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };
  
  const saveTestCase = () => {
    if (!testCaseName) return;
    
    setTestCases(prev => [
      ...prev, 
      { name: testCaseName, pattern, actualPath }
    ]);
    setTestCaseName('');
  };
  
  const loadTestCase = (testCase: SavedTestCase) => {
    setPattern(testCase.pattern);
    setActualPath(testCase.actualPath);
  };
  
  const deleteTestCase = (index: number) => {
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Optional Parameter Tester</CardTitle>
        <CardDescription>
          Test handling of optional route parameters and their extraction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="tester">Parameter Tester</TabsTrigger>
            <TabsTrigger value="saved">Test Cases</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tester" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium">Route Pattern</Label>
                <Input 
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  placeholder="e.g., /user/:id?/profile/:section?"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use ? to mark optional parameters (e.g., :id?)
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Actual Path</Label>
                <Input 
                  value={actualPath}
                  onChange={e => setActualPath(e.target.value)}
                  placeholder="e.g., /user/123/profile"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
                <Label htmlFor="advanced-mode">Show Advanced Options</Label>
              </div>
              
              {showAdvanced && (
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Parameter Configurations</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    Advanced parameter configurations will be added here in future updates.
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button onClick={runTest} className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Test
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Input 
                  value={testCaseName}
                  onChange={e => setTestCaseName(e.target.value)}
                  placeholder="Test case name"
                />
                <Button onClick={saveTestCase} disabled={!testCaseName}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Case
                </Button>
              </div>
            </div>
            
            {results.length > 0 && (
              <div className="border p-4 rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Latest Result</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant={results[0].isValid ? "default" : "destructive"}>
                      {results[0].isValid ? "Valid" : "Invalid"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(results[0].timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="text-sm font-medium">Pattern:</span> <span className="text-sm">{results[0].pattern}</span></div>
                    <div><span className="text-sm font-medium">Path:</span> <span className="text-sm">{results[0].actualPath}</span></div>
                  </div>
                  
                  {results[0].builtUrl && (
                    <div>
                      <span className="text-sm font-medium">Built URL:</span> <span className="text-sm">{results[0].builtUrl}</span>
                      {results[0].builtUrl !== results[0].actualPath && (
                        <Badge variant="outline" className="ml-2">Differs</Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Extraction: {results[0].performance?.extractionTime.toFixed(2)}ms
                      {results[0].performance?.validationTime !== undefined && 
                        `, Validation: ${results[0].performance?.validationTime.toFixed(2)}ms`
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="border rounded-md divide-y">
              {testCases.map((testCase, index) => (
                <div key={index} className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{testCase.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Pattern: {testCase.pattern}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Path: {testCase.actualPath}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => loadTestCase(testCase)}>
                      Load
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTestCase(index)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {testCases.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No saved test cases yet. Save some test cases to see them here.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {results.length > 0 ? (
              <div className="border rounded-lg divide-y max-h-[500px] overflow-auto">
                {results.map((result, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant={result.isValid ? "default" : "destructive"}>
                        {result.isValid ? "Valid" : "Invalid"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div><span className="font-medium">Pattern:</span> {result.pattern}</div>
                      <div><span className="font-medium">Path:</span> {result.actualPath}</div>
                      
                      {result.builtUrl && (
                        <div>
                          <span className="font-medium">Built URL:</span> {result.builtUrl}
                          {result.builtUrl !== result.actualPath && (
                            <Badge variant="outline" className="ml-2">Differs</Badge>
                          )}
                        </div>
                      )}
                      
                      <div>
                        <span className="font-medium">Extracted Parameters:</span>
                        <pre className="mt-1 bg-muted p-2 rounded-md text-xs">
                          {JSON.stringify(result.params, null, 2)}
                        </pre>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Extraction: {result.performance?.extractionTime.toFixed(2)}ms
                          {result.performance?.validationTime !== undefined && 
                            `, Validation: ${result.performance?.validationTime.toFixed(2)}ms`
                          }
                        </span>
                      </div>
                      
                      {result.missingRequired.length > 0 && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            Missing required parameters: {result.missingRequired.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {result.errors.length > 0 && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {result.errors.join('\n')}
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {result.validationErrors && result.validationErrors.length > 0 && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            <div className="font-medium mb-1">Validation Errors:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {result.validationErrors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No test results yet. Run some tests to see results here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OptionalParameterTester;
