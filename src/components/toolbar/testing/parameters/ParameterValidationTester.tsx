
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertCircle, 
  CheckCircle,
  ClipboardCopy,
  RefreshCw,
  Play,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  validateParameter,
  ParameterValidationRule,
  ValidationResult,
  PARAMETER_VALIDATION_SCENARIOS,
  ParameterValidationScenario
} from '@/utils/navigation/testing/parameterValidationUtils';

interface ValidationTest {
  paramName: string;
  inputValue: string;
  rule: ParameterValidationRule;
  result?: ValidationResult;
}

/**
 * Component for testing parameter validation
 */
const ParameterValidationTester: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("predefined");
  const [currentTest, setCurrentTest] = useState<ValidationTest>({
    paramName: 'id',
    inputValue: '',
    rule: {
      type: 'string',
      required: true
    }
  });
  const [customTests, setCustomTests] = useState<ValidationTest[]>([]);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  // Update test parameter type
  const updateTestType = (type: 'string' | 'number' | 'uuid' | 'email' | 'custom') => {
    setCurrentTest(prev => ({
      ...prev,
      rule: {
        ...prev.rule,
        type
      }
    }));
  };

  // Update test parameter required status
  const updateTestRequired = (required: boolean) => {
    setCurrentTest(prev => ({
      ...prev,
      rule: {
        ...prev.rule,
        required
      }
    }));
  };

  // Update test parameter min/max length
  const updateTestLength = (minLength?: number, maxLength?: number) => {
    setCurrentTest(prev => ({
      ...prev,
      rule: {
        ...prev.rule,
        minLength: minLength,
        maxLength: maxLength
      }
    }));
  };

  // Run custom test
  const runCustomTest = () => {
    const result = validateParameter(
      currentTest.paramName,
      currentTest.inputValue,
      currentTest.rule
    );
    
    setCurrentTest(prev => ({
      ...prev,
      result
    }));
  };

  // Add current test to custom tests
  const addCustomTest = () => {
    if (currentTest.result) {
      setCustomTests(prev => [...prev, {...currentTest}]);
      
      // Reset current test
      setCurrentTest({
        paramName: currentTest.paramName,
        inputValue: '',
        rule: {...currentTest.rule}
      });
    }
  };

  // Remove a custom test
  const removeCustomTest = (index: number) => {
    setCustomTests(prev => prev.filter((_, i) => i !== index));
  };

  // Run predefined scenario
  const runScenario = (scenarioKey: string, testCaseIndex: number = 0) => {
    const scenario = PARAMETER_VALIDATION_SCENARIOS[scenarioKey] as ParameterValidationScenario;
    if (!scenario) return;
    
    const testCase = scenario.testCases[testCaseIndex];
    if (!testCase) return;
    
    setSelectedScenario(scenarioKey);
    
    const result = validateParameter('param', testCase.input, scenario.rule);
    
    setTestResults(prev => ({
      ...prev,
      [`${scenarioKey}_${testCaseIndex}`]: {
        scenario: scenarioKey,
        input: testCase.input,
        rule: scenario.rule,
        expected: testCase.expected,
        actual: result,
        passed: result.isValid === testCase.expected
      }
    }));
  };

  // Run all predefined tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    
    // Slight delay to allow UI to update
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const results: Record<string, any> = {};
    
    for (const [scenarioKey, scenarioValue] of Object.entries(PARAMETER_VALIDATION_SCENARIOS)) {
      const scenario = scenarioValue as ParameterValidationScenario;
      for (const [testCaseIndex, testCase] of scenario.testCases.entries()) {
        const result = validateParameter('param', testCase.input, scenario.rule);
        
        results[`${scenarioKey}_${testCaseIndex}`] = {
          scenario: scenarioKey,
          scenarioName: scenario.name,
          input: testCase.input,
          rule: scenario.rule,
          expected: testCase.expected,
          actual: result,
          passed: result.isValid === testCase.expected
        };
      }
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  // Copy result to clipboard
  const copyResult = () => {
    if (currentTest.result) {
      navigator.clipboard.writeText(JSON.stringify(currentTest.result, null, 2));
    }
  };

  // Get test result badge
  const getTestResultBadge = (isValid: boolean, expected?: boolean) => {
    if (expected !== undefined && isValid !== expected) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    
    if (isValid) {
      return <Badge variant="default">Valid</Badge>;
    }
    
    return <Badge variant="destructive">Invalid</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Parameter Validation Tester</CardTitle>
        <CardDescription>
          Test parameter validation rules and sanitization functions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="predefined" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="predefined">Predefined Tests</TabsTrigger>
            <TabsTrigger value="custom">Custom Validation</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predefined" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(PARAMETER_VALIDATION_SCENARIOS).map(([key, scenario]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{scenario.name}</CardTitle>
                    <CardDescription className="text-xs">{scenario.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0">
                    <div className="border rounded p-3 bg-slate-50">
                      <div className="text-xs text-muted-foreground mb-1">Rule Type:</div>
                      <Badge variant="outline">{scenario.rule.type}</Badge>
                      
                      {scenario.rule.required !== undefined && (
                        <Badge variant={scenario.rule.required ? "secondary" : "outline"} className="ml-2">
                          {scenario.rule.required ? 'Required' : 'Optional'}
                        </Badge>
                      )}
                      
                      {scenario.rule.minLength !== undefined && (
                        <Badge variant="outline" className="ml-2">
                          Min: {scenario.rule.minLength}
                        </Badge>
                      )}
                      
                      {scenario.rule.maxLength !== undefined && (
                        <Badge variant="outline" className="ml-2">
                          Max: {scenario.rule.maxLength}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Test Cases:</div>
                      <div className="space-y-2">
                        {scenario.testCases.map((testCase, index) => (
                          <div key={index} className="border rounded p-2 flex justify-between items-center">
                            <div>
                              <code className="text-xs font-mono">
                                {testCase.input || '(empty)'}
                              </code>
                              <div className="mt-1">
                                <Badge variant={testCase.expected ? "default" : "secondary"} className="text-xs">
                                  Expected: {testCase.expected ? 'Valid' : 'Invalid'}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => runScenario(key, index)}
                            >
                              Test
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Parameter Name:</label>
                  <Input 
                    placeholder="id" 
                    value={currentTest.paramName}
                    onChange={(e) => setCurrentTest(prev => ({...prev, paramName: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Parameter Value:</label>
                  <Input 
                    placeholder="test123" 
                    value={currentTest.inputValue}
                    onChange={(e) => setCurrentTest(prev => ({...prev, inputValue: e.target.value}))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-3">Validation Rules</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Type:</label>
                    <Select 
                      value={currentTest.rule.type} 
                      onValueChange={(value) => updateTestType(value as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="uuid">UUID</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox 
                      id="required" 
                      checked={!!currentTest.rule.required} 
                      onCheckedChange={(checked) => updateTestRequired(!!checked)}
                    />
                    <label htmlFor="required" className="text-sm ml-2">
                      Required parameter
                    </label>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm">Min Length:</label>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="0" 
                      value={currentTest.rule.minLength || ''}
                      onChange={(e) => updateTestLength(
                        e.target.value ? parseInt(e.target.value) : undefined, 
                        currentTest.rule.maxLength
                      )}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm">Max Length:</label>
                    <Input 
                      type="number"
                      min="0"
                      placeholder="Unlimited" 
                      value={currentTest.rule.maxLength || ''}
                      onChange={(e) => updateTestLength(
                        currentTest.rule.minLength, 
                        e.target.value ? parseInt(e.target.value) : undefined
                      )}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={runCustomTest}>
                  Validate Parameter
                </Button>
              </div>
            </div>
            
            {currentTest.result && (
              <Card className="overflow-hidden mt-4">
                <CardHeader className="bg-slate-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">Validation Result</CardTitle>
                    <Badge variant={currentTest.result.isValid ? "default" : "destructive"}>
                      {currentTest.result.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  {currentTest.result.isValid ? (
                    <div className="space-y-3">
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Parameter is valid</span>
                      </div>
                      
                      {currentTest.result.sanitizedValue !== undefined && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Sanitized value:</p>
                          <code className="block bg-slate-50 p-2 rounded text-xs font-mono">
                            {currentTest.result.sanitizedValue || '(empty string)'}
                          </code>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={addCustomTest}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add to Test Suite
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center text-red-500">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Parameter is invalid</span>
                      </div>
                      
                      {currentTest.result.errorMessage && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Error:</p>
                          <div className="bg-red-50 text-red-800 p-2 rounded border border-red-200 text-sm">
                            {currentTest.result.errorMessage}
                          </div>
                        </div>
                      )}
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
            
            {customTests.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Custom Test Suite</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Parameter</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Value</th>
                        <th className="px-4 py-2 text-center font-medium text-muted-foreground w-24">Status</th>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Result</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {customTests.map((test, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <code className="text-xs font-mono">{test.paramName}</code>
                            <div className="text-xs text-muted-foreground mt-1">
                              {test.rule.type}
                              {test.rule.required !== undefined && (
                                <span className="ml-1">
                                  ({test.rule.required ? 'required' : 'optional'})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <code className="text-xs font-mono">{test.inputValue || '(empty)'}</code>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {test.result && getTestResultBadge(test.result.isValid)}
                          </td>
                          <td className="px-4 py-2">
                            {test.result?.isValid ? (
                              <span className="text-sm text-green-600">Valid</span>
                            ) : (
                              <span className="text-sm text-red-600">
                                {test.result?.errorMessage || 'Invalid'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => removeCustomTest(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Test Results</h3>
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
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Input</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground w-24">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.values(testResults).map((result, index) => (
                      <tr key={index} className={result.passed ? '' : 'bg-red-50'}>
                        <td className="px-4 py-2">
                          <div className="font-medium">{result.scenarioName || result.scenario}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.rule.type}
                            {result.rule.required !== undefined && (
                              <span className="ml-1">
                                ({result.rule.required ? 'required' : 'optional'})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <code className="text-xs font-mono">{result.input || '(empty)'}</code>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {getTestResultBadge(result.actual.isValid, result.expected)}
                        </td>
                        <td className="px-4 py-2">
                          {result.actual.isValid ? (
                            <span className="text-sm text-green-600">Valid</span>
                          ) : (
                            <span className="text-sm text-red-600">
                              {result.actual.errorMessage || 'Invalid'}
                            </span>
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

export default ParameterValidationTester;
