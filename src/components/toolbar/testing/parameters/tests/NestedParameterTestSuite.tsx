
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  extractNestedParameters, 
  validateNestedParameters, 
  ValidationRuleBuilder 
} from '@/utils/navigation/parameters/nestedParameterHandler';
import { 
  memoizedExtractNestedParameters,
  memoizedValidateNestedParameters 
} from '@/utils/navigation/parameters/memoizedParameterHandler';
import { benchmarkOperation } from '@/components/toolbar/testing/parameters/utils/performanceMonitor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TestCase {
  name: string;
  pattern: string;
  path: string;
  expectedParams: Record<string, string>;
  expectedErrors?: string[];
  validationRules?: Record<string, any>;
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Basic Nested Parameters',
    pattern: '/products/:category/:productId',
    path: '/products/electronics/123',
    expectedParams: {
      category: 'electronics',
      productId: '123'
    }
  },
  {
    name: 'Optional Parameters',
    pattern: '/products/:category?/:productId',
    path: '/products//123',
    expectedParams: {
      category: '',
      productId: '123'
    }
  },
  {
    name: 'Deeply Nested Parameters',
    pattern: '/org/:orgId/team/:teamId/project/:projectId/task/:taskId',
    path: '/org/org-123/team/team-456/project/proj-789/task/task-101',
    expectedParams: {
      orgId: 'org-123',
      teamId: 'team-456',
      projectId: 'proj-789',
      taskId: 'task-101'
    }
  },
  {
    name: 'Missing Required Parameter',
    pattern: '/user/:id/profile',
    path: '/user//profile',
    expectedParams: {
      id: ''
    },
    expectedErrors: ['Missing required parameter: id']
  },
  {
    name: 'Type Validation',
    pattern: '/product/:id/review/:rating',
    path: '/product/abc/review/xyz',
    expectedParams: {
      id: 'abc',
      rating: 'xyz'
    },
    validationRules: {
      id: new ValidationRuleBuilder().string().build(),
      rating: new ValidationRuleBuilder().number().build()
    },
    expectedErrors: ['Parameter rating must be a number']
  },
  {
    name: 'Child Without Parent',
    pattern: '/org/:orgId/repo/:repoId',
    path: '/org//repo/repo-123',
    expectedParams: {
      orgId: '',
      repoId: 'repo-123'
    },
    expectedErrors: ['Missing required parameter: orgId', 'Parameter "repoId" requires parent parameter orgId']
  },
  {
    name: 'Pattern Validation',
    pattern: '/users/:username/posts/:slug',
    path: '/users/john.doe/posts/my-post!',
    expectedParams: {
      username: 'john.doe',
      slug: 'my-post!'
    },
    validationRules: {
      slug: ValidationRuleBuilder.presets.slug().build()
    },
    expectedErrors: ['Parameter slug does not match required pattern']
  }
];

