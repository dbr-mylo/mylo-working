
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { extractAndValidateParameters } from '@/utils/navigation/testing/parameterValidationUtils';
import { runPerformanceTest, TEST_CASES, type PerformanceTestResult } from '@/utils/testing/performance/parameterTestUtils';

interface TestResult extends PerformanceTestResult {
  testCase: string;
  timestamp: string;
}

export const ParameterPerformanceTester = () => {
  const [iterations, setIterations] = useState(1000);
  const [selectedCase, setSelectedCase] = useState('simple');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    const testCase = TEST_CASES[selectedCase as keyof typeof TEST_CASES];

    // Allow UI to update before running intensive test
    await new Promise(resolve => setTimeout(resolve, 0));

    const result = runPerformanceTest(
      () => extractAndValidateParameters(testCase.routePattern, testCase.actualPath),
      iterations
    );

    setResults(prev => [...prev, {
      ...result,
      testCase: testCase.name,
      timestamp: new Date().toISOString()
    }]);

    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter Performance Tester</CardTitle>
        <CardDescription>
          Test parameter extraction performance with different complexity levels
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Case</label>
            <Select 
              value={selectedCase} 
              onValueChange={setSelectedCase}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test case" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TEST_CASES).map(([key, test]) => (
                  <SelectItem key={key} value={key}>{test.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Iterations</label>
            <Input
              type="number"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              min={1}
              max={100000}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={runTest} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Test'}
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Latest Result</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Operations per second: {results[results.length - 1].operationsPerSecond}
                </p>
                <p className="text-sm">
                  Average time per operation: {results[results.length - 1].averageTimePerOperation.toFixed(3)}ms
                </p>
                {results[results.length - 1].memoryUsage && (
                  <p className="text-sm">
                    Memory usage: {(results[results.length - 1].memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB
                  </p>
                )}
              </div>
            </div>

            <div className="h-[300px] w-full">
              <LineChart
                width={600}
                height={300}
                data={results}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="operationsPerSecond" 
                  stroke="#8884d8" 
                  name="Ops/Second" 
                />
              </LineChart>
            </div>

            {results.some(r => r.memoryUsage?.heapUsed > 50 * 1024 * 1024) && (
              <Alert>
                <AlertDescription>
                  High memory usage detected. Consider optimizing the parameter extraction logic.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
