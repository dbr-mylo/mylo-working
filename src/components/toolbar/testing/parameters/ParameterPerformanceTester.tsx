
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { extractAndValidateParameters } from '@/utils/navigation/testing/parameterValidationUtils';
import { runPerformanceTest, TEST_CASES, type PerformanceTestResult } from '@/utils/testing/performance/parameterTestUtils';
import { MemoryUsageReporter, MemoryPoint } from './components/MemoryUsageReporter';

interface TestResult extends PerformanceTestResult {
  testCase: string;
  timestamp: string;
}

export const ParameterPerformanceTester = () => {
  const [iterations, setIterations] = useState(1000);
  const [selectedCase, setSelectedCase] = useState('simple');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [memoryPoints, setMemoryPoints] = useState<MemoryPoint[]>([]);
  const [memoryTracking, setMemoryTracking] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);
  const [warningThreshold, setWarningThreshold] = useState(50); // 50MB

  // Memory tracking setup
  useEffect(() => {
    if (memoryTracking && (performance as any).memory) {
      const interval = setInterval(() => {
        if (isRunning) {
          const memory = (performance as any).memory;
          setMemoryPoints(prev => [
            ...prev,
            {
              timestamp: new Date().toISOString(),
              heapUsed: memory.usedJSHeapSize,
              heapTotal: memory.totalJSHeapSize
            }
          ]);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [memoryTracking, isRunning]);

  const runTest = async () => {
    setIsRunning(true);
    const testCase = TEST_CASES[selectedCase as keyof typeof TEST_CASES];
    
    // Clear memory points for new test
    setMemoryPoints([]);
    
    // Initial memory snapshot if available
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      setMemoryPoints([{
        timestamp: new Date().toISOString(),
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        label: 'Start'
      }]);
    }

    // Allow UI to update before running intensive test
    await new Promise(resolve => setTimeout(resolve, 50));

    const result = runPerformanceTest(
      () => extractAndValidateParameters(testCase.routePattern, testCase.actualPath),
      iterations
    );

    // Final memory snapshot if available
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      setMemoryPoints(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          heapUsed: memory.usedJSHeapSize,
          heapTotal: memory.totalJSHeapSize,
          label: 'End'
        }
      ]);
    }

    setResults(prev => [...prev, {
      ...result,
      testCase: testCase.name,
      timestamp: new Date().toISOString()
    }]);

    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
    setMemoryPoints([]);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Warning Threshold (MB)</label>
            <Input
              type="number"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(Number(e.target.value))}
              min={1}
              max={1000}
              disabled={!showWarnings}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={runTest} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Test'}
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
          <Button 
            variant={memoryTracking ? "default" : "outline"} 
            onClick={() => setMemoryTracking(!memoryTracking)}
          >
            {memoryTracking ? 'Disable' : 'Enable'} Memory Tracking
          </Button>
          <Button 
            variant={showWarnings ? "default" : "outline"} 
            onClick={() => setShowWarnings(!showWarnings)}
          >
            {showWarnings ? 'Hide' : 'Show'} Warnings
          </Button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Latest Result</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Test Case:</span> {results[results.length - 1].testCase}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Operations per second:</span> {results[results.length - 1].operationsPerSecond}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Average time per operation:</span> {results[results.length - 1].averageTimePerOperation.toFixed(3)}ms
                  </p>
                  {results[results.length - 1].memoryUsage && (
                    <p className="text-sm">
                      <span className="font-medium">Memory usage:</span> {(results[results.length - 1].memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB
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
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="operationsPerSecond" 
                    stroke="#8884d8" 
                    name="Ops/Second" 
                  />
                </LineChart>
              </div>
            </div>

            <div>
              <MemoryUsageReporter 
                memoryData={memoryPoints}
                showWarnings={showWarnings}
                warningThreshold={warningThreshold}
              />
              
              {memoryPoints.length > 0 && results.some(r => r.memoryUsage?.heapUsed > warningThreshold * 1024 * 1024) && showWarnings && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    High memory usage detected. Consider optimizing the parameter extraction logic.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
        
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2">All Test Results</h3>
          <div className="overflow-auto max-h-96">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Test Case</th>
                  <th className="text-right p-2">Ops/Second</th>
                  <th className="text-right p-2">Avg Time (ms)</th>
                  <th className="text-right p-2">Memory (MB)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{new Date(result.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2">{result.testCase}</td>
                    <td className="text-right p-2">{result.operationsPerSecond}</td>
                    <td className="text-right p-2">{result.averageTimePerOperation.toFixed(3)}</td>
                    <td className="text-right p-2">
                      {result.memoryUsage
                        ? (result.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
