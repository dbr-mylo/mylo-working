
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterHierarchyView } from './ParameterHierarchyView';
import { ValidationRuleBuilderUI } from './ValidationRuleBuilder';
import { TestCasePanel } from './TestCasePanel';
import { useNestedTesting } from '../hooks/useNestedTesting';

export const NestedParameterTester: React.FC = () => {
  const {
    pattern,
    setPattern,
    path,
    setPath,
    testResults,
    validationRules,
    setValidationRules,
    selectedTab,
    setSelectedTab,
    testCases,
    runTest,
    runTestCase,
    getParameterNames
  } = useNestedTesting();
  
  const handleApplyRules = (rules: Record<string, any>) => {
    setValidationRules(rules);
    console.log('Applied validation rules:', rules);
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
          
          <TabsContent value="test">
            <TestCasePanel
              pattern={pattern}
              path={path}
              onPatternChange={setPattern}
              onPathChange={setPath}
              onRunTest={runTest}
              testCases={testCases}
              onRunTestCase={runTestCase}
            />
          </TabsContent>
          
          <TabsContent value="results">
            {testResults ? (
              <div className="space-y-4">
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
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
