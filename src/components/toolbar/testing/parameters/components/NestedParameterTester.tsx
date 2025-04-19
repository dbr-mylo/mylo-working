
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';
import { ParameterHierarchyView } from './ParameterHierarchyView';
import { ValidationRuleBuilderUI } from './ValidationRuleBuilder';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface TestCase {
  name: string;
  pattern: string;
  path: string;
  expectedParams?: Record<string, string>;
  expectedErrors?: string[];
}

export const NestedParameterTester: React.FC = () => {
  const [pattern, setPattern] = useState('/products/:category?/:subcategory?/:productId');
  const [path, setPath] = useState('/products/electronics/laptops/p123');
  const [testResults, setTestResults] = useState<any>(null);
  const [validationRules, setValidationRules] = useState<Record<string, any>>({});
  const [selectedTab, setSelectedTab] = useState('test');
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      name: 'Basic Nested Parameters',
      pattern: '/products/:category?/:subcategory?/:productId',
      path: '/products/electronics/laptops/p123',
      expectedParams: {
        category: 'electronics',
        subcategory: 'laptops',
        productId: 'p123'
      }
    },
    {
      name: 'Missing Optional Parameter',
      pattern: '/products/:category?/:productId',
      path: '/products//p123',
      expectedParams: {
        category: '',
        productId: 'p123'
      }
    },
    {
      name: 'Deep Nesting',
      pattern: '/org/:orgId/team/:teamId/project/:projectId/task/:taskId',
      path: '/org/o123/team/t456/project/p789/task/t101',
      expectedParams: {
        orgId: 'o123',
        teamId: 't456',
        projectId: 'p789',
        taskId: 't101'
      }
    }
  ]);
  
  const runTest = () => {
    const startTime = performance.now();
    const extracted = extractNestedParameters(pattern, path);
    const extractionTime = performance.now() - startTime;
    
    const validationStartTime = performance.now();
    const validation = validateNestedParameters(
      extracted.params,
      extracted.hierarchy,
      validationRules
    );
    const validationTime = performance.now() - validationStartTime;
    
    setTestResults({
      params: extracted.params,
      hierarchy: extracted.hierarchy,
      missingRequired: extracted.missingRequired,
      errors: [...extracted.errors, ...validation.errors],
      isValid: extracted.errors.length === 0 && validation.isValid,
      performance: {
        extractionTime,
        validationTime,
        totalTime: extractionTime + validationTime
      }
    });
    
    setSelectedTab('results');
  };
  
  const runTestCase = (testCase: TestCase) => {
    setPattern(testCase.pattern);
    setPath(testCase.path);
    setTimeout(() => runTest(), 0);
  };
  
  const handleApplyRules = (rules: Record<string, any>) => {
    setValidationRules(rules);
    console.log('Applied validation rules:', rules);
  };

  const getParameterNames = () => {
    if (!testResults) return [];
    return Object.keys(testResults.hierarchy || {});
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nested Parameter Testing Suite</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Pattern</label>
                <Input 
                  value={pattern} 
                  onChange={e => setPattern(e.target.value)}
                  placeholder="/path/:param1/:param2?/:param3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use ? suffix for optional parameters, nested parameters should follow their parent
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Actual Path</label>
                <Input 
                  value={path} 
                  onChange={e => setPath(e.target.value)}
                  placeholder="/path/value1/value2/value3"
                />
              </div>
              
              <Button onClick={runTest} className="w-full">Test Parameters</Button>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Test Cases</h3>
                <div className="space-y-2">
                  {testCases.map((testCase, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-accent/50 cursor-pointer"
                      onClick={() => runTestCase(testCase)}
                    >
                      <div>
                        <div className="font-medium">{testCase.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {testCase.pattern} → {testCase.path}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {testResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Test Results</h3>
                  <Badge variant={testResults.isValid ? 'default' : 'destructive'}>
                    {testResults.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Extracted Parameters</h4>
                  {Object.keys(testResults.params).length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(testResults.params).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="font-medium mr-2">{key}:</span>
                          <Badge variant="outline">{String(value) || '(empty)'}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No parameters extracted</div>
                  )}
                </div>
                
                {testResults.missingRequired.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Missing Required Parameters</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {testResults.missingRequired.map((param: string, i: number) => (
                          <li key={i}>{param}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {testResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {testResults.errors.map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Extraction: {testResults.performance.extractionTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Validation: {testResults.performance.validationTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Total: {testResults.performance.totalTime.toFixed(2)}ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Run a test to see results
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hierarchy">
            {testResults ? (
              <ParameterHierarchyView 
                hierarchy={testResults.hierarchy} 
                params={testResults.params} 
              />
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Run a test to visualize parameter hierarchy
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="validation">
            <ValidationRuleBuilderUI 
              onApplyRules={handleApplyRules}
              parameterNames={getParameterNames()}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
