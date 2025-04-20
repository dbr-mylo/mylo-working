
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Clock } from 'lucide-react';
import { extractNestedParameters, validateNestedParameters } from '@/utils/navigation/parameters/nestedParameterHandler';
import { memoizedExtractNestedParameters, memoizedValidateNestedParameters, clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';
import { benchmarkOperation as benchmarkFunction, getAllPerformanceHistory } from '@/utils/navigation/parameters/performanceMonitor';
import { ValidationRuleBuilder } from '@/utils/navigation/parameters/ValidationRuleBuilder';
import { PerformanceMetricsVisualization } from '../components/PerformanceMetricsVisualization';

interface TestCase {
  name: string;
  pattern: string;
  path: string;
  expectedParams: Record<string, string>;
  validationRules?: Record<string, any>;
  expectedValid?: boolean;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Basic parameter extraction',
    pattern: '/users/:userId',
    path: '/users/123',
    expectedParams: { userId: '123' },
    validationRules: {
      userId: new ValidationRuleBuilder().string().required().build()
    },
    expectedValid: true
  },
  {
    name: 'Optional parameters',
    pattern: '/products/:category?/:productId',
    path: '/products//abc123',
    expectedParams: { category: '', productId: 'abc123' },
    validationRules: {
      category: new ValidationRuleBuilder().string().build(),
      productId: new ValidationRuleBuilder().string().required().build()
    },
    expectedValid: true
  },
  {
    name: 'Multiple nested parameters',
    pattern: '/org/:orgId/team/:teamId/project/:projectId',
    path: '/org/org-123/team/team-456/project/proj-789',
    expectedParams: { orgId: 'org-123', teamId: 'team-456', projectId: 'proj-789' },
    validationRules: {
      orgId: new ValidationRuleBuilder().string().pattern(/^org-\d+$/).required().build(),
      teamId: new ValidationRuleBuilder().string().pattern(/^team-\d+$/).required().build(),
      projectId: new ValidationRuleBuilder().string().pattern(/^proj-\d+$/).required().build()
    },
    expectedValid: true
  },
  {
    name: 'Validation failure',
    pattern: '/users/:userId/posts/:postId',
    path: '/users/abc/posts/xyz',
    expectedParams: { userId: 'abc', postId: 'xyz' },
    validationRules: {
      userId: new ValidationRuleBuilder().number().required().build(),
      postId: new ValidationRuleBuilder().pattern(/^\d+$/).required().build()
    },
    expectedValid: false
  },
  {
    name: 'Complex pattern with optional segments',
    pattern: '/content/:type/:category?/:id/details/:section?',
    path: '/content/article//12345/details/comments',
    expectedParams: { 
      type: 'article', 
      category: '', 
      id: '12345', 
      section: 'comments' 
    },
    validationRules: {
      type: new ValidationRuleBuilder().string().required().build(),
      id: new ValidationRuleBuilder().string().required().build(),
      section: new ValidationRuleBuilder().string().build()
    },
    expectedValid: true
  }
];

const PERFORMANCE_TEST_ITERATIONS = 100;

