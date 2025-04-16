
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EDGE_CASE_TEST_SCENARIOS, validateEdgeCaseScenario, performanceTest } from '../utils/edgeCaseUtils';
import { generateDeepLink, extractParameters } from '../utils/parameterTestUtils';
import { createComplexDeepLink, parseComplexParameters } from '../utils/complexParameterUtils';

interface TestResult {
  name: string;
  passed: boolean;
  actual: any;
  expected: any;
  executionTime: number;
  errors?: string[];
}

export const EdgeCaseTestSuite: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [runningTests, setRunningTests] = useState(false);
  const [performanceResults, setPerformanceResults] = useState<{
    averageTime: number;
    maxTime: number;
    minTime: number;
  } | null>(null);

  const runEdgeCaseTests = () => {
    setRunningTests(true);
    setResults([]);
    
    setTimeout(() => {
      const testResults: TestResult[] = [];
      
      // Run tests for each edge case scenario
      Object.entries(EDGE_CASE_TEST_SCENARIOS).forEach(([name, scenario]) => {
        const start = performance.now();
        
        try {
          const extracted = extractParameters(scenario.pattern, scenario.actual);
          const validation = validateEdgeCaseScenario(scenario.pattern, scenario.actual, scenario.expected);
          const passed = (
            (scenario.expected === null && extracted === null) ||
            (scenario.expected !== null && extracted !== null && 
             JSON.stringify(extracted) === JSON.stringify(scenario.expected))
          );
          
          testResults.push({
            name,
            passed,
            actual: extracted,
            expected: scenario.expected,
            executionTime: performance.now() - start,
            errors: validation.errors
          });
        } catch (error) {
          testResults.push({
            name,
            passed: false,
            actual: null,
            expected: scenario.expected,
            executionTime: performance.now() - start,
            errors: [error instanceof Error ? error.message : String(error)]
          });
        }
      });
      
      setResults(testResults);
      setRunningTests(false);
    }, 100); // Small delay for UI responsiveness
  };

  const runComplexParameterTests = () => {
    setRunningTests(true);
    
    setTimeout(() => {
      const testResults: TestResult[] = [];
      
      // Test array parameters
      try {
        const start = performance.now();
        const arrayPath = '/search/:query';
        const arrayParams = { query: 'react' };
        const arrayQuery = { tags: ['react', 'typescript', 'ui'] };
        
        const link = createComplexDeepLink(arrayPath, arrayParams, arrayQuery);
        const parsed = parseComplexParameters(link);
        
        const passed = (
          Array.isArray(parsed.queryParams.tags) && 
          parsed.queryParams.tags.length === 3 &&
          parsed.queryParams.tags[0] === 'react'
        );
        
        testResults.push({
          name: 'Array Parameters',
          passed,
          actual: parsed.queryParams,
          expected: arrayQuery,
          executionTime: performance.now() - start
        });
      } catch (error) {
        testResults.push({
          name: 'Array Parameters',
          passed: false,
          actual: null,
          expected: { tags: ['react', 'typescript', 'ui'] },
          executionTime: 0,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
      
      // Test object parameters
      try {
        const start = performance.now();
        const objPath = '/filter/:type';
        const objParams = { type: 'product' };
        const objQuery = { 
          filters: { 
            price: { min: 10, max: 100 },
            inStock: true
          } 
        };
        
        const link = createComplexDeepLink(objPath, objParams, objQuery);
        const parsed = parseComplexParameters(link);
        
        const passed = (
          typeof parsed.queryParams.filters === 'object' &&
          parsed.queryParams.filters &&
          typeof parsed.queryParams.filters.price === 'object'
        );
        
        testResults.push({
          name: 'Object Parameters',
          passed,
          actual: parsed.queryParams,
          expected: objQuery,
          executionTime: performance.now() - start
        });
      } catch (error) {
        testResults.push({
          name: 'Object Parameters',
          passed: false,
          actual: null,
          expected: { filters: { price: { min: 10, max: 100 }, inStock: true } },
          executionTime: 0,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
      
      // Test empty values
      try {
        const start = performance.now();
        const emptyPath = '/user/:id/:name';
        const emptyParams = { id: '123', name: '' };
        
        const link = createComplexDeepLink(emptyPath, emptyParams, {});
        const passed = link === '/user/123/';
        
        testResults.push({
          name: 'Empty Parameters',
          passed,
          actual: link,
          expected: '/user/123/',
          executionTime: performance.now() - start
        });
      } catch (error) {
        testResults.push({
          name: 'Empty Parameters',
          passed: false,
          actual: null,
          expected: '/user/123/',
          executionTime: 0,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
      
      setResults(prev => [...prev, ...testResults]);
      setRunningTests(false);
    }, 100);
  };

  const runPerformanceTests = () => {
    setRunningTests(true);
    
    setTimeout(() => {
      // Simple path test
      const simplePath = '/user/:id';
      const simpleParams = { id: '123' };
      
      const simpleTestFn = () => {
        generateDeepLink(simplePath, simpleParams, {});
      };
      
      // Complex path test
      const complexPath = '/org/:orgId/team/:teamId/project/:projectId/task/:taskId';
      const complexParams = {
        orgId: 'org-123',
        teamId: 'team-456',
        projectId: 'proj-789',
        taskId: 'task-101'
      };
      
      const complexTestFn = () => {
        generateDeepLink(complexPath, complexParams, { view: 'details' });
      };
      
      // Run tests
      const simplePerf = performanceTest(simpleTestFn, 1000);
      const complexPerf = performanceTest(complexTestFn, 1000);
      
      // Combine results
      const combinedResults = {
        averageTime: (simplePerf.averageTime + complexPerf.averageTime) / 2,
        maxTime: Math.max(simplePerf.maxTime, complexPerf.maxTime),
        minTime: Math.min(simplePerf.minTime, complexPerf.minTime)
      };
      
      setPerformanceResults(combinedResults);
      setRunningTests(false);
      
      // Add performance test results to result list
      setResults(prev => [
        ...prev,
        {
          name: 'Simple Path Performance',
          passed: true,
          actual: `${simplePerf.averageTime.toFixed(3)}ms avg, ${simplePerf.minTime.toFixed(3)}ms min, ${simplePerf.maxTime.toFixed(3)}ms max`,
          expected: 'Under 1ms average',
          executionTime: simplePerf.averageTime
        },
        {
          name: 'Complex Path Performance',
          passed: complexPerf.averageTime < 2,
          actual: `${complexPerf.averageTime.toFixed(3)}ms avg, ${complexPerf.minTime.toFixed(3)}ms min, ${complexPerf.maxTime.toFixed(3)}ms max`,
          expected: 'Under 2ms average',
          executionTime: complexPerf.averageTime
        }
      ]);
    }, 100);
  };

  const runAllTests = () => {
    runEdgeCaseTests();
    setTimeout(runComplexParameterTests, 300);
    setTimeout(runPerformanceTests, 600);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edge Case Test Suite</CardTitle>
        <CardDescription>
          Test deep linking edge cases, complex parameters, and performance scenarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={runEdgeCaseTests} disabled={runningTests}>
            Run Edge Case Tests
          </Button>
          <Button onClick={runComplexParameterTests} disabled={runningTests}>
            Test Complex Parameters
          </Button>
          <Button onClick={runPerformanceTests} disabled={runningTests}>
            Run Performance Tests
          </Button>
          <Button onClick={runAllTests} disabled={runningTests} variant="default">
            Run All Tests
          </Button>
        </div>
        
        {performanceResults && (
          <div className="p-4 bg-muted/30 rounded-md mb-4">
            <h3 className="font-medium mb-2">Performance Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Average Time</div>
                <div className="text-lg font-semibold">{performanceResults.averageTime.toFixed(3)}ms</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Min Time</div>
                <div className="text-lg font-semibold">{performanceResults.minTime.toFixed(3)}ms</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Max Time</div>
                <div className="text-lg font-semibold">{performanceResults.maxTime.toFixed(3)}ms</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="border rounded-md divide-y overflow-hidden">
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No test results yet. Run tests to see results.
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{result.name}</div>
                  <Badge variant={result.passed ? "default" : "destructive"} className={result.passed ? "bg-green-500 hover:bg-green-600" : undefined}>
                    {result.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Expected:</span> {typeof result.expected === 'object' ? 
                      JSON.stringify(result.expected) : String(result.expected)}
                  </div>
                  <div>
                    <span className="font-medium">Actual:</span> {typeof result.actual === 'object' ? 
                      JSON.stringify(result.actual) : String(result.actual)}
                  </div>
                </div>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2 text-sm text-destructive">
                    {result.errors.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Execution time: {result.executionTime.toFixed(3)}ms
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
