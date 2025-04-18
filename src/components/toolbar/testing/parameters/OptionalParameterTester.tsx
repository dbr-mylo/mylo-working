
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  extractOptionalParameters, 
  validateOptionalParameters, 
  ValidationResult,
  createParameterConfigFromPattern,
  buildUrlFromPattern
} from '@/utils/navigation/parameters/optionalParameterHandler';
import { TestCaseManager, type SavedTestCase } from './components/TestCaseManager';
import { TestResults, type TestResult } from './components/TestResults';
import { ParameterTesterForm } from './components/ParameterTesterForm';

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
            <ParameterTesterForm
              pattern={pattern}
              actualPath={actualPath}
              showAdvanced={showAdvanced}
              onPatternChange={setPattern}
              onPathChange={setActualPath}
              onAdvancedChange={setShowAdvanced}
              onRunTest={runTest}
              onClearResults={clearResults}
            />
            
            {results.length > 0 && <TestResults results={results} />}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-4">
            <TestCaseManager
              testCases={testCases}
              testCaseName={testCaseName}
              pattern={pattern}
              actualPath={actualPath}
              onTestCaseNameChange={setTestCaseName}
              onSaveTestCase={saveTestCase}
              onLoadTestCase={loadTestCase}
              onDeleteTestCase={deleteTestCase}
            />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {results.map((result, index) => (
              <TestResults key={index} results={[result]} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OptionalParameterTester;