export const NestedParameterTestSuite: React.FC = () => {
  const [results, setResults] = useState<Array<{
    case: TestCase;
    result: {
      params: Record<string, string>;
      isValid: boolean;
      regularTime: number;
      memoizedTime: number;
      memoizedCached?: number;
      passed: boolean;
    };
  }>>([]);
  
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tests');

  const runTest = (testCase: TestCase) => {
    setSelectedTest(testCase.name);
    
    try {
      // Test standard extraction
      const { result: regularResult, performance: regularPerf } = benchmarkFunction(
        'extractParameters',
        () => extractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test memoized extraction (first call - no cache)
      const { result: memoizedResult, performance: memoizedPerf } = benchmarkFunction(
        'memoizedExtractParameters',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test memoized extraction (second call - should use cache)
      const { performance: memoizedCachedPerf } = benchmarkFunction(
        'memoizedExtractParametersCached',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path)
      );
      
      // Test validation
      let isValid = true;
      if (testCase.validationRules) {
        const { result: validationResult } = benchmarkFunction(
          'validateParameters',
          () => validateNestedParameters(
            regularResult.params, 
            regularResult.hierarchy, 
            testCase.validationRules
          )
        );
        isValid = validationResult.isValid;
      }

      // Check if params match expected
      const paramsMatch = Object.entries(testCase.expectedParams).every(
        ([key, value]) => regularResult.params[key] === value
      );
      
      // Check if validation matches expected
      const validationMatch = testCase.expectedValid === undefined || 
                             testCase.expectedValid === isValid;
      
      // Add to results
      setResults(prev => [
        {
          case: testCase,
          result: {
            params: regularResult.params,
            isValid,
            regularTime: regularPerf.executionTime,
            memoizedTime: memoizedPerf.executionTime,
            memoizedCached: memoizedCachedPerf.executionTime,
            passed: paramsMatch && validationMatch
          }
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Test error:', error);
      setResults(prev => [
        {
          case: testCase,
          result: {
            params: {},
            isValid: false,
            regularTime: 0,
            memoizedTime: 0,
            passed: false
          }
        },
        ...prev
      ]);
    } finally {
      setSelectedTest(null);
    }
  };
  
  const runAllTests = () => {
    clearParameterCaches();
    TEST_CASES.forEach(testCase => {
      runTest(testCase);
    });
  };
  
  const runPerformanceTest = () => {
    // Run performance test for multiple iterations
    const testCase = TEST_CASES[2]; // Use the complex nested parameters test
    
    try {
      // First clear caches
      clearParameterCaches();
      
      // Regular extraction (non-memoized)
      const { performance: regularPerf } = benchmarkFunction(
        'extractParameters_benchmark',
        () => extractNestedParameters(testCase.pattern, testCase.path),
        PERFORMANCE_TEST_ITERATIONS
      );
      
      // Memoized extraction (first run - no cache)
      clearParameterCaches();
      const { performance: memoizedPerf } = benchmarkFunction(
        'memoizedExtractParameters_benchmark',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path),
        PERFORMANCE_TEST_ITERATIONS
      );
      
      // Memoized extraction (second run - with cache)
      const { performance: memoizedCachedPerf } = benchmarkFunction(
        'memoizedExtractParametersCached_benchmark',
        () => memoizedExtractNestedParameters(testCase.pattern, testCase.path),
        PERFORMANCE_TEST_ITERATIONS
      );
      
      // Add results summary to test results
      setResults(prev => [{
        case: {
          name: `Performance Test (${PERFORMANCE_TEST_ITERATIONS} iterations)`,
          pattern: testCase.pattern,
          path: testCase.path,
          expectedParams: {}
        },
        result: {
          params: {},
          isValid: true,
          regularTime: regularPerf.executionTime,
          memoizedTime: memoizedPerf.executionTime,
          memoizedCached: memoizedCachedPerf.executionTime,
          passed: true
        }
      }, ...prev]);
    } catch (error) {
      console.error('Performance test error:', error);
    }
  };

  const renderTestResults = () => {
    if (results.length === 0) {
      return (
        <div className="text-center p-6 text-muted-foreground">
          No tests have been run yet. Run a test to see results.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {results.map((item, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">{item.case.name}</h3>
              {item.result.passed ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  <Check className="h-3 w-3 mr-1" /> Pass
                </Badge>
              ) : (
                <Badge variant="destructive">Fail</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Pattern</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">{item.case.pattern}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Path</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">{item.case.path}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Extracted Parameters</p>
              <pre className="font-mono text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(item.result.params, null, 2)}
              </pre>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs">Standard: {item.result.regularTime.toFixed(2)}ms</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs">Memoized: {item.result.memoizedTime.toFixed(2)}ms</span>
              </div>
              {item.result.memoizedCached !== undefined && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs">Cached: {item.result.memoizedCached.toFixed(2)}ms</span>
                </div>
              )}
              <div>
                <Badge 
                  variant="outline"
                  className={
                    item.result.isValid 
                    ? "bg-green-50 text-green-700" 
                    : "bg-red-50 text-red-700"
                  }
                >
                  {item.result.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nested Parameter Test Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="default"
                    onClick={runAllTests}
                    disabled={!!selectedTest}
                  >
                    Run All Tests
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setResults([])}
                    disabled={results.length === 0}
                  >
                    Clear Results
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEST_CASES.map((test, index) => (
                    <div 
                      key={index}
                      className="border rounded-md p-4 hover:bg-accent/20 cursor-pointer"
                      onClick={() => {
                        if (!selectedTest) runTest(test);
                      }}
                    >
                      <h3 className="font-medium mb-2">{test.name}</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Pattern: <span className="font-mono">{test.pattern}</span></p>
                        <p>Path: <span className="font-mono">{test.path}</span></p>
                      </div>
                      {selectedTest === test.name && (
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span className="animate-spin mr-1">⏳</span> Running test...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="my-6 border-t pt-6">
                  <h2 className="text-lg font-medium mb-4">Test Results</h2>
                  {renderTestResults()}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="default"
                    onClick={runPerformanceTest}
                    disabled={!!selectedTest}
                  >
                    Run Performance Test ({PERFORMANCE_TEST_ITERATIONS} iterations)
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={clearParameterCaches}
                  >
                    Clear Parameter Caches
                  </Button>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The performance test will run multiple iterations to measure the average execution time and cache efficiency.
                  </AlertDescription>
                </Alert>
                
                <div className="my-6">
                  <h2 className="text-lg font-medium mb-4">Performance Results</h2>
                  <div className="space-y-4">
                    {results
                      .filter(r => r.case.name.includes('Performance Test'))
                      .map((item, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <h3 className="font-medium mb-4">{item.case.name}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 border rounded-lg">
                                <h4 className="text-sm font-medium mb-1">Standard Extraction</h4>
                                <div className="text-2xl font-semibold">
                                  {item.result.regularTime.toFixed(2)}ms
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {(PERFORMANCE_TEST_ITERATIONS / (item.result.regularTime / 1000)).toFixed(0)} ops/sec
                                </p>
                              </div>
                              
                              <div className="p-4 border rounded-lg">
                                <h4 className="text-sm font-medium mb-1">Memoized (No Cache)</h4>
                                <div className="text-2xl font-semibold">
                                  {item.result.memoizedTime.toFixed(2)}ms
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {(PERFORMANCE_TEST_ITERATIONS / (item.result.memoizedTime / 1000)).toFixed(0)} ops/sec
                                </p>
                              </div>
                              
                              {item.result.memoizedCached !== undefined && (
                                <div className="p-4 border rounded-lg bg-green-50">
                                  <h4 className="text-sm font-medium mb-1">Memoized (With Cache)</h4>
                                  <div className="text-2xl font-semibold text-green-700">
                                    {item.result.memoizedCached.toFixed(2)}ms
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {(PERFORMANCE_TEST_ITERATIONS / (item.result.memoizedCached / 1000)).toFixed(0)} ops/sec
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Performance Comparison</h4>
                              <div className="space-y-2">
                                {item.result.memoizedCached !== undefined && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Cache Speed Improvement:</span>
                                    <Badge 
                                      variant="outline"
                                      className="bg-green-50 text-green-700"
                                    >
                                      {((item.result.regularTime - item.result.memoizedCached) / item.result.regularTime * 100).toFixed(1)}% faster
                                    </Badge>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Memoization Overhead (First Run):</span>
                                  <Badge 
                                    variant="outline"
                                    className={
                                      item.result.memoizedTime > item.result.regularTime 
                                      ? "bg-yellow-50 text-yellow-700"
                                      : "bg-green-50 text-green-700"
                                    }
                                  >
                                    {Math.abs(item.result.memoizedTime - item.result.regularTime).toFixed(2)}ms 
                                    ({item.result.memoizedTime > item.result.regularTime ? 'slower' : 'faster'})
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics">
              <PerformanceMetricsVisualization />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NestedParameterTestSuite;
