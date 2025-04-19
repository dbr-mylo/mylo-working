
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractNestedParameters, validateNestedParameters, ValidationRuleBuilder } from '@/utils/navigation/parameters/nestedParameterHandler';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      }
    }
  }>>([]);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });
  
  const runTests = () => {
    const newResults = TEST_CASES.map(testCase => {
      const startTime = performance.now();
      const extracted = extractNestedParameters(testCase.pattern, testCase.path);
      const extractionTime = performance.now() - startTime;
      
      const validationStartTime = performance.now();
      const validation = validateNestedParameters(
        extracted.params,
        extracted.hierarchy,
        testCase.validationRules
      );
      const validationTime = performance.now() - validationStartTime;
      
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
            totalTime: extractionTime + validationTime
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
  
  useEffect(() => {
    runTests();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Nested Parameter Test Suite</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Total: {summary.total}
            </Badge>
            <Badge variant="success" className="bg-green-500">
              Passed: {summary.passed}
            </Badge>
            <Badge variant="destructive">
              Failed: {summary.failed}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests}>Run All Tests</Button>
        
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
                
                <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NestedParameterTestSuite;