export const NestedParameterTestSuite: React.FC = () => {
  const [results, setResults] = useState<Array<{
    testCase: TestCase;
    result: {
      passed: boolean;
      extracted: Record<string, string>;
      errors: string[];
      performance: {
        extractionTime: number;
        validationTime?: number;
        totalTime: number;
        memoizedTime?: number;
      }
    }
  }>>([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });
  const [useMemoized, setUseMemoized] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [benchmarkResults, setBenchmarkResults] = useState<{
    standard: { ops: number; time: number };
    memoized: { ops: number; time: number };
    improvement: number;
  }>({ 
    standard: { ops: 0, time: 0 }, 
    memoized: { ops: 0, time: 0 }, 
    improvement: 0 
  });
  
  const runTests = () => {
    const newResults = TEST_CASES.map(testCase => {
      // Choose extraction function based on settings
      const extractFn = useMemoized ? memoizedExtractNestedParameters : extractNestedParameters;
      const validateFn = useMemoized ? memoizedValidateNestedParameters : validateNestedParameters;
      
      const startTime = performance.now();
      const extracted = extractFn(testCase.pattern, testCase.path);
      const extractionTime = performance.now() - startTime;
      
      const validationStartTime = performance.now();
      const validation = validateFn(
        extracted.params,
        extracted.hierarchy,
        testCase.validationRules
      );
      const validationTime = performance.now() - validationStartTime;
      
      // Run comparative test if using memoized version
      let memoizedTime;
      if (useMemoized) {
        // Run a second time to measure cached performance
        const memoizedStartTime = performance.now();
        memoizedExtractNestedParameters(testCase.pattern, testCase.path);
        memoizedValidateNestedParameters(
          extracted.params,
          extracted.hierarchy,
          testCase.validationRules
        );
        memoizedTime = performance.now() - memoizedStartTime;
      }
      
      // Combine extraction and validation errors
      const allErrors = [...extracted.errors, ...validation.errors];
      
      // Check if params match expected
      const paramsMatch = Object.entries(testCase.expectedParams).every(
        ([key, value]) => extracted.params[key] === value
      );
      
      // Check if errors match expected (if specified)
      const errorsMatch = !testCase.expectedErrors || 
        (testCase.expectedErrors.length === allErrors.length &&
         testCase.expectedErrors.every(expected => 
           allErrors.some(actual => actual.includes(expected))
         ));
      
      return {
        testCase,
        result: {
          passed: paramsMatch && errorsMatch,
          extracted: extracted.params,
          errors: allErrors,
          performance: {
            extractionTime,
            validationTime,
            totalTime: extractionTime + validationTime,
            memoizedTime
          }
        }
      };
    });
    
    setResults(newResults);
    
    // Update summary
    const passed = newResults.filter(r => r.result.passed).length;
    setSummary({
      total: newResults.length,
      passed,
      failed: newResults.length - passed
    });
  };
  
  const runBenchmark = () => {
    // Standard benchmark
    const standardBenchmark = benchmarkOperation(
      'standard-extract-validate',
      () => {
        const pattern = '/user/:id/profile/:section/settings/:settingId';
        const path = '/user/123/profile/personal/settings/display';
        const extracted = extractNestedParameters(pattern, path);
        validateNestedParameters(
          extracted.params,
          extracted.hierarchy,
          {
            id: new ValidationRuleBuilder().string().required().build(),
            section: new ValidationRuleBuilder().string().required().build(),
            settingId: new ValidationRuleBuilder().string().required().build()
          }
        );
      },
      1000
    );
    
    // Memoized benchmark
    const memoizedBenchmark = benchmarkOperation(
      'memoized-extract-validate',
      () => {
        const pattern = '/user/:id/profile/:section/settings/:settingId';
        const path = '/user/123/profile/personal/settings/display';
        const extracted = memoizedExtractNestedParameters(pattern, path);
        memoizedValidateNestedParameters(
          extracted.params,
          extracted.hierarchy,
          {
            id: new ValidationRuleBuilder().string().required().build(),
            section: new ValidationRuleBuilder().string().required().build(),
            settingId: new ValidationRuleBuilder().string().required().build()
          }
        );
      },
      1000
    );
    
    const standardOps = standardBenchmark.performance.operationsPerSecond;
    const memoizedOps = memoizedBenchmark.performance.operationsPerSecond;
    const improvement = ((memoizedOps - standardOps) / standardOps) * 100;
    
    setBenchmarkResults({
      standard: { 
        ops: standardOps, 
        time: standardBenchmark.performance.executionTime 
      },
      memoized: { 
        ops: memoizedOps, 
        time: memoizedBenchmark.performance.executionTime 
      },
      improvement
    });
  };
  
  useEffect(() => {
    runTests();
  }, [useMemoized]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Nested Parameter Test Suite</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Total: {summary.total}
            </Badge>
            <Badge variant="default" className="bg-green-500">
              Passed: {summary.passed}
            </Badge>
            <Badge variant="destructive">
              Failed: {summary.failed}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <div className="flex items-center gap-4 mb-4">
              <Button onClick={runTests}>Run All Tests</Button>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-memoized"
                  checked={useMemoized}
                  onCheckedChange={setUseMemoized}
                />
                <Label htmlFor="use-memoized">Use Memoized Functions</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{result.testCase.name}</h3>
                      {result.result.passed ? (
                        <div className="flex items-center text-green-500">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>Passed</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>Failed</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium mb-1">Pattern</div>
                        <code className="bg-muted p-1 rounded text-xs">{result.testCase.pattern}</code>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Path</div>
                        <code className="bg-muted p-1 rounded text-xs">{result.testCase.path}</code>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="font-medium mb-1">Extracted Parameters</div>
                      <div className="bg-muted p-2 rounded">
                        <code className="text-xs">
                          {JSON.stringify(result.result.extracted, null, 2)}
                        </code>
                      </div>
                    </div>
                    
                    {result.result.errors.length > 0 && (
                      <Alert variant={result.testCase.expectedErrors ? "default" : "destructive"} className="mt-2">
                        <AlertTitle>Errors</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside text-sm">
                            {result.result.errors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Extraction: {result.result.performance.extractionTime.toFixed(2)}ms</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Validation: {(result.result.performance.validationTime || 0).toFixed(2)}ms</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Total: {result.result.performance.totalTime.toFixed(2)}ms</span>
                      </div>
                      
                      {useMemoized && result.result.performance.memoizedTime !== undefined && (
                        <div className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>Cached: {result.result.performance.memoizedTime.toFixed(2)}ms</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Performance Benchmarks</h3>
                <Button onClick={runBenchmark}>Run Benchmark</Button>
              </div>
              
              {benchmarkResults.standard.ops > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Standard Implementation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operations/sec:</span>
                          <span className="font-mono">{benchmarkResults.standard.ops.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total time:</span>
                          <span className="font-mono">{benchmarkResults.standard.time.toFixed(2)}ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Memoized Implementation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operations/sec:</span>
                          <span className="font-mono">{benchmarkResults.memoized.ops.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total time:</span>
                          <span className="font-mono">{benchmarkResults.memoized.time.toFixed(2)}ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {benchmarkResults.improvement > 0 && (
                <Alert>
                  <AlertTitle className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Performance Improvement
                  </AlertTitle>
                  <AlertDescription>
                    Memoization provides a <strong className="text-green-500">
                      {benchmarkResults.improvement.toFixed(2)}%
                    </strong> performance improvement.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Performance Best Practices</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Use memoized functions for routes with high traffic</li>
                  <li>Limit the complexity of validation rules for better performance</li>
                  <li>Consider the tradeoff between memory usage and execution speed</li>
                  <li>Clear parameter caches when rule definitions change</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NestedParameterTestSuite;
